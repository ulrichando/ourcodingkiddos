import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: `Webhook handler failed: ${error.message}` },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId || session.client_reference_id;

  if (!userId) {
    console.error('No userId in checkout session metadata');
    return;
  }

  // Get the subscription from the session
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    await handleSubscriptionUpdate(subscription);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;

  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  const priceId = subscription.items.data[0]?.price.id;
  const planId = subscription.metadata.planId;

  // Determine subscription status
  let status: 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' | 'INCOMPLETE_EXPIRED' | 'UNPAID' = 'ACTIVE';

  switch (subscription.status) {
    case 'active':
      status = 'ACTIVE';
      break;
    case 'trialing':
      status = 'TRIALING';
      break;
    case 'past_due':
      status = 'PAST_DUE';
      break;
    case 'canceled':
      status = 'CANCELED';
      break;
    case 'incomplete':
      status = 'INCOMPLETE';
      break;
    case 'incomplete_expired':
      status = 'INCOMPLETE_EXPIRED';
      break;
    case 'unpaid':
      status = 'UNPAID';
      break;
  }

  // Get current period dates from the subscription
  // Use type assertion as these properties exist on the Stripe API response
  const stripeSubscription = subscription as Stripe.Subscription & {
    current_period_start?: number;
    current_period_end?: number;
  };
  const currentPeriodStart = stripeSubscription.current_period_start
    ? new Date(stripeSubscription.current_period_start * 1000)
    : new Date();
  const currentPeriodEnd = stripeSubscription.current_period_end
    ? new Date(stripeSubscription.current_period_end * 1000)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days from now

  // Get trial end date for free trial plans
  const trialEndsAt = subscription.trial_end
    ? new Date(subscription.trial_end * 1000)
    : null;

  // Determine planType from metadata or default
  let planType: 'FREE_TRIAL' | 'MONTHLY' | 'ANNUAL' | 'FAMILY' = 'MONTHLY';
  if (planId) {
    const normalizedPlanId = planId.toUpperCase().replace('-', '_');
    if (normalizedPlanId === 'FREE_TRIAL' || normalizedPlanId === 'FREE-TRIAL') {
      planType = 'FREE_TRIAL';
    } else if (normalizedPlanId === 'FAMILY') {
      planType = 'FAMILY';
    } else if (normalizedPlanId === 'ANNUAL') {
      planType = 'ANNUAL';
    } else {
      planType = 'MONTHLY';
    }
  } else if (subscription.status === 'trialing') {
    planType = 'FREE_TRIAL';
  }

  // Set startDate and endDate for subscription tracking
  // - startDate: when the subscription started
  // - endDate: when access should end (trial end for free trial, period end for paid)
  const startDate = currentPeriodStart;
  const endDate = planType === 'FREE_TRIAL' && trialEndsAt ? trialEndsAt : currentPeriodEnd;

  // Get user's email for parentEmail field
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  // Upsert subscription in database
  await prisma.subscription.upsert({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    update: {
      status,
      currentPeriodStart,
      currentPeriodEnd,
      startDate,
      endDate,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
      trialEndsAt,
    },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      priceId,
      planType,
      status,
      currentPeriodStart,
      currentPeriodEnd,
      startDate,
      endDate,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEndsAt,
      parentEmail: user?.email || null,
    },
  });

  console.log(`Subscription ${subscription.id} updated for user ${userId} - Status: ${status}, Plan: ${planType}, Ends: ${endDate.toISOString()}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    data: {
      status: 'CANCELED',
      canceledAt: new Date(),
    },
  });

  console.log(`Subscription ${subscription.id} deleted`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
  await handleSubscriptionUpdate(subscription);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription;
  if (!subscriptionId) return;

  await prisma.subscription.updateMany({
    where: {
      stripeSubscriptionId: subscriptionId as string,
    },
    data: {
      status: 'PAST_DUE',
    },
  });

  console.log(`Payment failed for subscription ${subscriptionId}`);
}
