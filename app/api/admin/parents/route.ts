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
            phone: true,
            image: true,
            createdAt: true,
            lastSeen: true,
          },
        },
        students: {
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

    // Get payment data for parents
    const bookings = await prisma.booking.findMany({
      where: {
        user: {
          role: "PARENT",
        },
      },
      select: {
        userId: true,
        amountPaid: true,
        status: true,
      },
    });

    // Group payments by user
    const paymentsByUser = bookings.reduce((acc, booking) => {
      if (!acc[booking.userId]) {
        acc[booking.userId] = { paid: 0, pending: 0 };
      }
      if (booking.status === "CONFIRMED" || booking.status === "COMPLETED") {
        acc[booking.userId].paid += booking.amountPaid || 0;
      } else if (booking.status === "PENDING") {
        acc[booking.userId].pending += booking.amountPaid || 0;
      }
      return acc;
    }, {} as Record<string, { paid: number; pending: number }>);

    // Transform parent data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let activeCount = 0;
    let totalChildren = 0;
    let totalRevenue = 0;
    let totalPending = 0;

    const parents = parentProfiles.map((profile) => {
      const payments = paymentsByUser[profile.user.id] || { paid: 0, pending: 0 };
      const childCount = profile.students.length;

      totalChildren += childCount;
      totalRevenue += payments.paid;
      totalPending += payments.pending;

      // Check if active in last 30 days
      if (profile.user.lastSeen && new Date(profile.user.lastSeen) > thirtyDaysAgo) {
        activeCount++;
      }

      // Determine payment status
      let paymentStatus: "current" | "pending" | "overdue" = "current";
      if (payments.pending > 0) {
        paymentStatus = "pending";
      }

      // Get children info
      const children = profile.students.map((student) => ({
        id: student.id,
        name: student.name || "Unnamed Student",
        age: student.age || undefined,
        level: student.currentLevel || 1,
        totalXp: student.totalXp || 0,
        enrollments: student.user?.enrollments?.length || 0,
      }));

      // Calculate total enrollments
      const totalEnrollments = children.reduce((sum, c) => sum + c.enrollments, 0);

      return {
        id: profile.id,
        userId: profile.user.id,
        name: profile.user.name || "Unknown Parent",
        email: profile.user.email,
        phone: profile.user.phone,
        avatar: profile.user.image,
        joinedAt: profile.user.createdAt.toISOString(),
        children,
        stats: {
          totalChildren: childCount,
          totalEnrollments,
          totalPayments: payments.paid,
          pendingPayments: payments.pending,
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
      totalRevenue,
      pendingPayments: totalPending,
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
