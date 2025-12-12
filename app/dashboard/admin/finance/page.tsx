"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import AdminStatCard from "../../../../components/admin/AdminStatCard";
import { Loader2, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';



type FinanceData = {
  stats: {
    totalRevenue: number;
    arpu: number;
    refunds: number;
    totalProgramEnrollments: number;
    payingUsers: number;
    monthlyRevenue: number;
    revenueGrowth: number;
    totalPayments: number;
  };
  invoices: Array<{
    id: string;
    user: string;
    amount: string;
    status: string;
    date: string;
  }>;
  revenueTrend: Array<{
    month: string;
    revenue: number;
  }>;
};

export default function AdminFinancePage() {
  const [loading, setLoading] = useState(true);
  const [finance, setFinance] = useState<FinanceData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    try {
      const res = await fetch("/api/admin/finance", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setFinance(data);
      }
    } catch (error) {
      console.error("Failed to fetch finance data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFinance();
  };

  const financeStats: { label: string; value: string; sublabel: string; accent: "purple" | "orange" | "green" | "blue" }[] = finance
    ? [
        { label: "Total Revenue", value: `$${finance.stats.totalRevenue.toLocaleString()}`, sublabel: "All time", accent: "green" },
        { label: "ARPU", value: `$${finance.stats.arpu.toLocaleString()}`, sublabel: "Avg revenue per user", accent: "blue" },
        { label: "Refunds", value: `$${finance.stats.refunds.toLocaleString()}`, sublabel: "Last 30 days", accent: "orange" },
        { label: "Program Enrollments", value: `${finance.stats.totalProgramEnrollments}`, sublabel: "Total enrollments", accent: "purple" },
      ]
    : [];

  if (loading) {
    return (
      <AdminLayout>
        <main className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500 mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading financial data...</p>
          </div>
        </main>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Finance</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Financial Overview</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Monitor revenue from program enrollments and 1-on-1 classes
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {financeStats.map((stat) => (
            <AdminStatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Revenue Growth & Payments by Type */}
        {finance && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Revenue This Month
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  ${finance.stats.monthlyRevenue.toLocaleString()}
                </span>
                {finance.stats.revenueGrowth !== 0 && (
                  <span
                    className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${
                      finance.stats.revenueGrowth > 0
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    {finance.stats.revenueGrowth > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {finance.stats.revenueGrowth > 0 ? "+" : ""}
                    {finance.stats.revenueGrowth}%
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Compared to last month
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Payment Summary
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Total Successful Payments
                  </span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {finance.stats.totalPayments}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Paying Users
                  </span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {finance.stats.payingUsers}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Program Enrollments
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {finance.stats.totalProgramEnrollments}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Trend */}
        {finance && finance.revenueTrend.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Revenue Trend (Last 6 Months)
            </h2>
            <div className="flex items-end gap-2 h-40">
              {finance.revenueTrend.map((item, idx) => {
                const maxRevenue = Math.max(...finance.revenueTrend.map((r) => r.revenue));
                const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {item.month.split("-")[1]}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      ${item.revenue}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Invoices */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 p-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Recent Invoices</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-600 dark:text-slate-300 border-b dark:border-slate-700">
                <tr>
                  <th className="py-2 pr-4">Invoice</th>
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                {finance && finance.invoices.length > 0 ? (
                  finance.invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="py-2 pr-4 font-mono text-xs">{inv.id}</td>
                      <td className="py-2 pr-4">{inv.user}</td>
                      <td className="py-2 pr-4 font-semibold">{inv.amount}</td>
                      <td className="py-2 pr-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            inv.status === "Paid"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                              : inv.status === "Pending"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-2 pr-4">{inv.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
