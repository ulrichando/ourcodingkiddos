import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

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
    console.error("GET /api/class-requests error:", error);
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
    const userRole = (session as any)?.user?.role?.toUpperCase();

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
      parentNotes
    } = body;

    // Validate required fields
    if (!requestedTopic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Create class request
    const request = await prisma.classRequest.create({
      data: {
        parentEmail: userEmail,
        parentName: userName,
        studentId,
        studentName,
        studentAge,
        requestedTopic,
        description,
        preferredDays: preferredDays || [],
        preferredTimes: preferredTimes || [],
        duration: duration || 60,
        parentNotes,
        status: "PENDING"
      }
    });

    // Create notification for admins
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { email: true }
    });

    // Note: You might want to implement a notification system here
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      request
    });
  } catch (error: any) {
    console.error("POST /api/class-requests error:", error);
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
    console.error("PATCH /api/class-requests error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
