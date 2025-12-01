import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

/**
 * GET /api/subscriptions - Get current user's subscription
 * IMPORTANT: Admin users bypass subscription checks and receive unlimited access
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;
  const userRole = (session.user as any).role;

  // ADMIN BYPASS: Admins get unlimited access regardless of actual subscription
  if (userRole === "ADMIN") {
    return NextResponse.json({
      subscription: {
        id: "admin-unlimited",
        planType: "unlimited",
        status: "active",
        priceCents: 0,
        startDate: new Date("2020-01-01"),
        endDate: new Date("2099-12-31"),
        currentPeriodEnd: new Date("2099-12-31"),
        parentEmail: userEmail,
        userId: (session.user as any).id,
      },
    });
  }

  // For non-admin users, look up their actual subscription
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        OR: [
          { user: { email: userEmail } },
          { parentEmail: userEmail },
        ],
        status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        planType: true,
        status: true,
        priceCents: true,
        startDate: true,
        endDate: true,
        currentPeriodEnd: true,
        parentEmail: true,
        userId: true,
      },
    });

    if (!subscription) {
      return NextResponse.json({
        subscription: null,
        message: "No active subscription found",
      });
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("GET /api/subscriptions error", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
