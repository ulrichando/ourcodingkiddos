import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { logger } from "../../../../lib/logger";

/**
 * GET /api/students/activity - Get recent activity for all students of the logged-in parent
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parentEmail = session.user.email.toLowerCase();
  const role = (session as any).user.role;

  try {
    // Build where clause based on role
    const whereClause = role === "ADMIN" || role === "INSTRUCTOR"
      ? {}
      : { parentEmail };

    // Get all student profiles for this parent
    const students = await prisma.studentProfile.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        avatar: true,
        userId: true,
      },
    });

    if (students.length === 0) {
      return NextResponse.json({ activities: [] });
    }

    const userIds = students.map((s) => s.userId);
    const studentMap = new Map(students.map((s) => [s.userId, s]));

    // Fetch recent achievements
    const recentAchievements = await prisma.achievement.findMany({
      where: {
        userId: { in: userIds },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        detail: true,
        icon: true,
        xpAwarded: true,
        createdAt: true,
        userId: true,
      },
    });

    // Fetch recent badge awards
    const recentBadges = await prisma.userBadge.findMany({
      where: {
        userId: { in: userIds },
      },
      orderBy: { awardedAt: "desc" },
      take: 10,
      include: {
        badge: {
          select: {
            name: true,
            icon: true,
          },
        },
      },
    });

    // Fetch recent completed lessons through enrollments
    const recentProgress = await prisma.progress.findMany({
      where: {
        enrollment: {
          userId: { in: userIds },
        },
        status: "COMPLETED",
      },
      orderBy: { completedAt: "desc" },
      take: 10,
      include: {
        enrollment: {
          select: {
            userId: true,
          },
        },
        lesson: {
          select: {
            title: true,
            xpReward: true,
          },
        },
      },
    });

    // Combine and format activities
    const activities: any[] = [];

    recentAchievements.forEach((a) => {
      const student = studentMap.get(a.userId);
      if (student) {
        activities.push({
          id: `achievement-${a.id}`,
          type: "achievement",
          studentId: student.id,
          studentName: student.name,
          studentAvatar: student.avatar,
          title: a.title,
          detail: a.detail,
          icon: a.icon || "🏆",
          xp: a.xpAwarded,
          timestamp: a.createdAt,
        });
      }
    });

    recentBadges.forEach((b) => {
      const student = studentMap.get(b.userId);
      if (student) {
        activities.push({
          id: `badge-${b.id}`,
          type: "badge",
          studentId: student.id,
          studentName: student.name,
          studentAvatar: student.avatar,
          title: `Earned "${b.badge.name}" badge`,
          detail: null,
          icon: b.badge.icon || "🏅",
          xp: 0,
          timestamp: b.awardedAt,
        });
      }
    });

    recentProgress.forEach((p) => {
      const student = studentMap.get(p.enrollment.userId);
      if (student && p.completedAt) {
        activities.push({
          id: `lesson-${p.id}`,
          type: "lesson",
          studentId: student.id,
          studentName: student.name,
          studentAvatar: student.avatar,
          title: `Completed "${p.lesson.title}"`,
          detail: null,
          icon: "📚",
          xp: p.xpEarned || p.lesson.xpReward || 0,
          timestamp: p.completedAt,
        });
      }
    });

    // Sort by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      activities: activities.slice(0, 20),
    });
  } catch (error) {
    logger.db.error("Students activity fetch error", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
