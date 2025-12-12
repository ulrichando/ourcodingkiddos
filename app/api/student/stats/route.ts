import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Get student profile
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        studentProfile: {
          select: {
            id: true,
            totalXp: true,
            currentLevel: true,
            streakDays: true,
          },
        },
      },
    });

    if (!user || !user.studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    // Get lessons completed
    const lessonsCompleted = await prisma.progress.count({
      where: {
        enrollment: {
          userId: user.id,
        },
        status: "COMPLETED",
      },
    });

    // Get quizzes passed (assuming score >= 70 is passing)
    const quizzesPassed = await prisma.progress.count({
      where: {
        enrollment: {
          userId: user.id,
        },
        status: "COMPLETED",
        quizScore: {
          gte: 70,
        },
      },
    });

    // Get badges earned
    const badgesEarned = await prisma.userBadge.count({
      where: {
        userId: user.id,
      },
    });

    const stats = {
      lessonsCompleted,
      quizzesPassed,
      badgesEarned,
      streakDays: user.studentProfile.streakDays || 0,
      totalXp: user.studentProfile.totalXp || 0,
      currentLevel: user.studentProfile.currentLevel || 1,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET /api/student/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
