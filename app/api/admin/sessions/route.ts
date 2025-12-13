import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { logger } from "../../../../lib/logger";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session as any)?.user?.role?.toUpperCase();

    // Only admins and instructors can view sessions management
    if (userRole !== "ADMIN" && userRole !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all class sessions
    const sessions = await prisma.classSession.findMany({
      orderBy: { startTime: 'desc' },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });

    return NextResponse.json({ sessions });
  } catch (error: any) {
    logger.db.error("Failed to fetch sessions", error);
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
    const userRole = (session as any)?.user?.role?.toUpperCase();

    // Only admins can create sessions
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      sessionType,
      language,
      ageGroup,
      startTime,
      durationMinutes,
      maxStudents,
      priceCents,
      meetingUrl,
      instructorEmail,
      isRecurring,
      recurrencePattern
    } = body;

    // Validate required fields
    if (!title || !sessionType || !language || !ageGroup || !startTime || !durationMinutes) {
      return NextResponse.json(
        { error: "Missing required fields: title, sessionType, language, ageGroup, startTime, durationMinutes" },
        { status: 400 }
      );
    }

    // Find instructor by email if provided
    let instructorId = null;
    if (instructorEmail) {
      const instructor = await prisma.user.findUnique({
        where: { email: instructorEmail.toLowerCase() },
        select: { id: true, role: true }
      });

      if (!instructor) {
        return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
      }

      if (instructor.role !== "INSTRUCTOR" && instructor.role !== "ADMIN") {
        return NextResponse.json({ error: "User is not an instructor" }, { status: 400 });
      }

      instructorId = instructor.id;
    }

    // Create class session
    const classSession = await prisma.classSession.create({
      data: {
        title,
        description: description || null,
        sessionType: sessionType.toUpperCase(),
        language: language.toUpperCase(),
        ageGroup: ageGroup.toUpperCase(),
        startTime: new Date(startTime),
        durationMinutes: parseInt(durationMinutes),
        maxStudents: maxStudents ? parseInt(maxStudents) : null,
        priceCents: priceCents ? parseInt(priceCents) : 0,
        meetingUrl: meetingUrl || null,
        instructorEmail: instructorEmail || userEmail,
        instructorId: instructorId,
        isRecurring: isRecurring || false,
        recurrencePattern: recurrencePattern || null,
        status: "SCHEDULED",
        enrolledCount: 0
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, session: classSession });
  } catch (error: any) {
    logger.db.error("Failed to create session", error);
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

    // Only admins can update sessions
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Handle instructor update if instructorEmail is provided
    if (updateData.instructorEmail) {
      const instructor = await prisma.user.findUnique({
        where: { email: updateData.instructorEmail.toLowerCase() },
        select: { id: true, role: true }
      });

      if (instructor && (instructor.role === "INSTRUCTOR" || instructor.role === "ADMIN")) {
        updateData.instructorId = instructor.id;
      }
    }

    // Convert date fields
    if (updateData.startTime) {
      updateData.startTime = new Date(updateData.startTime);
    }

    // Convert numeric fields
    if (updateData.durationMinutes) {
      updateData.durationMinutes = parseInt(updateData.durationMinutes);
    }
    if (updateData.maxStudents) {
      updateData.maxStudents = parseInt(updateData.maxStudents);
    }
    if (updateData.priceCents) {
      updateData.priceCents = parseInt(updateData.priceCents);
    }

    const updatedSession = await prisma.classSession.update({
      where: { id },
      data: updateData,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (error: any) {
    logger.db.error("Failed to update session", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session as any)?.user?.role?.toUpperCase();

    // Only admins can delete sessions
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Check if session has bookings
    const sessionWithBookings = await prisma.classSession.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });

    if (!sessionWithBookings) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (sessionWithBookings._count.bookings > 0) {
      // Don't delete, just cancel it
      await prisma.classSession.update({
        where: { id },
        data: { status: "CANCELLED" }
      });

      return NextResponse.json({
        success: true,
        message: "Session has bookings, marked as cancelled instead of deleting"
      });
    }

    // Delete session if no bookings
    await prisma.classSession.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Session deleted" });
  } catch (error: any) {
    logger.db.error("Failed to delete session", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
