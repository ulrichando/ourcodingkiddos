import { NextResponse, type NextRequest } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: studentId } = await params;

  try {
    // Get student profile
    const student = await prisma.studentProfile.findFirst({
      where: { id: studentId },
      include: {
        user: {
          include: {
            badges: {
              include: {
                badge: true,
              },
            },
            achievements: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Get completed lessons count through enrollments
    const completedLessons = await prisma.progress.count({
      where: {
        enrollment: {
          userId: student.userId,
        },
        status: "COMPLETED",
      },
    });

    // Get quizzes passed (lessons with quiz score >= 70)
    const quizzesPassed = await prisma.progress.count({
      where: {
        enrollment: {
          userId: student.userId,
        },
        quizScore: { gte: 70 },
      },
    });

    // Get badges earned
    const badgesEarned = student.user.badges.length;

    // Get enrollments with progress
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: student.userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            language: true,
            lessons: { select: { id: true } },
          },
        },
        progress: {
          where: { status: "COMPLETED" },
        },
      },
    });

    // Calculate courses in progress
    const coursesInProgress = enrollments.filter((e) => {
      const totalLessons = e.course.lessons.length;
      const completedLessonsInCourse = e.progress.length;
      return completedLessonsInCourse > 0 && completedLessonsInCourse < totalLessons;
    });

    // Get recommended courses (not enrolled yet)
    const enrolledCourseIds = enrollments.map((e) => e.courseId);
    const recommendedCourses = await prisma.course.findMany({
      where: {
        id: { notIn: enrolledCourseIds.length > 0 ? enrolledCourseIds : ["none"] },
        isPublished: true,
      },
      take: 3,
      select: {
        id: true,
        title: true,
        description: true,
        language: true,
        level: true,
        ageGroup: true,
        totalXp: true,
      },
    });

    // Continue learning courses
    const continueLearning = coursesInProgress.map((e) => ({
      id: e.course.id,
      title: e.course.title,
      language: e.course.language,
      progress: Math.round((e.progress.length / e.course.lessons.length) * 100),
      completed: e.progress.length,
      totalLessons: e.course.lessons.length,
    }));

    // Format badges for response
    const formattedBadges = student.user.badges.map((ub) => ({
      id: ub.badge.id,
      key: ub.badge.key,
      name: ub.badge.name,
      description: ub.badge.description,
      icon: ub.badge.icon,
      awardedAt: ub.awardedAt,
    }));

    return NextResponse.json({
      stats: {
        lessonsCompleted: completedLessons,
        quizzesPassed,
        badgesEarned,
        streakDays: student.streakDays || 0,
        totalXp: student.totalXp || 0,
        currentLevel: student.currentLevel || 1,
      },
      continueLearning,
      recommendedCourses,
      badges: formattedBadges,
    });
  } catch (error) {
    console.error("[students/[id]/stats] Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
