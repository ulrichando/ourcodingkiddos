import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { updateLastSeen } from "../../../../lib/update-last-seen";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Update last seen timestamp for instructor
    await updateLastSeen(userEmail);

    // Get the current date/time
    const now = new Date();

    // 1. Get programs where the instructor has classes assigned
    const instructorClasses = await prisma.classSession.findMany({
      where: {
        instructorEmail: userEmail,
        status: "SCHEDULED",
      },
      select: {
        programId: true,
      },
      distinct: ["programId"],
    });

    const programIds = instructorClasses
      .filter((c) => c.programId)
      .map((c) => c.programId as string);

    // 2. Fetch all programs the instructor is assigned to (currently running published programs)
    const programs = await prisma.program.findMany({
      where: {
        id: { in: programIds },
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnailUrl: true,
        language: true,
        ageGroup: true,
        sessionCount: true,
        startDate: true,
        endDate: true,
        isPublished: true,
      },
      orderBy: { title: "asc" },
    });

    // 3. Fetch all classes for the instructor
    const classes = await prisma.classSession.findMany({
      where: {
        instructorEmail: userEmail,
        status: "SCHEDULED",
        startTime: { gte: new Date(Date.now() - 60 * 60 * 1000) }, // Include from 1 hour ago
      },
      select: {
        id: true,
        title: true,
        description: true,
        sessionType: true,
        language: true,
        ageGroup: true,
        startTime: true,
        durationMinutes: true,
        enrolledCount: true,
        maxStudents: true,
        meetingUrl: true,
        programId: true,
      },
      orderBy: { startTime: "asc" },
    });

    // 4. Fetch all assignments created by the instructor
    const assignments = await prisma.assignment.findMany({
      where: {
        instructorEmail: userEmail,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        type: true,
        maxPoints: true,
        programId: true,
        submissions: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    // 5. Get student count for each assignment
    const assignmentsWithCounts = await Promise.all(
      assignments.map(async (assignment) => {
        // Get unique students enrolled in classes for this program/assignment
        let totalStudents = 0;

        if (assignment.programId) {
          const programClasses = await prisma.classSession.findMany({
            where: {
              programId: assignment.programId,
              instructorEmail: userEmail,
            },
            select: {
              enrolledCount: true,
            },
          });
          totalStudents = programClasses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
        }

        return {
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate?.toISOString() || null,
          type: assignment.type,
          maxPoints: assignment.maxPoints,
          programId: assignment.programId,
          submissionCount: assignment.submissions.filter(
            (s) => s.status === "SUBMITTED" || s.status === "GRADED"
          ).length,
          totalStudents,
        };
      })
    );

    return NextResponse.json({
      programs: programs.map((p) => ({
        ...p,
        startDate: p.startDate?.toISOString() || null,
        endDate: p.endDate?.toISOString() || null,
      })),
      classes: classes.map((c) => ({
        ...c,
        startTime: c.startTime.toISOString(),
      })),
      assignments: assignmentsWithCounts,
    });
  } catch (error) {
    console.error("[Instructor Schedule API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}
