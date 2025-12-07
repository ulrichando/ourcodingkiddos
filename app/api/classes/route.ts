import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Get the next N upcoming weekend dates (Saturday and Sunday)
function getUpcomingWeekendDates(count: number = 4): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  const currentDay = now.getDay();

  // Find next Saturday (day 6) or Sunday (day 0)
  let daysUntilSaturday = (6 - currentDay + 7) % 7;
  if (daysUntilSaturday === 0 && now.getHours() >= 10) {
    // If today is Saturday but class already passed, go to Sunday
    daysUntilSaturday = 1;
  }

  let nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysUntilSaturday);
  nextDate.setHours(9, 0, 0, 0); // 9am

  while (dates.length < count) {
    const dayOfWeek = nextDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
      dates.push(new Date(nextDate));
    }
    nextDate.setDate(nextDate.getDate() + 1);
  }

  return dates;
}

export async function GET() {
  // Public endpoint to list upcoming classes based on published programs
  try {
    // Fetch published programs
    const programs = await prisma.program.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { orderIndex: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        language: true,
        ageGroup: true,
        sessionDuration: true,
        thumbnailUrl: true,
      },
    });

    if (programs.length === 0) {
      return NextResponse.json({ sessions: [] });
    }

    // Generate upcoming weekend sessions for each program
    const upcomingDates = getUpcomingWeekendDates(4);
    const sessions = [];

    for (const program of programs) {
      // Create a session entry for the next available weekend date
      const nextDate = upcomingDates[0];
      sessions.push({
        id: `${program.id}-${nextDate.toISOString()}`,
        programId: program.id,
        programSlug: program.slug,
        title: program.title,
        description: program.shortDescription || `Live ${program.title} class session`,
        language: program.language,
        ageGroup: program.ageGroup,
        sessionType: "GROUP",
        startTime: nextDate.toISOString(),
        durationMinutes: program.sessionDuration || 60,
        maxStudents: 10,
        enrolledCount: 0,
        thumbnailUrl: program.thumbnailUrl,
      });
    }

    // Sort by start time
    sessions.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    return NextResponse.json({ sessions });
  } catch (e) {
    console.error("[classes] GET error:", e);
    return NextResponse.json({ error: "Failed to load classes" }, { status: 500 });
  }
}
