"use client";

import AdminNav from "../../../../components/admin/AdminNav";

const reports = [
  { title: "Weekly Active Users", value: "2,340", change: "+9%" },
  { title: "Course Completion", value: "78%", change: "+3%" },
  { title: "XP Earned (7d)", value: "482k", change: "+12%" },
  { title: "Badges Awarded", value: "1,920", change: "+6%" },
];

export default function AdminReportsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Admin</p>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        </div>
        <AdminNav />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((r) => (
          <div key={r.title} className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 space-y-2">
            <p className="text-sm text-slate-600">{r.title}</p>
            <div className="text-2xl font-bold text-slate-900">{r.value}</div>
            <p className="text-sm text-emerald-600">{r.change} vs last week</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Notes</h2>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
          <li>Hook these cards to real analytics (DB/Stripe) when available.</li>
          <li>Add export buttons (CSV/PDF) and date range filters for production.</li>
        </ul>
      </div>
    </main>
  );
}
