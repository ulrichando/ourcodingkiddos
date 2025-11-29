import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  // Public endpoint to list upcoming classes (students/parents can call this)
  try {
    const includeFrom = new Date(Date.now() - 60 * 60 * 1000); // buffer 1 hour back to avoid timezone and late calls
    const sessions = await prisma.classSession.findMany({
      where: {
        status: "SCHEDULED",
        startTime: { gte: includeFrom },
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
      },
    });
    return NextResponse.json({ sessions });
  } catch (e) {
    return NextResponse.json({ error: "Failed to load classes" }, { status: 500 });
  }
}
