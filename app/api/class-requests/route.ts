import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { logger } from "../../../lib/logger";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase();
    const userRole = (session as any)?.user?.role?.toUpperCase();

    let requests;

    // Admin and instructors can see all requests
    if (userRole === "ADMIN" || userRole === "INSTRUCTOR") {
      requests = await prisma.classRequest.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // Parents see only their requests
      requests = await prisma.classRequest.findMany({
        where: { parentEmail: userEmail },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json({ requests });
  } catch (error: any) {
    logger.api.error("GET /api/class-requests error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase();
    const userName = session.user.name;

    const body = await req.json();
    const {
      studentId,
      studentName,
      studentAge,
      requestedTopic,
      description,
      preferredDays,
      preferredTimes,
      duration,
      parentNotes,
      // New pricing fields
      numberOfSessions,
      daysPerWeek,
      numberOfWeeks,
      totalPrice,
      pricePerSession,
      discountApplied,
      preferredInstructorId,
      preferredInstructorName
    } = body;

    // Validate required fields
    if (!requestedTopic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Create class request with pricing info (pending admin review)
    const request = await prisma.classRequest.create({
      data: {
        parentEmail: userEmail,
        parentName: userName,
        studentId: studentId || undefined,
        studentName: studentName || undefined,
        studentAge: studentAge ? parseInt(studentAge) : undefined,
        requestedTopic,
        description: description || undefined,
        preferredDays: preferredDays || [],
        preferredTimes: preferredTimes || [],
        duration: duration || 60,
        parentNotes: parentNotes || undefined,
        // Pricing info
        numberOfSessions: numberOfSessions || undefined,
        daysPerWeek: daysPerWeek || undefined,
        numberOfWeeks: numberOfWeeks || undefined,
        totalPrice: totalPrice || undefined,
        pricePerSession: pricePerSession || undefined,
        discountApplied: discountApplied || undefined,
        // Instructor preference
        preferredInstructorId: preferredInstructorId || undefined,
        preferredInstructorName: preferredInstructorName || undefined,
        // Status - pending admin review, no payment yet
        status: "PENDING",
        paymentStatus: null
      }
    });

    return NextResponse.json({
      success: true,
      request
    });
  } catch (error: any) {
    logger.api.error("POST /api/class-requests error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session as any)?.user?.role?.toUpperCase();

    // Only admins and instructors can update requests
    if (userRole !== "ADMIN" && userRole !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      id,
      status,
      instructorEmail,
      instructorName,
      scheduledDate,
      scheduledTime,
      adminNotes,
      rejectionReason
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
    }

    const request = await prisma.classRequest.update({
      where: { id },
      data: {
        status,
        instructorEmail,
        instructorName,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
        scheduledTime,
        adminNotes,
        rejectionReason,
        reviewedAt: new Date(),
        scheduledAt: status === "SCHEDULED" ? new Date() : undefined
      }
    });

    return NextResponse.json({ success: true, request });
  } catch (error: any) {
    logger.api.error("PATCH /api/class-requests error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
