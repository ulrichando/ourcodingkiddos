import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createProgramCheckoutSession } from "@/lib/stripe";
import { logger } from "@/lib/logger";

// POST /api/programs/[id]/enroll - Create checkout session for program enrollment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Please sign in to enroll" }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;

    // Only parents can enroll students
    if (userRole !== "PARENT" && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Only parents can enroll students in programs" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { studentProfileId } = body;

    if (!studentProfileId) {
      return NextResponse.json(
        { error: "Please select a student to enroll" },
        { status: 400 }
      );
    }

    // Get the program
    const program = await prisma.program.findUnique({
      where: { id },
    });

    if (!program || !program.isPublished) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Verify the student belongs to this parent
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        user: { select: { email: true } },
        guardian: { include: { user: { select: { email: true } } } },
      },
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check if parent has access to this student
    const parentEmail = session.user.email;
    const isGuardian =
      studentProfile.guardian?.user.email === parentEmail ||
      studentProfile.parentEmail === parentEmail;

    if (userRole !== "ADMIN" && !isGuardian) {
      return NextResponse.json(
        { error: "You can only enroll your own children" },
        { status: 403 }
      );
    }

    // Check if student is already enrolled in this program
    const existingEnrollment = await prisma.programEnrollment.findFirst({
      where: {
        programId: id,
        studentProfileId,
        status: { in: ["ACTIVE", "PENDING_PAYMENT", "PAUSED"] },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Student is already enrolled in this program" },
        { status: 400 }
      );
    }

    // Create a pending enrollment
    const enrollment = await prisma.programEnrollment.create({
      data: {
        programId: id,
        studentProfileId,
        parentEmail,
        paidAmountCents: program.priceCents,
        status: "PENDING_PAYMENT",
        paymentStatus: "PENDING",
      },
    });

    // Get the base URL for success/cancel URLs
    const baseUrl = request.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Create Stripe checkout session
    const checkoutSession = await createProgramCheckoutSession(
      {
        programId: program.id,
        programTitle: program.title,
        studentProfileId,
        studentName: studentProfile.name || "Student",
        amountCents: program.priceCents,
        parentEmail,
        sessionCount: program.sessionCount,
      },
      `${baseUrl}/programs/${program.slug}/success?enrollment=${enrollment.id}`,
      `${baseUrl}/programs/${program.slug}?cancelled=true`
    );

    // Update enrollment with payment intent if available
    if (checkoutSession.payment_intent) {
      await prisma.programEnrollment.update({
        where: { id: enrollment.id },
        data: {
          stripePaymentIntentId: checkoutSession.payment_intent as string,
        },
      });
    }

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
      enrollmentId: enrollment.id,
    });
  } catch (error) {
    logger.db.error("Error creating enrollment", error);
    return NextResponse.json(
      { error: "Failed to create enrollment" },
      { status: 500 }
    );
  }
}

// GET /api/programs/[id]/enroll - Check enrollment status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ enrollments: [] });
    }

    const parentEmail = session.user.email;

    // Get all enrollments for this program by this parent
    const enrollments = await prisma.programEnrollment.findMany({
      where: {
        programId: id,
        parentEmail,
      },
      include: {
        studentProfile: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        program: {
          select: {
            title: true,
            sessionCount: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ enrollments });
  } catch (error) {
    logger.db.error("Error fetching enrollments", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}
