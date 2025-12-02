import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { stripe } from "../../../lib/stripe";

/**
 * GET /api/payment-methods - Get user's saved payment methods from Stripe
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const userId = (session.user as any).id;

    // Find the user's subscription to get the Stripe customer ID
    const subscription = await prisma.subscription.findFirst({
      where: {
        OR: [
          { userId: userId },
          { user: { email: userEmail } },
          { parentEmail: userEmail },
        ],
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json({
        paymentMethods: [],
        message: "No payment methods on file",
      });
    }

    // Fetch payment methods from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: subscription.stripeCustomerId,
      type: "card",
    });

    // Get the default payment method
    const customer = await stripe.customers.retrieve(subscription.stripeCustomerId);
    let defaultPaymentMethodId: string | null = null;
    if ("invoice_settings" in customer && customer.invoice_settings) {
      defaultPaymentMethodId = customer.invoice_settings.default_payment_method as string | null;
    }

    // Format the response
    const formattedMethods = paymentMethods.data.map((pm) => ({
      id: pm.id,
      brand: pm.card?.brand || "unknown",
      last4: pm.card?.last4 || "****",
      expMonth: pm.card?.exp_month,
      expYear: pm.card?.exp_year,
      isDefault: pm.id === defaultPaymentMethodId,
    }));

    return NextResponse.json({
      paymentMethods: formattedMethods,
      customerId: subscription.stripeCustomerId,
    });
  } catch (error: any) {
    console.error("GET /api/payment-methods error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch payment methods" },
      { status: 500 }
    );
  }
}
