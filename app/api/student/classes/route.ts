import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateLastSeen } from "@/lib/update-last-seen";
import { logger } from "@/lib/logger";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email.toLowerCase();

  // Update last seen timestamp for student
  await updateLastSeen(userEmail);

  try {
    // Get the user and their student profile
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        studentProfile: {
          select: {
            id: true,
            userId: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the student's userId - this is what's stored in bookings
    const studentUserId = user.id;
    const studentProfileId = user.studentProfile?.id;

    if (!studentUserId && !studentProfileId) {
      return NextResponse.json({ sessions: [] });
    }

    const includeFrom = new Date(Date.now() - 60 * 60 * 1000); // buffer 1 hour back

    // Get all bookings for this student
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { studentId: studentUserId },
          ...(studentProfileId ? [{ studentId: studentProfileId }] : []),
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
    const sessionIds = Array.from(
      new Set(
        bookings.map((b) => b.sessionId).filter((id): id is string => id !== null)
      )
    );

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

    // Format sessions for the frontend
    const sessions = classSessions.map((classSession) => ({
      ...classSession,
      start: classSession.startTime,
    }));

    return NextResponse.json({ sessions });
  } catch (error) {
    logger.db.error("GET /api/student/classes error", error);
    return NextResponse.json(
      { error: "Failed to load classes" },
      { status: 500 }
    );
  }
}
