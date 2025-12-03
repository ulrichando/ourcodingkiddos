import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

function generateMeetLink() {
  const rand = Math.random().toString(36).slice(2, 12);
  return `https://meet.google.com/${rand}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const email = session?.user?.email;

  if (!session?.user || (role !== "INSTRUCTOR" && role !== "ADMIN") || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    meetingUrl,
    isRecurring,
    recurrencePattern,
    numberOfWeeks,
  } = body ?? {};

  if (!title || !sessionType || !startTime || !durationMinutes) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // For 1-on-1 sessions, enforce maxStudents = 1
  const finalMaxStudents = sessionType === "ONE_ON_ONE" ? 1 : (maxStudents ? Number(maxStudents) : null);

  try {
    // Calculate all dates for recurring sessions
    const dates: Date[] = [];
    const baseDate = new Date(startTime);
    const sessionsToCreate = isRecurring ? (numberOfWeeks || 1) : 1;

    for (let i = 0; i < sessionsToCreate; i++) {
      const newDate = new Date(baseDate);
      if (isRecurring && recurrencePattern) {
        if (recurrencePattern === "WEEKLY") {
          newDate.setDate(baseDate.getDate() + (i * 7));
        } else if (recurrencePattern === "BIWEEKLY") {
          newDate.setDate(baseDate.getDate() + (i * 14));
        } else if (recurrencePattern === "MONTHLY") {
          newDate.setMonth(baseDate.getMonth() + i);
        }
      }
      dates.push(newDate);
    }

    // Create all sessions
    const createdSessions = [];
    for (const date of dates) {
      // Generate unique meet link for each session if not provided
      const link = meetingUrl && meetingUrl.trim().length > 0 ? meetingUrl.trim() : generateMeetLink();

      const created = await prisma.classSession.create({
        data: {
          instructorEmail: email,
          title,
          description,
          sessionType,
          language,
          ageGroup,
          startTime: date,
          durationMinutes: Number(durationMinutes),
          maxStudents: finalMaxStudents,
          meetingUrl: link,
          status: "SCHEDULED",
          isRecurring: isRecurring || false,
          recurrencePattern: isRecurring ? recurrencePattern : null,
        },
        select: {
          id: true,
          title: true,
          sessionType: true,
          startTime: true,
          meetingUrl: true,
        },
      });
      createdSessions.push(created);
    }

    return NextResponse.json({
      sessions: createdSessions,
      count: createdSessions.length,
      message: `Successfully created ${createdSessions.length} class session(s)`
    });
  } catch (e) {
    console.error("Failed to create class:", e);
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const email = session?.user?.email;

  if (!session?.user || !email || (role !== "INSTRUCTOR" && role !== "ADMIN")) {
    // Allow read access for students/parents to see list of classes
    const sessions = await prisma.classSession.findMany({
      where: { status: "SCHEDULED", startTime: { gt: new Date() } },
      orderBy: { startTime: "asc" },
      select: {
        id: true,
        title: true,
        sessionType: true,
        startTime: true,
        durationMinutes: true,
        maxStudents: true,
        enrolledCount: true,
        meetingUrl: true,
      },
    });
    return NextResponse.json({ sessions });
  }

  // Instructors should see all scheduled classes (including those created by others) so they can manage or join.
  const includeFrom = new Date(Date.now() - 60 * 60 * 1000);
  const sessions = await prisma.classSession.findMany({
    where: { status: "SCHEDULED", startTime: { gte: includeFrom } },
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      title: true,
      sessionType: true,
      startTime: true,
      durationMinutes: true,
      maxStudents: true,
      enrolledCount: true,
      meetingUrl: true,
      instructorEmail: true,
    },
  });

  return NextResponse.json({ sessions });
}
