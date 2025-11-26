"use client";

import AdminNav from "../../../components/admin/AdminNav";
import AdminStatCard from "../../../components/admin/AdminStatCard";

const metrics: { label: string; value: string; sublabel: string; accent: "purple" | "orange" | "green" | "blue" }[] = [
  { label: "Active Students", value: "1,248", sublabel: "+12% vs last month", accent: "purple" },
  { label: "Active Parents", value: "980", sublabel: "+8% vs last month", accent: "orange" },
  { label: "Monthly Revenue", value: "$42,300", sublabel: "ARR: $507k", accent: "green" },
  { label: "Completion Rate", value: "78%", sublabel: "Course completion", accent: "blue" },
];

const recent = [
  { name: "Emma Johnson", role: "Student", activity: "Completed JS Quests", time: "2h ago" },
  { name: "Alex Kim", role: "Parent", activity: "Upgraded to Family Plan", time: "5h ago" },
  { name: "Coach Sam", role: "Instructor", activity: "Finished 3 sessions", time: "7h ago" },
  { name: "Priya S.", role: "Student", activity: "Earned Bug Squasher badge", time: "9h ago" },
];

export default function AdminOverviewPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Admin</p>
          <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        </div>
        <AdminNav />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <AdminStatCard key={m.label} {...m} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">System Health</h2>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">●</span> API latency: 120ms (avg)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">●</span> Error rate: 0.2% (7d)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">●</span> Uptime: 99.97%
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Recent Activity</h2>
          <div className="space-y-3">
            {recent.map((r) => (
              <div key={r.name + r.time} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{r.name} • {r.role}</p>
                  <p className="text-sm text-slate-600">{r.activity}</p>
                </div>
                <span className="text-xs text-slate-500">{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
