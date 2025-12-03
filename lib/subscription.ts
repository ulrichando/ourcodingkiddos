/**
 * Subscription access utilities
 * IMPORTANT: Admin users bypass all subscription restrictions
 *
 * Access Rules:
 * - Free Trial: 7 days access from start
 * - Monthly: Access until currentPeriodEnd (renews monthly)
 * - Missed Payment: Access revoked (PAST_DUE, UNPAID, CANCELED status)
 */

import { Session } from "next-auth";

// Subscription statuses that grant access
const ACTIVE_STATUSES = ["ACTIVE", "TRIALING", "active", "trialing"];

// Subscription statuses that deny access (payment issues)
const BLOCKED_STATUSES = ["PAST_DUE", "UNPAID", "CANCELED", "INCOMPLETE", "INCOMPLETE_EXPIRED", "past_due", "unpaid", "canceled", "incomplete", "incomplete_expired"];

export interface SubscriptionData {
  status?: string;
  planType?: string;
  plan_type?: string;
  endDate?: Date | string;
  currentPeriodEnd?: Date | string;
  trialEndsAt?: Date | string;
}

// Official demo account emails that get full access for testing
const DEMO_ACCOUNTS = [
  "demo.parent@example.com",
  "demo.instructor@example.com",
  "demo.student@example.com",
];

/**
 * Check if a user is using an official demo account
 * Only specific demo accounts have full access for testing purposes
 */
export function isDemoAccount(session: Session | null): boolean {
  if (!session?.user?.email) return false;
  const email = session.user.email.toLowerCase();
  return DEMO_ACCOUNTS.includes(email);
}

/**
 * Check if a user should bypass subscription restrictions
 * Admin users and demo accounts always have unlimited access
 */
export function bypassesSubscription(session: Session | null): boolean {
  if (!session?.user) return false;
  const userRole = (session.user as any).role;
  // Admins always bypass
  if (userRole === "ADMIN") return true;
  // Demo accounts bypass for testing
  if (isDemoAccount(session)) return true;
  return false;
}

/**
 * Check if instructor should bypass subscription
 * Instructors don't need subscriptions
 */
export function isInstructor(session: Session | null): boolean {
  if (!session?.user) return false;
  const userRole = (session.user as any).role;
  return userRole === "INSTRUCTOR";
}

/**
 * Get the effective end date for a subscription
 * - Free Trial: uses trialEndsAt or endDate (7 days from start)
 * - Monthly/Annual: uses currentPeriodEnd
 */
export function getSubscriptionEndDate(subscription: SubscriptionData | null): Date | null {
  if (!subscription) return null;

  const planType = subscription.planType || subscription.plan_type;

  // For free trial, use trialEndsAt or endDate
  if (planType === "FREE_TRIAL" || planType === "free_trial") {
    const trialEnd = subscription.trialEndsAt || subscription.endDate;
    return trialEnd ? new Date(trialEnd) : null;
  }

  // For paid plans, use currentPeriodEnd (subscription billing period)
  const periodEnd = subscription.currentPeriodEnd || subscription.endDate;
  return periodEnd ? new Date(periodEnd) : null;
}

/**
 * Check if a user has active subscription access
 * Returns true if:
 * - User is an admin (bypasses subscription)
 * - User is an instructor (bypasses subscription)
 * - User has an active/trialing subscription that hasn't expired
 *
 * Returns false if:
 * - No subscription
 * - Subscription status is PAST_DUE, UNPAID, CANCELED, etc.
 * - Subscription period has expired
 */
export function hasSubscriptionAccess(
  session: Session | null,
  subscription: SubscriptionData | null
): boolean {
  // Admins always have access
  if (bypassesSubscription(session)) {
    return true;
  }

  // Instructors don't need subscriptions
  if (isInstructor(session)) {
    return true;
  }

  // No subscription = no access
  if (!subscription) return false;

  const status = subscription.status || "";

  // Check if status indicates payment failure - deny access immediately
  if (BLOCKED_STATUSES.includes(status)) {
    return false;
  }

  // Check if status is active
  if (!ACTIVE_STATUSES.includes(status)) {
    return false;
  }

  // Check if subscription/trial hasn't expired
  const endDate = getSubscriptionEndDate(subscription);
  if (endDate) {
    const now = new Date();
    if (endDate < now) {
      return false;
    }
  }

  return true;
}

/**
 * Get detailed subscription status for UI display
 */
