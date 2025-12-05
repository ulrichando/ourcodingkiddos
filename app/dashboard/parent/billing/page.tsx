"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  CreditCard,
  Download,
  ExternalLink,
  Receipt,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  FileText,
  Plus,
  Trash2,
  Shield,
  ArrowLeft,
  Wallet,
  History,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";

interface BillingSummary {
  totalSpent: number;
  pendingPayments: number;
  activeEnrollments: number;
  totalPayments: number;
}

interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  description?: string;
  studentName?: string;
  type: string;
}

interface Invoice {
  id: string;
  number: string | null;
  amount: number;
  currency: string;
  status: string | null;
  date: string | null;
  pdfUrl: string | null;
  hostedUrl: string | null;
  description: string;
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
}

interface UpcomingPayment {
  id: string;
  type: string;
  description: string;
  amount: number;
  studentName?: string;
  dueDate: string | null;
}

export default function ParentBillingPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "invoices" | "methods">("overview");

  useEffect(() => {
    if (!session?.user?.email) return;

    fetchBillingData();
  }, [session?.user?.email]);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/parent/billing", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary);
        setPaymentHistory(data.paymentHistory || []);
        setInvoices(data.invoices || []);
        setPaymentMethods(data.paymentMethods || []);
        setUpcomingPayments(data.upcomingPayments || []);
      }
    } catch (error) {
      console.error("Failed to fetch billing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "succeeded" || statusLower === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="w-3 h-3" />
          Paid
        </span>
      );
    }
    if (statusLower === "pending" || statusLower === "open") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
    if (statusLower === "failed" || statusLower === "canceled") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle className="w-3 h-3" />
          Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
        {status}
      </span>
    );
  };

  const getCardBrandIcon = (brand: string) => {
    const brandLower = brand.toLowerCase();
    if (brandLower === "visa") return "💳";
    if (brandLower === "mastercard") return "💳";
    if (brandLower === "amex") return "💳";
    return "💳";
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string = "usd") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (sessionStatus === "loading" || loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              ))}
            </div>
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/parent"
            className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-purple-500" />
            Billing & Payments
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your payments, view invoices, and update payment methods
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(summary?.totalSpent || 0)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {summary?.totalPayments || 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {summary?.pendingPayments || 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {summary?.activeEnrollments || 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Active Programs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 overflow-x-auto">
          {[
            { key: "overview", label: "Overview", icon: Wallet },
            { key: "history", label: "Payment History", icon: History },
            { key: "invoices", label: "Invoices", icon: FileText },
            { key: "methods", label: "Payment Methods", icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upcoming Payments */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  Upcoming Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      No pending payments
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      You&apos;re all caught up!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                            {payment.description}
                          </p>
                          {payment.studentName && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              For: {payment.studentName}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {formatCurrency(payment.amount)}
                          </p>
                          <span className="text-xs text-amber-600 dark:text-amber-400">
                            Pending
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between text-slate-900 dark:text-slate-100">
                  <span className="flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-500" />
                    Recent Transactions
                  </span>
                  {paymentHistory.length > 5 && (
                    <button
                      onClick={() => setActiveTab("history")}
                      className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-normal flex items-center gap-1"
                    >
                      View all
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paymentHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                      <Receipt className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      No transactions yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {paymentHistory.slice(0, 5).map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                            {payment.description || "Payment"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(payment.date)}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {formatCurrency(payment.amount, payment.currency)}
                          </p>
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Methods Preview */}
            <Card className="border-0 shadow-sm md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between text-slate-900 dark:text-slate-100">
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-500" />
                    Saved Payment Methods
                  </span>
                  <button
                    onClick={() => setActiveTab("methods")}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-normal flex items-center gap-1"
                  >
                    Manage
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      No saved payment methods
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Payment methods are saved automatically when you make a purchase
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {paymentMethods.slice(0, 2).map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        <span className="text-2xl">{getCardBrandIcon(method.brand)}</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-slate-900 dark:text-slate-100 capitalize">
                            {method.brand} •••• {method.last4}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Expires {method.expMonth}/{method.expYear}
                          </p>
                        </div>
                        {method.isDefault && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "history" && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                    <Receipt className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    No payment history
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Your payment history will appear here once you make a purchase
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                          Date
                        </th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                          Description
                        </th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                          Student
                        </th>
                        <th className="text-right py-3 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                          Amount
                        </th>
                        <th className="text-right py-3 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b border-slate-100 dark:border-slate-700/50 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <td className="py-3 px-2 text-sm text-slate-600 dark:text-slate-400">
                            {formatDate(payment.date)}
                          </td>
                          <td className="py-3 px-2">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {payment.description || "Payment"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 capitalize">
                              {payment.type}
                            </p>
                          </td>
                          <td className="py-3 px-2 text-sm text-slate-600 dark:text-slate-400">
                            {payment.studentName || "-"}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {formatCurrency(payment.amount, payment.currency)}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            {getStatusBadge(payment.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "invoices" && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                Invoices & Receipts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    No invoices available
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Invoices will appear here after you make payments
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                            {invoice.number || `Invoice ${invoice.id.slice(-8)}`}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(invoice.date)} • {invoice.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {formatCurrency(invoice.amount, invoice.currency)}
                          </p>
                          {getStatusBadge(invoice.status || "unknown")}
                        </div>
                        <div className="flex gap-2">
                          {invoice.pdfUrl && (
                            <a
                              href={invoice.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            </a>
                          )}
                          {invoice.hostedUrl && (
                            <a
                              href={invoice.hostedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              title="View Invoice"
                            >
                              <ExternalLink className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "methods" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                  Saved Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                      <CreditCard className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      No saved payment methods
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Your payment methods will be saved automatically when you make a purchase
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          method.isDefault
                            ? "border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{getCardBrandIcon(method.brand)}</span>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                              {method.brand} ending in {method.last4}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Expires {method.expMonth}/{method.expYear}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {method.isDefault ? (
                            <span className="text-sm px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 font-medium">
                              Default
                            </span>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                              Set as default
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-0 shadow-sm bg-slate-50 dark:bg-slate-800/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      Secure Payments
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      All payments are processed securely through Stripe. Your card details are
                      encrypted and never stored on our servers. We comply with PCI DSS standards
                      to ensure your payment information is always protected.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
