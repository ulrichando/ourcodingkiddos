import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { goalsStore } from "../../parent/goals/route";
import { logger } from "../../../../lib/logger";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role =
    typeof (session?.user as any)?.role === "string"
      ? ((session?.user as any).role as string).toUpperCase()
      : null;

  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all goals from the in-memory store
    const allGoals: any[] = [];

    // Iterate through all parent goals using Array.from for better compatibility
    const entries = Array.from(goalsStore.entries());
    for (const [userId, goals] of entries) {
      // Get parent info
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          parentProfile: {
            select: {
              children: {
                select: {
                  id: true,
                  name: true,
                  totalXp: true,
                },
              },
            },
          },
        },
      });

      if (user) {
        goals.forEach((goal: any) => {
          // Find the student for this goal
          const student = user.parentProfile?.children.find(
            (c) => c.id === goal.studentId
          );

          allGoals.push({
            ...goal,
            currentXp: student?.totalXp || goal.currentXp,
            parentName: user.name || user.email,
            parentEmail: user.email,
            studentName: student?.name || "Unknown Student",
            progress: goal.targetXp > 0
              ? Math.min(100, Math.round(((student?.totalXp || goal.currentXp) / goal.targetXp) * 100))
              : 0,
          });
        });
      }
    }

    // Sort by creation date (newest first)
    allGoals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate summary
    const summary = {
      totalGoals: allGoals.length,
      completedGoals: allGoals.filter((g) => g.progress >= 100).length,
      activeGoals: allGoals.filter((g) => g.progress < 100).length,
      parentsWithGoals: new Set(allGoals.map((g) => g.parentEmail)).size,
    };

    return NextResponse.json({
      goals: allGoals,
      summary,
    });
  } catch (error) {
    logger.db.error("Failed to fetch goals", error);
    return NextResponse.json(
      { error: "Failed to fetch goals", goals: [], summary: null },
      { status: 500 }
    );
  }
}
