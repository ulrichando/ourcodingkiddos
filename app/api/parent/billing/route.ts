import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { logger } from "../../../../lib/logger";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email.toLowerCase();

  try {
    // Get user with payments
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        payments: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        parentProfile: {
          include: {
            children: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get program enrollments with payment info
    const enrollments = await prisma.programEnrollment.findMany({
      where: {
        OR: [
          { studentProfile: { userId: user.id } },
          {
            studentProfile: {
              guardianId: user.parentProfile?.id,
            },
          },
        ],
      },
      include: {
        program: {
          select: {
            id: true,
            title: true,
            priceCents: true,
            sessionCount: true,
          },
        },
        studentProfile: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get class requests with payment info
    const classRequests = await prisma.classRequest.findMany({
      where: {
        parentEmail: { equals: userEmail, mode: "insensitive" },
        paymentStatus: { not: null },
      },
      select: {
        id: true,
        requestedTopic: true,
        totalPrice: true,
        paymentStatus: true,
        paidAt: true,
        stripePaymentId: true,
        createdAt: true,
        studentName: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Try to get Stripe customer and payment methods
    let stripeCustomer: Stripe.Customer | null = null;
    let paymentMethods: Array<{
      id: string;
      brand: string;
      last4: string;
      expMonth?: number;
      expYear?: number;
      isDefault: boolean;
    }> = [];
    let stripeInvoices: Array<{
      id: string;
      number: string | null;
      amount: number;
      currency: string;
      status: string | null;
      date: string | null;
      pdfUrl: string | null | undefined;
      hostedUrl: string | null | undefined;
      description: string;
    }> = [];

    try {
      // Search for Stripe customer by email
      const customers = await stripe.customers.list({
        email: userEmail,
        limit: 1,
      });

      if (customers.data.length > 0) {
        stripeCustomer = customers.data[0];

        // Get payment methods
        const methods = await stripe.paymentMethods.list({
          customer: stripeCustomer.id,
          type: "card",
        });
        paymentMethods = methods.data.map((pm) => ({
          id: pm.id,
          brand: pm.card?.brand || "unknown",
          last4: pm.card?.last4 || "****",
          expMonth: pm.card?.exp_month,
          expYear: pm.card?.exp_year,
          isDefault: pm.id === stripeCustomer?.invoice_settings?.default_payment_method,
        }));

        // Get invoices
        const invoices = await stripe.invoices.list({
          customer: stripeCustomer.id,
          limit: 20,
        });
        stripeInvoices = invoices.data.map((inv) => ({
          id: inv.id,
          number: inv.number,
          amount: inv.amount_paid / 100,
          currency: inv.currency,
          status: inv.status,
          date: inv.created ? new Date(inv.created * 1000).toISOString() : null,
          pdfUrl: inv.invoice_pdf,
          hostedUrl: inv.hosted_invoice_url,
          description: inv.description || inv.lines?.data[0]?.description || "Payment",
        }));
      }
    } catch (stripeError) {
      logger.api.error("Parent billing Stripe error", stripeError);
      // Continue without Stripe data
    }

    // Calculate summary stats
    const totalSpent = user.payments
      .filter((p) => p.status === "SUCCEEDED")
      .reduce((sum, p) => sum + p.amount, 0) / 100;

    const pendingPayments = enrollments.filter(
      (e) => e.paymentStatus === "PENDING"
    ).length;

    const activeEnrollments = enrollments.filter(
      (e) => e.status === "ACTIVE"
    ).length;

    // Transform payments for display
    const paymentHistory = user.payments.map((p) => ({
      id: p.id,
      amount: p.amount / 100,
      currency: p.currency,
      status: p.status,
      date: p.createdAt.toISOString(),
      stripePaymentId: p.stripePaymentIntentId,
    }));

    // Add class request payments to history
    const classPayments = classRequests
      .filter((cr) => cr.paymentStatus === "PAID" && cr.paidAt)
      .map((cr) => ({
        id: cr.id,
        amount: (cr.totalPrice || 0) / 100,
        currency: "usd",
        status: "SUCCEEDED",
        date: cr.paidAt?.toISOString() || cr.createdAt.toISOString(),
        description: `1-on-1 Class: ${cr.requestedTopic}`,
        studentName: cr.studentName,
        type: "one-on-one",
      }));

    // Add enrollment payments to history
    const enrollmentPayments = enrollments
      .filter((e) => e.paymentStatus === "SUCCEEDED")
      .map((e) => ({
        id: e.id,
        amount: (e.program?.priceCents || 0) / 100,
        currency: "usd",
        status: "SUCCEEDED",
        date: e.startDate?.toISOString() || e.createdAt.toISOString(),
        description: `Program: ${e.program?.title}`,
        studentName: e.studentProfile?.name,
        type: "program",
      }));

    // Combine and sort all payment history
    const allPayments = [
      ...paymentHistory.map((p) => ({ ...p, type: "payment" })),
      ...classPayments,
      ...enrollmentPayments,
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Get upcoming/pending payments
    const upcomingPayments = [
      ...enrollments
        .filter((e) => e.paymentStatus === "PENDING")
        .map((e) => ({
          id: e.id,
          type: "program",
          description: `Program: ${e.program?.title}`,
          amount: (e.program?.priceCents || 0) / 100,
          studentName: e.studentProfile?.name,
          dueDate: null,
        })),
      ...classRequests
        .filter((cr) => cr.paymentStatus === "PENDING")
        .map((cr) => ({
          id: cr.id,
          type: "one-on-one",
          description: `1-on-1 Class: ${cr.requestedTopic}`,
          amount: (cr.totalPrice || 0) / 100,
          studentName: cr.studentName,
          dueDate: null,
        })),
    ];

    return NextResponse.json({
      summary: {
        totalSpent,
        pendingPayments,
        activeEnrollments,
        totalPayments: allPayments.length,
      },
      paymentHistory: allPayments.slice(0, 20),
      upcomingPayments,
      invoices: stripeInvoices,
      paymentMethods,
      children: user.parentProfile?.children || [],
      hasStripeCustomer: !!stripeCustomer,
    });
  } catch (error) {
    logger.db.error("[parent/billing] Error", error);
    return NextResponse.json(
      { error: "Failed to load billing data" },
      { status: 500 }
    );
  }
}