export function getSubscriptionStatus(subscription: SubscriptionData | null): {
  hasAccess: boolean;
  status: "active" | "trialing" | "expired" | "past_due" | "canceled" | "unpaid" | "none";
  daysRemaining: number | null;
  message: string;
} {
  if (!subscription) {
    return {
      hasAccess: false,
      status: "none",
      daysRemaining: null,
      message: "No active subscription. Start your free trial to unlock all features.",
    };
  }

  const status = (subscription.status || "").toUpperCase();
  const endDate = getSubscriptionEndDate(subscription);
  const now = new Date();
  const daysRemaining = endDate ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

  // Payment failed statuses
  if (status === "PAST_DUE") {
    return {
      hasAccess: false,
      status: "past_due",
      daysRemaining: null,
      message: "Your payment failed. Please update your payment method to restore access.",
    };
  }

  if (status === "UNPAID") {
    return {
      hasAccess: false,
      status: "unpaid",
      daysRemaining: null,
      message: "Your subscription is unpaid. Please update your payment method to restore access.",
    };
  }

  if (status === "CANCELED" || status === "INCOMPLETE" || status === "INCOMPLETE_EXPIRED") {
    return {
      hasAccess: false,
      status: "canceled",
      daysRemaining: null,
      message: "Your subscription has been canceled. Subscribe again to restore access.",
    };
  }

  // Check if expired
  if (endDate && endDate < now) {
    const planType = subscription.planType || subscription.plan_type;
    if (planType === "FREE_TRIAL" || planType === "free_trial") {
      return {
        hasAccess: false,
        status: "expired",
        daysRemaining: 0,
        message: "Your free trial has ended. Upgrade to continue accessing all features.",
      };
    }
    return {
      hasAccess: false,
      status: "expired",
      daysRemaining: 0,
      message: "Your subscription has expired. Please renew to restore access.",
    };
  }

  // Active subscription
  if (status === "TRIALING") {
    return {
      hasAccess: true,
      status: "trialing",
      daysRemaining,
      message: daysRemaining !== null && daysRemaining <= 3
        ? `Your free trial ends in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}. Upgrade now to keep access!`
        : `Free trial active. ${daysRemaining} days remaining.`,
    };
  }

  return {
    hasAccess: true,
    status: "active",
    daysRemaining,
    message: "Subscription active.",
  };
}

/**
 * Server-side check if a subscription is valid (for API routes)
 * Checks both status and expiration date
 */
export function isSubscriptionValid(subscription: {
  status: string;
  planType?: string;
  endDate?: Date | null;
  currentPeriodEnd?: Date | null;
  trialEndsAt?: Date | null;
} | null): boolean {
  if (!subscription) return false;

  const status = subscription.status.toUpperCase();

  // Check if status indicates payment failure
  if (["PAST_DUE", "UNPAID", "CANCELED", "INCOMPLETE", "INCOMPLETE_EXPIRED"].includes(status)) {
    return false;
  }

  // Check if status is active
  if (!["ACTIVE", "TRIALING"].includes(status)) {
    return false;
  }

  // Determine end date based on plan type
  const planType = subscription.planType?.toUpperCase();
  let endDate: Date | null = null;

  if (planType === "FREE_TRIAL" && subscription.trialEndsAt) {
    endDate = new Date(subscription.trialEndsAt);
  } else if (subscription.currentPeriodEnd) {
    endDate = new Date(subscription.currentPeriodEnd);
  } else if (subscription.endDate) {
    endDate = new Date(subscription.endDate);
  }

  // Check if expired
  if (endDate && endDate < new Date()) {
    return false;
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
  // Check demo account first
  if (isDemoAccount(session)) {
    return "Demo Access";
  }

  if (bypassesSubscription(session)) {
    return "Admin Access";
  }

  if (isInstructor(session)) {
    return "Instructor";
  }

  const planType = subscription?.plan_type || subscription?.planType;

  if (!planType) {
    return "No Plan";
  }

  const normalizedPlanType = planType.toUpperCase();

  if (normalizedPlanType === "FREE_TRIAL") {
    return "Free Trial";
  }

  if (normalizedPlanType === "FAMILY") {
    return "Premium Family";
  }

  if (normalizedPlanType === "ANNUAL") {
    return "Premium Annual";
  }

  if (normalizedPlanType === "MONTHLY") {
    return "Premium";
  }

  return "Premium";
}
