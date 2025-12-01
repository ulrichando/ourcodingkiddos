"use client";

import AdminLayout from "../../../../components/admin/AdminLayout";
import AdminStatCard from "../../../../components/admin/AdminStatCard";

const financeStats: { label: string; value: string; sublabel: string; accent: "purple" | "orange" | "green" | "blue" }[] =
  [
    { label: "MRR", value: "$42.3k", sublabel: "+6% vs last month", accent: "green" },
    { label: "ARPU", value: "$38", sublabel: "Avg revenue per user", accent: "blue" },
    { label: "Refunds", value: "$520", sublabel: "Last 30 days", accent: "orange" },
    { label: "Churn", value: "3.2%", sublabel: "Rolling 30d", accent: "purple" },
  ];

const invoices = [
  { id: "INV-1001", user: "Alex Kim", amount: "$49", status: "Paid", date: "2025-02-10" },
  { id: "INV-1002", user: "Emma Johnson", amount: "$29", status: "Paid", date: "2025-02-09" },
  { id: "INV-1003", user: "Sam Coach", amount: "$29", status: "Open", date: "2025-02-08" },
];

export default function AdminFinancePage() {
  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Finance</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Financial Overview</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Monitor revenue, subscriptions, and financial metrics
          </p>
        </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {financeStats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
        ))}
      </div>

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
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-2 pr-4">{inv.id}</td>
                  <td className="py-2 pr-4">{inv.user}</td>
                  <td className="py-2 pr-4">{inv.amount}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        inv.status === "Paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-2 pr-4">{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </main>
    </AdminLayout>
  );
}
