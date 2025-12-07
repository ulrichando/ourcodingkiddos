import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  // Public endpoint to list upcoming scheduled class sessions
  try {
    // Fetch actual scheduled class sessions from the database
    const now = new Date();

    const sessions = await prisma.classSession.findMany({
      where: {
        status: "SCHEDULED",
        startTime: { gte: now },
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
        programId: true,
        instructorEmail: true,
      },
    });

    // If we have program IDs, fetch program details for thumbnails
    const programIds = sessions
      .map((s) => s.programId)
      .filter((id): id is string => id !== null);

    const programs = programIds.length > 0
      ? await prisma.program.findMany({
          where: { id: { in: programIds } },
          select: {
            id: true,
            slug: true,
            thumbnailUrl: true,
          },
        })
      : [];

    const programMap = new Map(programs.map((p) => [p.id, p]));

    // Enrich sessions with program info
    const enrichedSessions = sessions.map((session) => {
      const program = session.programId ? programMap.get(session.programId) : null;
      return {
        ...session,
        programSlug: program?.slug || null,
        thumbnailUrl: program?.thumbnailUrl || null,
      };
    });

    return NextResponse.json({ sessions: enrichedSessions });
  } catch (e) {
    console.error("[classes] GET error:", e);
    return NextResponse.json({ error: "Failed to load classes" }, { status: 500 });
  }
}
