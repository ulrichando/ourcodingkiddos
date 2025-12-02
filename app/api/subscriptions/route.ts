import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { getSubscriptionStatus } from "../../../lib/subscription";

/**
 * GET /api/subscriptions - Get current user's subscription
 * IMPORTANT: Admin users bypass subscription checks and receive unlimited access
 *
 * Returns subscription with access status:
 * - Free Trial: 7 days access
 * - Monthly: Access until currentPeriodEnd (renews monthly)
 * - Missed Payment: Access revoked (PAST_DUE, UNPAID, CANCELED)
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
        status: "ACTIVE",
        priceCents: 0,
        startDate: new Date("2020-01-01"),
        endDate: new Date("2099-12-31"),
        currentPeriodStart: new Date("2020-01-01"),
        currentPeriodEnd: new Date("2099-12-31"),
        trialEndsAt: null,
        parentEmail: userEmail,
        userId: (session.user as any).id,
      },
      accessStatus: {
        hasAccess: true,
        status: "active",
        daysRemaining: null,
        message: "Admin Access - Unlimited",
      },
    });
  }

  // INSTRUCTOR BYPASS: Instructors don't need subscriptions
  if (userRole === "INSTRUCTOR") {
    return NextResponse.json({
      subscription: {
        id: "instructor-access",
        planType: "instructor",
        status: "ACTIVE",
        priceCents: 0,
        startDate: new Date("2020-01-01"),
        endDate: new Date("2099-12-31"),
        currentPeriodStart: new Date("2020-01-01"),
        currentPeriodEnd: new Date("2099-12-31"),
        trialEndsAt: null,
        parentEmail: userEmail,
        userId: (session.user as any).id,
      },
      accessStatus: {
        hasAccess: true,
        status: "active",
        daysRemaining: null,
        message: "Instructor Access",
      },
    });
  }

  // For non-admin/instructor users, look up their actual subscription
  try {
    // First, try to find the most recent subscription (any status)
    // This allows us to show appropriate messages for expired/canceled subscriptions
    const subscription = await prisma.subscription.findFirst({
      where: {
        OR: [
          { user: { email: userEmail } },
          { parentEmail: userEmail },
        ],
      },
      orderBy: [
        { status: "asc" }, // ACTIVE/TRIALING first
        { currentPeriodEnd: "desc" },
      ],
      select: {
        id: true,
        planType: true,
        status: true,
        priceCents: true,
        startDate: true,
        endDate: true,
        currentPeriodStart: true,
        currentPeriodEnd: true,
        trialEndsAt: true,
        parentEmail: true,
        userId: true,
        cancelAtPeriodEnd: true,
        canceledAt: true,
      },
    });

    if (!subscription) {
      return NextResponse.json({
        subscription: null,
        accessStatus: {
          hasAccess: false,
          status: "none",
          daysRemaining: null,
          message: "No active subscription. Start your free trial to unlock all features.",
        },
      });
    }

    // Get detailed access status
    const accessStatus = getSubscriptionStatus({
      status: subscription.status,
      planType: subscription.planType,
      endDate: subscription.endDate || undefined,
      currentPeriodEnd: subscription.currentPeriodEnd || undefined,
      trialEndsAt: subscription.trialEndsAt || undefined,
    });

    return NextResponse.json({
      subscription,
      accessStatus,
    });
  } catch (error) {
    console.error("GET /api/subscriptions error", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
