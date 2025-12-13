import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/one-on-one-pricing';
import { logger } from '@/lib/logger';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { requestId } = await params;

    // Find the class request
    const classRequest = await prisma.classRequest.findUnique({
      where: { id: requestId },
    });

    if (!classRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Verify the request belongs to this parent
    if (classRequest.parentEmail.toLowerCase() !== session.user.email.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Verify the request is APPROVED
    if (classRequest.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Only approved requests can be paid. Current status: ' + classRequest.status },
        { status: 400 }
      );
    }

    // Verify payment hasn't already been made
    if (classRequest.paymentStatus === 'PAID') {
      return NextResponse.json(
        { error: 'This request has already been paid' },
        { status: 400 }
      );
    }

    // Verify pricing info exists
    if (!classRequest.totalPrice || !classRequest.numberOfSessions || !classRequest.duration) {
      return NextResponse.json(
        { error: 'Pricing information is missing. Please contact support.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: {
          userId: user.id,
        },
      });

      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Build line item description
    const sessionLabel = classRequest.numberOfSessions === 1 ? 'session' : 'sessions';
    const description = `${classRequest.numberOfSessions} ${sessionLabel} x ${classRequest.duration} minutes - ${classRequest.requestedTopic}`;

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: classRequest.id,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: '1-on-1 Coding Class',
              description,
              metadata: {
                classRequestId: classRequest.id,
                duration: classRequest.duration.toString(),
                numberOfSessions: classRequest.numberOfSessions.toString(),
              },
            },
            unit_amount: classRequest.totalPrice,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard/parent/class-requests?payment=success&request=${classRequest.id}`,
      cancel_url: `${baseUrl}/dashboard/parent/class-requests?payment=cancelled&request=${classRequest.id}`,
      metadata: {
        classRequestId: classRequest.id,
        userId: user.id,
        type: 'one-on-one-class',
      },
      allow_promotion_codes: true,
    });

    // Update class request with Stripe session ID and set payment status to PENDING
    await prisma.classRequest.update({
      where: { id: classRequest.id },
      data: {
        stripePaymentId: checkoutSession.id,
        paymentStatus: 'PENDING',
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      classRequestId: classRequest.id,
      pricing: {
        totalPrice: formatPrice(classRequest.totalPrice),
        pricePerSession: classRequest.pricePerSession ? formatPrice(classRequest.pricePerSession) : null,
      },
    });
  } catch (error: any) {
    logger.api.error('1-on-1 checkout error', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
