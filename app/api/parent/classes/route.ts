import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logger } from "../../../../lib/logger";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parentEmail = session.user.email.toLowerCase();

  try {
    // Get the parent's children
    const parentProfile = await prisma.parentProfile.findFirst({
      where: {
        user: {
          email: { equals: parentEmail, mode: "insensitive" },
        },
      },
      include: {
        children: {
          select: {
            id: true,
            userId: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!parentProfile || parentProfile.children.length === 0) {
      return NextResponse.json({ sessions: [] });
    }

    // Get user IDs of all children
    const childUserIds = parentProfile.children
      .map((child) => child.userId)
      .filter((id): id is string => id !== null);

    if (childUserIds.length === 0) {
      return NextResponse.json({ sessions: [] });
    }

    // Create a map of userId to student info
    const studentInfoMap = new Map<string, { id: string; name: string | null; avatar: string | null }>();
    for (const child of parentProfile.children) {
      if (child.userId) {
        studentInfoMap.set(child.userId, {
          id: child.id,
          name: child.name,
          avatar: child.avatar,
        });
      }
    }

    const includeFrom = new Date(Date.now() - 60 * 60 * 1000); // buffer 1 hour back

    // Get all bookings for the parent's children
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { studentId: { in: childUserIds } },
          { parentEmail: { equals: parentEmail, mode: "insensitive" } },
        ],
        status: { in: ["SCHEDULED", "CONFIRMED"] },
        sessionId: { not: null },
      },
      select: {
        id: true,
        studentId: true,
        sessionId: true,
        startsAt: true,
      },
    });

    if (bookings.length === 0) {
      return NextResponse.json({ sessions: [] });
    }

    // Get unique session IDs
    const sessionIds = Array.from(new Set(bookings.map((b) => b.sessionId).filter((id): id is string => id !== null)));

    // Get the class sessions
    const classSessions = await prisma.classSession.findMany({
      where: {
        id: { in: sessionIds },
        status: "SCHEDULED",
        startTime: { gte: includeFrom },
      },
      select: {
        id: true,
        title: true,
        description: true,
        language: true,
        ageGroup: true,
        sessionType: true,
        startTime: true,
        durationMinutes: true,
        maxStudents: true,
        enrolledCount: true,
        meetingUrl: true,
        instructorEmail: true,
        status: true,
      },
      orderBy: { startTime: "asc" },
    });

    // Map sessions with enrolled students
    const sessionsWithStudents = classSessions.map((classSession) => {
      // Find all bookings for this session
      const sessionBookings = bookings.filter((b) => b.sessionId === classSession.id);

      // Get student info for each booking
      const enrolledStudents = sessionBookings
        .map((booking) => {
          const studentInfo = studentInfoMap.get(booking.studentId);
          if (studentInfo) {
            return {
              id: studentInfo.id,
              name: studentInfo.name || "Student",
              avatar: studentInfo.avatar,
            };
          }
          return null;
        })
        .filter((s): s is { id: string; name: string; avatar: string | null } => s !== null);

      // Deduplicate students
      const uniqueStudents = Array.from(
        new Map(enrolledStudents.map((s) => [s.id, s])).values()
      );

      return {
        ...classSession,
        start: classSession.startTime,
        enrolledStudents: uniqueStudents,
      };
    });

    return NextResponse.json({ sessions: sessionsWithStudents });
  } catch (error) {
    logger.db.error("[parent/classes] Error", error);
    return NextResponse.json({ error: "Failed to load classes" }, { status: 500 });
  }
}
