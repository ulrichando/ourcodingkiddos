import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { stripe } from "../../../../lib/stripe";
import { createAuditLog } from "../../../../lib/audit";

/**
 * POST /api/subscriptions/cancel - Cancel user's subscription at period end
 * This sets the subscription to cancel at the end of the current billing period
 * The user retains access until the period ends
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    console.log("[Cancel Subscription] User:", userEmail, "Role:", userRole);

    // Admin and instructors cannot cancel (they have special access)
    if (userRole === "ADMIN" || userRole === "INSTRUCTOR") {
      return NextResponse.json(
        { error: "Admin and instructor accounts cannot be canceled" },
        { status: 400 }
      );
    }

    // Find the user's active subscription
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
      },
    });

    console.log("[Cancel Subscription] Found subscription:", subscription?.id, "Status:", subscription?.status);

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

    // Cancel the subscription at period end in Stripe (if it has a Stripe subscription)
    if (subscription.stripeSubscriptionId) {
      console.log("[Cancel Subscription] Canceling Stripe subscription:", subscription.stripeSubscriptionId);
      try {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });
        console.log("[Cancel Subscription] Stripe subscription updated successfully");
      } catch (stripeError: any) {
        console.error("[Cancel Subscription] Stripe error:", stripeError.message);
        // If Stripe subscription doesn't exist or is already canceled, continue with DB update
        if (stripeError.code !== "resource_missing") {
          throw stripeError;
        }
      }
    } else {
      console.log("[Cancel Subscription] No Stripe subscription ID, updating database only");
    }

    // Update the subscription in the database
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
      },
    });

    console.log("[Cancel Subscription] Database updated, cancelAtPeriodEnd:", updatedSubscription.cancelAtPeriodEnd);

    // Create audit log
    await createAuditLog({
      userId,
      userEmail: userEmail || "unknown",
      action: "UPDATE",
      resource: "Subscription",
      resourceId: subscription.id,
      details: `Subscription scheduled for cancellation at period end`,
      severity: "WARNING",
      metadata: {
        subscriptionId: subscription.id,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        cancelAt: subscription.currentPeriodEnd,
        planType: subscription.planType,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription will be canceled at the end of the current billing period",
      cancelAt: subscription.currentPeriodEnd,
    });
  } catch (error: any) {
    console.error("POST /api/subscriptions/cancel error:", error.message, error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
