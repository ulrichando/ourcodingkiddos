import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { stripe } from "../../../../lib/stripe";

/**
 * POST /api/subscriptions/cancel - Cancel user's subscription at period end
 * This sets the subscription to cancel at the end of the current billing period
 * The user retains access until the period ends
 */
export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;
  const userRole = (session.user as any).role;

  // Admin and instructors cannot cancel (they have special access)
  if (userRole === "ADMIN" || userRole === "INSTRUCTOR") {
    return NextResponse.json(
      { error: "Admin and instructor accounts cannot be canceled" },
      { status: 400 }
    );
  }

  try {
    // Find the user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        OR: [
          { user: { email: userEmail } },
          { parentEmail: userEmail },
        ],
        status: {
          in: ["ACTIVE", "TRIALING"],
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    if (subscription.cancelAtPeriodEnd) {
      return NextResponse.json(
        { error: "Subscription is already set to cancel" },
        { status: 400 }
      );
    }

    // Cancel the subscription at period end in Stripe
    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    }

    // Update the subscription in the database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription will be canceled at the end of the current billing period",
      cancelAt: subscription.currentPeriodEnd,
    });
  } catch (error) {
    console.error("POST /api/subscriptions/cancel error", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
