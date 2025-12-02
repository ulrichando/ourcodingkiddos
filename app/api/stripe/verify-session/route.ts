import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

/**
 * POST /api/stripe/verify-session
 * Verifies a Stripe checkout session and creates/updates the subscription
 * This serves as a fallback when the webhook fails
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    if (checkoutSession.payment_status !== 'paid' && checkoutSession.payment_status !== 'no_payment_required') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findFirst({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user's stripeCustomerId if not set
    if (!user.stripeCustomerId && checkoutSession.customer) {
      const customerId = typeof checkoutSession.customer === 'string'
        ? checkoutSession.customer
        : checkoutSession.customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Check if subscription already exists
    const stripeSubscription = checkoutSession.subscription as Stripe.Subscription | null;

    if (!stripeSubscription) {
      return NextResponse.json({
        success: true,
        message: 'No subscription in session (one-time payment)',
      });
    }

    // Check if we already have this subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        OR: [
          { stripeSubscriptionId: stripeSubscription.id },
          { userId: user.id, status: { in: ['ACTIVE', 'TRIALING'] } },
        ],
      },
    });

    if (existingSubscription) {
      return NextResponse.json({
        success: true,
        message: 'Subscription already exists',
        subscription: existingSubscription,
      });
    }

    // Create the subscription from Stripe data
    const planId = checkoutSession.metadata?.planId || stripeSubscription.metadata?.planId;

    // Determine status
    let status: 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' = 'ACTIVE';
    if (stripeSubscription.status === 'trialing') status = 'TRIALING';
    else if (stripeSubscription.status === 'past_due') status = 'PAST_DUE';
    else if (stripeSubscription.status === 'canceled') status = 'CANCELED';

    // Determine plan type
    let planType: 'FREE_TRIAL' | 'MONTHLY' | 'ANNUAL' | 'FAMILY' = 'MONTHLY';
    if (planId) {
      const normalizedPlanId = planId.toUpperCase().replace('-', '_');
      if (normalizedPlanId === 'FREE_TRIAL' || normalizedPlanId === 'FREE-TRIAL') {
        planType = 'FREE_TRIAL';
      } else if (normalizedPlanId === 'FAMILY') {
        planType = 'FAMILY';
      } else if (normalizedPlanId === 'ANNUAL') {
        planType = 'ANNUAL';
      }
    } else if (stripeSubscription.status === 'trialing') {
      planType = 'FREE_TRIAL';
    }

    // Get dates
    const stripeSubWithPeriod = stripeSubscription as Stripe.Subscription & {
      current_period_start?: number;
      current_period_end?: number;
    };

    const currentPeriodStart = stripeSubWithPeriod.current_period_start
      ? new Date(stripeSubWithPeriod.current_period_start * 1000)
      : new Date();
    const currentPeriodEnd = stripeSubWithPeriod.current_period_end
      ? new Date(stripeSubWithPeriod.current_period_end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const trialEndsAt = stripeSubscription.trial_end
      ? new Date(stripeSubscription.trial_end * 1000)
      : null;

    const endDate = planType === 'FREE_TRIAL' && trialEndsAt ? trialEndsAt : currentPeriodEnd;

    const priceId = stripeSubscription.items.data[0]?.price.id || '';

    // Create subscription
    const newSubscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: typeof checkoutSession.customer === 'string'
          ? checkoutSession.customer
          : checkoutSession.customer?.id || null,
        priceId,
        planType,
        status,
        currentPeriodStart,
        currentPeriodEnd,
        startDate: currentPeriodStart,
        endDate,
        trialEndsAt,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        parentEmail: user.email,
      },
    });

    console.log(`Subscription created via verify-session for user ${user.id}: ${newSubscription.id}`);

    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully',
      subscription: newSubscription,
    });
  } catch (error: any) {
    console.error('Verify session error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify session' },
      { status: 500 }
    );
  }
}
