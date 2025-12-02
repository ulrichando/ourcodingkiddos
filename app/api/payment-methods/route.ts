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

    // First check User record for stripeCustomerId (primary source)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { email: userEmail },
        ],
      },
      select: {
        stripeCustomerId: true,
      },
    });

    let stripeCustomerId = user?.stripeCustomerId;

    // Fallback: check subscription record if user doesn't have it
    if (!stripeCustomerId) {
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
      stripeCustomerId = subscription?.stripeCustomerId;
    }

    if (!stripeCustomerId) {
      return NextResponse.json({
        paymentMethods: [],
        message: "No payment methods on file",
      });
    }

    // Fetch payment methods from Stripe customer
    const paymentMethodsResponse = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: "card",
    });

    // Get the default payment method from customer
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    let defaultPaymentMethodId: string | null = null;
    if ("invoice_settings" in customer && customer.invoice_settings) {
      defaultPaymentMethodId = customer.invoice_settings.default_payment_method as string | null;
    }

    // Collect all payment methods
    const allPaymentMethods = [...paymentMethodsResponse.data];

    // If no payment methods found on customer, check active subscriptions
    // (payment method might be attached to subscription only for older signups)
    if (allPaymentMethods.length === 0) {
      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: "all",
        limit: 5,
      });

      for (const sub of subscriptions.data) {
        if (sub.default_payment_method) {
          const pmId = typeof sub.default_payment_method === "string"
            ? sub.default_payment_method
            : sub.default_payment_method.id;

          try {
            const pm = await stripe.paymentMethods.retrieve(pmId);
            if (pm.type === "card") {
              allPaymentMethods.push(pm);
              defaultPaymentMethodId = pmId;
              break;
            }
          } catch (e) {
            // Payment method might have been removed, continue
          }
        }
      }
    }

    // Format the response
    const formattedMethods = allPaymentMethods.map((pm) => ({
      id: pm.id,
      brand: pm.card?.brand || "unknown",
      last4: pm.card?.last4 || "****",
      expMonth: pm.card?.exp_month,
      expYear: pm.card?.exp_year,
      isDefault: pm.id === defaultPaymentMethodId,
    }));

    return NextResponse.json({
      paymentMethods: formattedMethods,
      customerId: stripeCustomerId,
    });
  } catch (error: any) {
    console.error("GET /api/payment-methods error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch payment methods" },
      { status: 500 }
    );
  }
}
