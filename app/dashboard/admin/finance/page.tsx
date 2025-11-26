"use client";

import AdminNav from "../../../../components/admin/AdminNav";
import AdminStatCard from "../../../../components/admin/AdminStatCard";

const financeStats = [
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
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Admin</p>
          <h1 className="text-2xl font-bold text-slate-900">Finance</h1>
        </div>
        <AdminNav />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {financeStats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Recent Invoices</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-600 border-b">
              <tr>
                <th className="py-2 pr-4">Invoice</th>
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-2 pr-4">{inv.id}</td>
                  <td className="py-2 pr-4">{inv.user}</td>
                  <td className="py-2 pr-4">{inv.amount}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        inv.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
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
  );
}
