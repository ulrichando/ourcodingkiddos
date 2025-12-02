import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get counts
    const [
      totalUsers,
      totalStudents,
      totalParents,
      totalInstructors,
      totalCourses,
      totalLessons,
      totalEnrollments,
      activeSubscriptions,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "PARENT" } }),
      prisma.user.count({ where: { role: "INSTRUCTOR" } }),
      prisma.course.count(),
      prisma.lesson.count(),
      prisma.enrollment.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.payment.aggregate({
        where: { status: "SUCCEEDED" },
        _sum: { amount: true }
      }),
    ]);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [newUsers, newEnrollments, completedCourses] = await Promise.all([
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.enrollment.count({
        where: { startedAt: { gte: thirtyDaysAgo } }
      }),
      prisma.enrollment.count({
        where: {
          status: "COMPLETED",
          completedAt: { gte: thirtyDaysAgo }
        }
      }),
    ]);

    // Get active students (logged in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeStudents = await prisma.studentProfile.count({
      where: {
        lastActiveDate: { gte: sevenDaysAgo }
      }
    });

    // Get additional metrics for reports
    const [
      totalBadgesAwarded,
      totalXpEarned,
      completedLessons,
      avgQuizScoreResult,
      totalCertificates,
      canceledSubscriptions,
    ] = await Promise.all([
      prisma.userBadge.count(),
      prisma.studentProfile.aggregate({
        _sum: { totalXp: true }
      }),
      prisma.progress.count({
        where: { status: "COMPLETED" }
      }),
      prisma.progress.aggregate({
        where: { quizScore: { not: null } },
        _avg: { quizScore: true }
      }),
      prisma.certificate.count(),
      prisma.subscription.count({
        where: { status: "CANCELED" }
      }),
    ]);

    // Calculate completion rate
    const totalProgressRecords = await prisma.progress.count();
    const completionRate = totalProgressRecords > 0
      ? Math.round((completedLessons / totalProgressRecords) * 100)
      : 0;

    // Calculate churn rate
    const totalSubsEver = await prisma.subscription.count();
    const churnRate = totalSubsEver > 0
      ? Math.round((canceledSubscriptions / totalSubsEver) * 100)
      : 0;

    // Get top courses by enrollment
    const topCourses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: {
        enrollments: {
          _count: "desc"
        }
      },
      take: 5
    });

    // Get user growth data (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const userGrowth = await prisma.$queryRaw<Array<{ month: string, count: bigint }>>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
        COUNT(*) as count
      FROM "User"
      WHERE "createdAt" >= ${twelveMonthsAgo}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt")
    `;

    // Get enrollment trend (last 12 months)
    const enrollmentTrend = await prisma.$queryRaw<Array<{ month: string, count: bigint }>>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "startedAt"), 'YYYY-MM') as month,
        COUNT(*) as count
      FROM "Enrollment"
      WHERE "startedAt" >= ${twelveMonthsAgo}
      GROUP BY DATE_TRUNC('month', "startedAt")
      ORDER BY DATE_TRUNC('month', "startedAt")
    `;

    // Get revenue trend (last 12 months)
    const revenueTrend = await prisma.$queryRaw<Array<{ month: string, revenue: bigint }>>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
        SUM(amount) as revenue
      FROM "Payment"
      WHERE "createdAt" >= ${twelveMonthsAgo} AND status = 'SUCCEEDED'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt")
    `;

    return NextResponse.json({
      overview: {
        totalUsers,
        totalStudents,
        totalParents,
        totalInstructors,
        totalCourses,
        totalLessons,
        totalEnrollments,
        activeSubscriptions,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalBadgesAwarded,
        totalXpEarned: totalXpEarned._sum.totalXp || 0,
        completedLessons,
        completionRate,
        avgQuizScore: avgQuizScoreResult._avg.quizScore || 0,
        totalCertificates,
        churnRate,
      },
      activity: {
        newUsers,
        newEnrollments,
        completedCourses,
        activeStudents,
      },
      topCourses: topCourses.map(c => ({
        id: c.id,
        title: c.title,
        enrollments: c._count.enrollments
      })),
      trends: {
        userGrowth: userGrowth.map(row => ({
          month: row.month,
          count: Number(row.count)
        })),
        enrollmentTrend: enrollmentTrend.map(row => ({
          month: row.month,
          count: Number(row.count)
        })),
        revenueTrend: revenueTrend.map(row => ({
          month: row.month,
          revenue: Number(row.revenue)
        })),
      }
    });
  } catch (error) {
    console.error("[admin/analytics] Error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
