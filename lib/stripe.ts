import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// =====================================================
// PROGRAM-BASED ONE-TIME PAYMENT SYSTEM
// =====================================================

export interface ProgramPaymentDetails {
  programId: string;
  programTitle: string;
  studentProfileId: string;
  studentName: string;
  amountCents: number;
  parentEmail: string;
  sessionCount: number;
}

/**
 * Create a Stripe Checkout Session for one-time program payment
 */
export async function createProgramCheckoutSession(
  details: ProgramPaymentDetails,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: details.parentEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: details.programTitle,
            description: `${details.sessionCount}-session program for ${details.studentName}`,
            metadata: {
              programId: details.programId,
              studentProfileId: details.studentProfileId,
              sessionCount: details.sessionCount.toString(),
            },
          },
          unit_amount: details.amountCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: 'program_enrollment',
      programId: details.programId,
      studentProfileId: details.studentProfileId,
      parentEmail: details.parentEmail,
      sessionCount: details.sessionCount.toString(),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}

/**
 * Create a Payment Intent for program enrollment (for custom payment forms)
 */
export async function createProgramPaymentIntent(
  details: ProgramPaymentDetails
): Promise<Stripe.PaymentIntent> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: details.amountCents,
    currency: 'usd',
    receipt_email: details.parentEmail,
    metadata: {
      type: 'program_enrollment',
      programId: details.programId,
      studentProfileId: details.studentProfileId,
      parentEmail: details.parentEmail,
      programTitle: details.programTitle,
      studentName: details.studentName,
      sessionCount: details.sessionCount.toString(),
    },
  });

  return paymentIntent;
}

/**
 * Verify a completed payment and return details
 */
export async function verifyProgramPayment(
  paymentIntentId: string
): Promise<{ success: boolean; metadata: Record<string, string> | null }> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        metadata: paymentIntent.metadata as Record<string, string>,
      };
    }

    return { success: false, metadata: null };
  } catch {
    return { success: false, metadata: null };
  }
}
