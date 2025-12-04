import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";

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
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get all students with their progress data
    const students = await prisma.studentProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            enrollments: {
              include: {
                progress: true,
                course: {
                  include: {
                    lessons: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const atRiskStudents: any[] = [];

    for (const student of students) {
      // Check for inactive students (no recent activity)
      const hasRecentActivity = student.user.enrollments.some((enrollment) =>
        enrollment.progress.some(
          (p) => p.completedAt && new Date(p.completedAt) > sevenDaysAgo
        )
      );

      // Calculate completion rate using status field
      let totalLessons = 0;
      let completedLessons = 0;

      for (const enrollment of student.user.enrollments) {
        totalLessons += enrollment.course.lessons.length;
        completedLessons += enrollment.progress.filter((p) => p.status === "COMPLETED").length;
      }

      const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      // Check for students with enrollments but no progress
      const hasEnrollments = student.user.enrollments.length > 0;
      const hasAnyProgress = student.user.enrollments.some(
        (e) => e.progress.length > 0
      );

      // Determine risk type
      if (hasEnrollments && !hasAnyProgress) {
        // Enrolled but no progress at all
        const daysSinceEnrollment = Math.floor(
          (now.getTime() - new Date(student.user.enrollments[0].startedAt).getTime()) /
            (24 * 60 * 60 * 1000)
        );

        if (daysSinceEnrollment > 7) {
          atRiskStudents.push({
            id: student.id,
            userId: student.user.id,
            name: student.name || student.user.name || "Unknown",
            email: student.user.email,
            avatar: student.user.image,
            riskType: "no_progress",
            riskDetails: `Enrolled ${daysSinceEnrollment} days ago with no progress`,
            daysInactive: daysSinceEnrollment,
            completionRate: 0,
          });
        }
      } else if (hasEnrollments && !hasRecentActivity && completionRate < 100) {
        // Has started but inactive for 7+ days
        const lastActivity = student.user.enrollments
          .flatMap((e) => e.progress)
          .filter((p) => p.completedAt)
          .map((p) => new Date(p.completedAt!))
          .sort((a, b) => b.getTime() - a.getTime())[0];

        const daysInactive = lastActivity
          ? Math.floor((now.getTime() - lastActivity.getTime()) / (24 * 60 * 60 * 1000))
          : 30;

        if (daysInactive > 14) {
          atRiskStudents.push({
            id: student.id,
            userId: student.user.id,
            name: student.name || student.user.name || "Unknown",
            email: student.user.email,
            avatar: student.user.image,
            riskType: "inactive",
            riskDetails: `No activity for ${daysInactive} days`,
            daysInactive,
            completionRate: Math.round(completionRate),
            lastActive: lastActivity?.toISOString(),
          });
        }
      } else if (hasEnrollments && completionRate > 0 && completionRate < 25) {
        // Low completion rate (less than 25%)
        atRiskStudents.push({
          id: student.id,
          userId: student.user.id,
          name: student.name || student.user.name || "Unknown",
          email: student.user.email,
          avatar: student.user.image,
          riskType: "incomplete",
          riskDetails: `Only ${Math.round(completionRate)}% course completion`,
          completionRate: Math.round(completionRate),
        });
      }
    }

    // Sort by risk priority (no_progress > inactive > low_score > incomplete)
    const riskPriority: Record<string, number> = {
      no_progress: 1,
      inactive: 2,
      low_score: 3,
      incomplete: 4,
    };

    atRiskStudents.sort(
      (a, b) => (riskPriority[a.riskType] || 5) - (riskPriority[b.riskType] || 5)
    );

    return NextResponse.json({
      students: atRiskStudents,
      total: atRiskStudents.length,
    });
  } catch (error) {
    console.error("[AtRiskStudents] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch at-risk students", students: [] },
      { status: 500 }
    );
  }
}
