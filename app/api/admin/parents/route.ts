import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

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
    // Get all parent profiles with their data
    const parentProfiles = await prisma.parentProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            lastSeen: true,
          },
        },
        children: {
          include: {
            user: {
              select: {
                enrollments: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Get payments for summary calculation
    const payments = await prisma.payment.findMany({
      where: {
        status: "SUCCEEDED",
      },
      select: {
        userId: true,
        amount: true,
      },
    });

    // Group payments by user
    const paymentsByUser = payments.reduce((acc, payment) => {
      if (!acc[payment.userId]) {
        acc[payment.userId] = 0;
      }
      acc[payment.userId] += payment.amount || 0;
      return acc;
    }, {} as Record<string, number>);

    // Transform parent data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let activeCount = 0;
    let totalChildren = 0;
    let totalRevenue = 0;

    const parents = parentProfiles.map((profile) => {
      const userPayments = paymentsByUser[profile.user.id] || 0;
      const childCount = profile.children.length;

      totalChildren += childCount;
      totalRevenue += userPayments;

      // Check if active in last 30 days
      if (profile.user.lastSeen && new Date(profile.user.lastSeen) > thirtyDaysAgo) {
        activeCount++;
      }

      // Determine payment status
      const paymentStatus: "current" | "pending" | "overdue" = "current";

      // Get children info
      const children = profile.children.map((student) => ({
        id: student.id,
        name: student.name || "Unnamed Student",
        age: student.age || undefined,
        level: student.currentLevel || 1,
        totalXp: student.totalXp || 0,
        enrollments: student.user?.enrollments?.length || 0,
      }));

      // Calculate total enrollments
      const totalEnrollments = children.reduce((sum: number, c) => sum + c.enrollments, 0);

      return {
        id: profile.id,
        userId: profile.user.id,
        name: profile.user.name || "Unknown Parent",
        email: profile.user.email,
        phone: profile.phone,
        avatar: profile.user.image,
        joinedAt: profile.user.createdAt.toISOString(),
        children,
        stats: {
          totalChildren: childCount,
          totalEnrollments,
          totalPayments: Math.round(userPayments / 100), // Convert cents to dollars
          pendingPayments: 0,
          lastActive: profile.user.lastSeen?.toISOString(),
        },
        paymentStatus,
      };
    });

    const summary = {
      totalParents: parents.length,
      activeParents: activeCount,
      totalChildren,
      avgChildrenPerParent: parents.length > 0 ? totalChildren / parents.length : 0,
      totalRevenue: Math.round(totalRevenue / 100), // Convert cents to dollars
      pendingPayments: 0,
    };

    return NextResponse.json({
      parents,
      summary,
    });
  } catch (error) {
    console.error("[ParentStats] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch parent stats", parents: [], summary: null },
      { status: 500 }
    );
  }
}
