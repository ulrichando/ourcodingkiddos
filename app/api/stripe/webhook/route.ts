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

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
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
  // Handle 1-on-1 class payment
  if (session.metadata?.type === 'one-on-one-class') {
    const classRequestId = session.metadata.classRequestId;
    if (classRequestId) {
      await prisma.classRequest.update({
        where: { id: classRequestId },
        data: {
          paymentStatus: 'PAID',
          paidAt: new Date(),
          stripePaymentId: session.id,
        },
      });
      console.log(`1-on-1 class payment completed for request ${classRequestId}`);
    }
    return;
  }

  // Handle program enrollment payment
  if (session.metadata?.type === 'program_enrollment') {
    const programId = session.metadata.programId;
    const studentProfileId = session.metadata.studentProfileId;
    const paymentIntentId = session.payment_intent as string;

    if (programId && studentProfileId) {
      // Update the program enrollment payment status
      await prisma.programEnrollment.updateMany({
        where: {
          programId,
          studentProfileId,
          paymentStatus: 'PENDING',
        },
        data: {
          paymentStatus: 'SUCCEEDED',
          stripePaymentIntentId: paymentIntentId,
          status: 'ACTIVE',
          startDate: new Date(),
        },
      });
      console.log(`Program enrollment payment completed for program ${programId}, student ${studentProfileId}`);
    }
    return;
  }

  console.log('Checkout session completed:', session.id);
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Handle program enrollment payment intent
  if (paymentIntent.metadata?.type === 'program_enrollment') {
    const programId = paymentIntent.metadata.programId;
    const studentProfileId = paymentIntent.metadata.studentProfileId;

    if (programId && studentProfileId) {
      await prisma.programEnrollment.updateMany({
        where: {
          programId,
          studentProfileId,
          paymentStatus: 'PENDING',
        },
        data: {
          paymentStatus: 'SUCCEEDED',
          stripePaymentIntentId: paymentIntent.id,
          status: 'ACTIVE',
          startDate: new Date(),
        },
      });
      console.log(`Program payment intent succeeded for program ${programId}, student ${studentProfileId}`);
    }
    return;
  }

  console.log('Payment intent succeeded:', paymentIntent.id);
}
