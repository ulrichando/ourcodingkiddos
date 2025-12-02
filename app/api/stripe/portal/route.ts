import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

/**
 * GET /api/stripe/portal - Redirect to Stripe Customer Portal
 * Used when clicking links to manage payment methods
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${baseUrl}/auth/login`);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user?.stripeCustomerId) {
      // If no Stripe customer, redirect to pricing to subscribe first
      const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${baseUrl}/pricing?error=no-subscription`);
    }

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/settings`,
      configuration: process.env.STRIPE_CUSTOMER_PORTAL_CONFIG || undefined,
    });

    return NextResponse.redirect(portalSession.url);
  } catch (error: any) {
    console.error('Stripe portal GET error:', error);
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/settings?error=portal-failed`);
  }
}

/**
 * POST /api/stripe/portal - Create Stripe Customer Portal session (returns URL)
 * Used for programmatic access
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No subscription found. Please subscribe first.' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/settings`,
      configuration: process.env.STRIPE_CUSTOMER_PORTAL_CONFIG || undefined,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('Stripe portal error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
