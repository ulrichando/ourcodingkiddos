/**
 * Subscription access utilities
 * IMPORTANT: Admin users bypass all subscription restrictions
 */

import { Session } from "next-auth";

/**
 * Check if a user should bypass subscription restrictions
 * Admin users always have unlimited access
 */
export function bypassesSubscription(session: Session | null): boolean {
  if (!session?.user) return false;
  const userRole = (session.user as any).role;
  return userRole === "ADMIN";
}

/**
 * Check if a user has active subscription access
 * Returns true if:
 * - User is an admin (bypasses subscription)
 * - User has an active subscription
 */
export function hasSubscriptionAccess(
  session: Session | null,
  subscription: { status?: string; endDate?: Date } | null
): boolean {
  // Admins always have access
  if (bypassesSubscription(session)) {
    return true;
  }

  // Check if subscription is active and not expired
  if (!subscription) return false;

  const isActive = ["ACTIVE", "TRIALING", "active", "trialing"].includes(
    subscription.status || ""
  );

  if (!isActive) return false;

  // Check if trial/subscription hasn't expired
  if (subscription.endDate) {
    const now = new Date();
    if (subscription.endDate < now) {
      return false;
    }
  }

  return true;
}

/**
 * Get user-friendly subscription label
 */
export function getSubscriptionLabel(
  session: Session | null,
  subscription: { plan_type?: string; planType?: string } | null
): string {
  if (bypassesSubscription(session)) {
    return "Admin Access";
  }

  const planType = subscription?.plan_type || subscription?.planType;

  if (!planType || planType === "free_trial") {
    return planType === "free_trial" ? "Free Trial" : "No Plan";
  }

  if (planType === "family") {
    return "Premium Family";
  }

  return "Premium";
}
