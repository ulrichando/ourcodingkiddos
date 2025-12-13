import { NextResponse, type NextRequest } from "next/server";
import prisma from "../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { logger } from "../../../../../lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parentEmail = session.user.email.toLowerCase();
  const role = (session as any).user.role;
  const { id: studentId } = await params;

  // Get period filter from query params
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "all";

  // Calculate date range based on period
  const now = new Date();
  let dateFilter: Date | undefined;
  switch (period) {
    case "week":
      dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      dateFilter = undefined;
  }

  try {
    // Get student profile with date-filtered data
    const student = await prisma.studentProfile.findFirst({
      where: {
        id: studentId,
        ...(role === "ADMIN" || role === "INSTRUCTOR" ? {} : { parentEmail }),
      },
      include: {
        user: {
          include: {
            badges: {
              include: {
                badge: true,
              },
              where: dateFilter ? { awardedAt: { gte: dateFilter } } : undefined,
              orderBy: {
                awardedAt: "desc",
              },
            },
            achievements: {
              where: dateFilter ? { createdAt: { gte: dateFilter } } : undefined,
              orderBy: {
                createdAt: "desc",
              },
              take: 10,
            },
            enrollments: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true,
                    language: true,
                    totalXp: true,
                  },
                },
                progress: {
                  where: dateFilter ? { completedAt: { gte: dateFilter } } : undefined,
                  include: {
                    lesson: {
                      select: {
                        id: true,
                        title: true,
                        xpReward: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Calculate skill progress from course enrollments
    const skillProgress: Record<string, { completed: number; total: number }> = {};
    let totalLessonsCompleted = 0;

    student.user.enrollments.forEach((enrollment) => {
      const language = enrollment.course.language;
      if (!skillProgress[language]) {
        skillProgress[language] = { completed: 0, total: 0 };
      }

      enrollment.progress.forEach((p) => {
        skillProgress[language].total++;
        if (p.status === "COMPLETED") {
          skillProgress[language].completed++;
          totalLessonsCompleted++;
        }
      });
    });

    // Format skill progress as percentages
    const skills = Object.entries(skillProgress).map(([skill, data]) => ({
      skill,
      progress: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      completed: data.completed,
      total: data.total,
    }));

    // Get recent achievements
    const recentAchievements = student.user.achievements.map((a) => ({
      id: a.id,
      title: a.title,
      detail: a.detail,
      icon: a.icon,
      xpAwarded: a.xpAwarded,
      createdAt: a.createdAt,
    }));

    // Get badges
    const badges = student.user.badges.map((ub) => ({
      id: ub.badge.id,
      name: ub.badge.name,
      description: ub.badge.description,
      icon: ub.badge.icon,
      category: ub.badge.category,
      rarity: ub.badge.rarity,
      awardedAt: ub.awardedAt,
    }));

    // Get course progress
    const courseProgress = student.user.enrollments.map((enrollment) => {
      const completedLessons = enrollment.progress.filter((p) => p.status === "COMPLETED").length;
      const totalLessons = enrollment.progress.length;
      const xpEarned = enrollment.progress.reduce((sum, p) => sum + (p.xpEarned || 0), 0);

      return {
        courseId: enrollment.course.id,
        courseTitle: enrollment.course.title,
        language: enrollment.course.language,
        completedLessons,
        totalLessons,
        progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        xpEarned,
        status: enrollment.status,
      };
    });

    return NextResponse.json({
      student: {
        id: student.id,
        name: student.name,
        avatar: student.avatar,
        totalXp: student.totalXp,
        currentLevel: student.currentLevel,
        streakDays: student.streakDays,
        lastActiveDate: student.lastActiveDate,
      },
      stats: {
        totalLessonsCompleted,
        totalBadges: badges.length,
        totalAchievements: student.user.achievements.length,
        totalXp: student.totalXp,
        currentLevel: student.currentLevel,
        streakDays: student.streakDays,
      },
      skills,
      badges,
      recentAchievements,
      courseProgress,
      period,
    });
  } catch (error) {
    logger.db.error("GET /api/students/[id]/progress error", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}
