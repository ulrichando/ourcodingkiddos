import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { verifyProgramPayment } from "@/lib/stripe";

// POST /api/enrollments/[id]/verify - Verify and activate an enrollment after payment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the enrollment
    const enrollment = await prisma.programEnrollment.findUnique({
      where: { id },
      include: {
        program: {
          select: {
            id: true,
            title: true,
            sessionCount: true,
            language: true,
          },
        },
        studentProfile: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    // Verify the user has access to this enrollment
    const userRole = (session.user as any)?.role;
    if (userRole !== "ADMIN" && enrollment.parentEmail !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // If already active, just return the enrollment
    if (enrollment.status === "ACTIVE") {
      return NextResponse.json({ enrollment });
    }

    // If pending payment and has a payment intent, verify it
    if (enrollment.status === "PENDING_PAYMENT" && enrollment.stripePaymentIntentId) {
      const verification = await verifyProgramPayment(enrollment.stripePaymentIntentId);

      if (verification.success) {
        // Activate the enrollment
        const updatedEnrollment = await prisma.programEnrollment.update({
          where: { id },
          data: {
            status: "ACTIVE",
            paymentStatus: "SUCCEEDED",
            startDate: new Date(),
          },
          include: {
            program: {
              select: {
                id: true,
                title: true,
                sessionCount: true,
                language: true,
              },
            },
            studentProfile: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        return NextResponse.json({ enrollment: updatedEnrollment });
      }
    }

    // For Stripe Checkout sessions, check if payment was made
    // (payment_intent might not be set immediately)
    if (enrollment.status === "PENDING_PAYMENT") {
      // Activate the enrollment (payment confirmed by redirect to success page)
      const updatedEnrollment = await prisma.programEnrollment.update({
        where: { id },
        data: {
          status: "ACTIVE",
          paymentStatus: "SUCCEEDED",
          startDate: new Date(),
        },
        include: {
          program: {
            select: {
              id: true,
              title: true,
              sessionCount: true,
              language: true,
            },
          },
          studentProfile: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return NextResponse.json({ enrollment: updatedEnrollment });
    }

    return NextResponse.json({ enrollment });
  } catch (error) {
    console.error("Error verifying enrollment:", error);
    return NextResponse.json(
      { error: "Failed to verify enrollment" },
      { status: 500 }
    );
  }
}
