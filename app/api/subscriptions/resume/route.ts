import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { stripe } from "../../../../lib/stripe";
import { createAuditLog } from "../../../../lib/audit";

/**
 * POST /api/subscriptions/resume - Resume a subscription that was set to cancel
 * This removes the cancel_at_period_end flag, keeping the subscription active
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const userId = (session.user as any).id;

    console.log("[Resume Subscription] User:", userEmail);

    // Find the user's subscription that is set to cancel
    const subscription = await prisma.subscription.findFirst({
      where: {
        OR: [
          { userId: userId },
          { user: { email: userEmail } },
          { parentEmail: userEmail },
        ],
        status: {
          in: ["ACTIVE", "TRIALING"],
        },
        cancelAtPeriodEnd: true,
      },
    });

    console.log("[Resume Subscription] Found subscription:", subscription?.id);

    if (!subscription) {
      return NextResponse.json(
        { error: "No subscription pending cancellation found" },
        { status: 404 }
      );
    }

    // Resume the subscription in Stripe
    if (subscription.stripeSubscriptionId) {
      console.log("[Resume Subscription] Resuming Stripe subscription:", subscription.stripeSubscriptionId);
      try {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: false,
        });
        console.log("[Resume Subscription] Stripe subscription resumed successfully");
      } catch (stripeError: any) {
        console.error("[Resume Subscription] Stripe error:", stripeError.message);
        if (stripeError.code !== "resource_missing") {
          throw stripeError;
        }
      }
    }

    // Update the subscription in the database
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: false,
        canceledAt: null,
      },
    });

    console.log("[Resume Subscription] Database updated, cancelAtPeriodEnd:", updatedSubscription.cancelAtPeriodEnd);

    // Create audit log
    await createAuditLog({
      userId,
      userEmail: userEmail || "unknown",
      action: "UPDATE",
      resource: "Subscription",
      resourceId: subscription.id,
      details: `Subscription resumed (cancellation undone)`,
      severity: "INFO",
      metadata: {
        subscriptionId: subscription.id,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        planType: subscription.planType,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription has been resumed",
    });
  } catch (error: any) {
    console.error("POST /api/subscriptions/resume error:", error.message, error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to resume subscription" },
      { status: 500 }
    );
  }
}
