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
    programId,
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
          ...(programId ? { programId } : {}),
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
    const now = new Date();
    const sessions = await prisma.classSession.findMany({
      where: { status: "SCHEDULED", startTime: { gte: now } },
      orderBy: { startTime: "asc" },
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
        programId: true,
      },
    });

    // Enrich with program info
    const programIds = sessions
      .map((s) => s.programId)
      .filter((id): id is string => id !== null);

    const programs = programIds.length > 0
      ? await prisma.program.findMany({
          where: { id: { in: programIds } },
          select: { id: true, slug: true, thumbnailUrl: true },
        })
      : [];

    const programMap = new Map(programs.map((p) => [p.id, p]));

    const enrichedSessions = sessions.map((s) => {
      const program = s.programId ? programMap.get(s.programId) : null;
      return {
        ...s,
        programSlug: program?.slug || null,
        thumbnailUrl: program?.thumbnailUrl || null,
      };
    });

    return NextResponse.json({ sessions: enrichedSessions });
  }

  // Instructors see ALL classes from currently running programs
  // This allows any instructor to see available classes they can teach
  const includeFrom = new Date(Date.now() - 60 * 60 * 1000);
  const now = new Date();

  console.log('[Instructor Classes API] Fetching classes for instructor:', email);

  // Get currently running programs (programs that are published and within their date range)
  const runningPrograms = await prisma.program.findMany({
    where: {
      isPublished: true,
      OR: [
        {
          // Programs with date ranges that are currently active
          AND: [
            { startDate: { lte: now } },
            { endDate: { gte: now } },
          ],
        },
        {
          // Programs without end dates that have started
          startDate: { lte: now },
          endDate: null,
        },
        {
          // Programs without dates (always available)
          startDate: null,
          endDate: null,
        },
      ],
    },
    select: { id: true },
  });

  const runningProgramIds = runningPrograms.map(p => p.id);

  console.log('[Instructor Classes API] Found', runningProgramIds.length, 'running programs');
  console.log('[Instructor Classes API] Running program IDs:', runningProgramIds);

  // ONLY show classes from currently running published programs
  // Do NOT show standalone classes (programId: null)
  const sessions = await prisma.classSession.findMany({
    where: {
      status: "SCHEDULED",
      startTime: { gte: includeFrom },
      programId: { in: runningProgramIds },  // ONLY from running programs
    },
    orderBy: { startTime: "asc" },
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
      programId: true,
    },
  });

  // Enrich with program info for consistency with public API
  const programIds = sessions
    .map((s) => s.programId)
    .filter((id): id is string => id !== null);

  const programs = programIds.length > 0
    ? await prisma.program.findMany({
        where: { id: { in: programIds } },
        select: { id: true, slug: true, thumbnailUrl: true },
      })
    : [];

  const programMap = new Map(programs.map((p) => [p.id, p]));

  const enrichedSessions = sessions.map((session) => {
    const program = session.programId ? programMap.get(session.programId) : null;
    return {
      ...session,
      programSlug: program?.slug || null,
      thumbnailUrl: program?.thumbnailUrl || null,
    };
  });

  console.log('[Instructor Classes API] Found', enrichedSessions.length, 'classes for instructor:', email);

  return NextResponse.json({ sessions: enrichedSessions });
}
