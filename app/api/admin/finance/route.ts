import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { stripe } from "../../../../lib/stripe";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get total revenue this month
    const monthlyRevenue = await prisma.payment.aggregate({
      where: {
        status: "SUCCEEDED",
        createdAt: { gte: startOfMonth },
      },
      _sum: { amount: true },
    });

    // Get total revenue last month for comparison
    const lastMonthRevenue = await prisma.payment.aggregate({
      where: {
        status: "SUCCEEDED",
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      _sum: { amount: true },
    });

    // Get total revenue all time
    const totalRevenue = await prisma.payment.aggregate({
      where: { status: "SUCCEEDED" },
      _sum: { amount: true },
    });

    // Get total paying users (unique users with successful payments)
    const payingUsers = await prisma.payment.findMany({
      where: { status: "SUCCEEDED" },
      select: { userId: true },
      distinct: ["userId"],
    });

    // Calculate ARPU (Average Revenue Per User)
    const arpu = payingUsers.length > 0
      ? Math.round((totalRevenue._sum.amount || 0) / payingUsers.length)
      : 0;

    // Get refunds (last 30 days) - check for refunded payments
    const refundedPayments = await prisma.payment.aggregate({
      where: {
        status: "CANCELED",
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: { amount: true },
    });

    // Get program enrollment count
    const totalProgramEnrollments = await prisma.programEnrollment.count();

    // Get recent invoices from Stripe
    let recentInvoices: any[] = [];
    try {
      const stripeInvoices = await stripe.invoices.list({
        limit: 10,
      });

      recentInvoices = stripeInvoices.data.map((inv) => ({
        id: inv.number || inv.id,
        user: inv.customer_email || "Unknown",
        amount: `$${((inv.amount_paid || 0) / 100).toFixed(2)}`,
        status: inv.status === "paid" ? "Paid" : inv.status === "open" ? "Pending" : inv.status || "Unknown",
        date: inv.created ? new Date(inv.created * 1000).toLocaleDateString() : "N/A",
        stripeInvoiceId: inv.id,
      }));
    } catch (stripeError) {
      console.error("[admin/finance] Stripe invoices error:", stripeError);
      // Fall back to database payments if Stripe fails
      const dbPayments = await prisma.payment.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { email: true, name: true },
          },
        },
      });

      recentInvoices = dbPayments.map((p) => ({
        id: p.stripePaymentIntentId.slice(-8).toUpperCase(),
        user: p.user.email || "Unknown",
        amount: `$${(p.amount / 100).toFixed(2)}`,
        status: p.status === "SUCCEEDED" ? "Paid" : p.status === "PENDING" ? "Pending" : "Failed",
        date: p.createdAt.toLocaleDateString(),
      }));
    }

    // Get payment count by status
    const totalPayments = await prisma.payment.count({
      where: { status: "SUCCEEDED" },
    });

    // Revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueTrend = await prisma.$queryRaw<Array<{ month: string; revenue: bigint }>>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
        SUM(amount) as revenue
      FROM "Payment"
      WHERE "createdAt" >= ${sixMonthsAgo} AND status = 'SUCCEEDED'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt")
    `;

    // Calculate month-over-month growth
    const currentMonthRev = monthlyRevenue._sum.amount || 0;
    const lastMonthRev = lastMonthRevenue._sum.amount || 0;
    const revenueGrowth = lastMonthRev > 0
      ? Math.round(((currentMonthRev - lastMonthRev) / lastMonthRev) * 100)
      : 0;

    return NextResponse.json({
      stats: {
        totalRevenue: Math.round((totalRevenue._sum.amount || 0) / 100),
        arpu: Math.round(arpu / 100),
        refunds: Math.round((refundedPayments._sum.amount || 0) / 100),
        totalProgramEnrollments,
        payingUsers: payingUsers.length,
        monthlyRevenue: Math.round(currentMonthRev / 100),
        revenueGrowth,
        totalPayments,
      },
      invoices: recentInvoices,
      revenueTrend: revenueTrend.map((row) => ({
        month: row.month,
        revenue: Math.round(Number(row.revenue) / 100),
      })),
    });
  } catch (error) {
    console.error("[admin/finance] Error:", error);
    return NextResponse.json({ error: "Failed to fetch finance data" }, { status: 500 });
  }
}
