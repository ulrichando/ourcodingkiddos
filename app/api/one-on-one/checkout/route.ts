import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { calculatePrice, formatPrice, getBaseRate } from '@/lib/one-on-one-pricing';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      duration,
      numberOfSessions,
      daysPerWeek,
      numberOfWeeks,
      studentId,
      studentName,
      studentAge,
      requestedTopic,
      description,
      preferredDays,
      preferredTimes,
      parentNotes,
      preferredInstructorId,
      preferredInstructorName
    } = body;

    // Validate required fields
    if (!duration || !numberOfSessions || !requestedTopic) {
      return NextResponse.json(
        { error: 'Duration, number of sessions, and topic are required' },
        { status: 400 }
      );
    }

    // Validate duration
    if (![30, 60, 90].includes(duration)) {
      return NextResponse.json({ error: 'Invalid duration' }, { status: 400 });
    }

    // Validate number of sessions (max is 3 days/week × 12 weeks = 36)
    if (numberOfSessions < 1 || numberOfSessions > 36) {
      return NextResponse.json({ error: 'Invalid number of sessions' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate pricing
    const pricing = calculatePrice(duration, numberOfSessions);

    // Create the class request with PENDING payment status
    const classRequest = await prisma.classRequest.create({
      data: {
        parentEmail: session.user.email,
        parentName: session.user.name || undefined,
        studentId: studentId || undefined,
        studentName: studentName || undefined,
        studentAge: studentAge ? parseInt(studentAge) : undefined,
        requestedTopic,
        description: description || undefined,
        preferredDays: preferredDays || undefined,
        preferredTimes: preferredTimes || undefined,
        duration,
        parentNotes: parentNotes || undefined,
        preferredInstructorId: preferredInstructorId || undefined,
        preferredInstructorName: preferredInstructorName || undefined,
        numberOfSessions,
        daysPerWeek: daysPerWeek || undefined,
        numberOfWeeks: numberOfWeeks || undefined,
        pricePerSession: pricing.pricePerSession,
        totalPrice: pricing.totalPrice,
        discountApplied: pricing.discount,
        paymentStatus: 'PENDING',
        status: 'PENDING',
      },
    });

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
    const sessionLabel = numberOfSessions === 1 ? 'session' : 'sessions';
    const description_text = `${numberOfSessions} ${sessionLabel} x ${duration} minutes - ${requestedTopic}`;

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
              description: description_text,
              metadata: {
                classRequestId: classRequest.id,
                duration: duration.toString(),
                numberOfSessions: numberOfSessions.toString(),
              },
            },
            unit_amount: pricing.totalPrice,
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

    // Update class request with Stripe session ID
    await prisma.classRequest.update({
      where: { id: classRequest.id },
      data: { stripePaymentId: checkoutSession.id },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      classRequestId: classRequest.id,
      pricing: {
        basePrice: formatPrice(pricing.basePrice),
        discount: formatPrice(pricing.discount),
        discountPercent: pricing.discountPercent,
        totalPrice: formatPrice(pricing.totalPrice),
        pricePerSession: formatPrice(pricing.pricePerSession),
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

// GET endpoint to calculate pricing without creating checkout
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const duration = parseInt(searchParams.get('duration') || '60');
    const numberOfSessions = parseInt(searchParams.get('sessions') || '1');

    if (![30, 60, 90].includes(duration)) {
      return NextResponse.json({ error: 'Invalid duration' }, { status: 400 });
    }

    if (numberOfSessions < 1 || numberOfSessions > 36) {
      return NextResponse.json({ error: 'Invalid number of sessions' }, { status: 400 });
    }

    const pricing = calculatePrice(duration, numberOfSessions);

    return NextResponse.json({
      duration,
      numberOfSessions,
      basePrice: pricing.basePrice,
      basePriceFormatted: formatPrice(pricing.basePrice),
      discount: pricing.discount,
      discountFormatted: formatPrice(pricing.discount),
      discountPercent: pricing.discountPercent,
      totalPrice: pricing.totalPrice,
      totalPriceFormatted: formatPrice(pricing.totalPrice),
      pricePerSession: pricing.pricePerSession,
      pricePerSessionFormatted: formatPrice(pricing.pricePerSession),
    });
  } catch (error: any) {
    logger.api.error('Pricing calculation error', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate pricing' },
      { status: 500 }
    );
  }
}
