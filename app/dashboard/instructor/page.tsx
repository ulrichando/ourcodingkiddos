import Link from "next/link";
import { Plus, Calendar, Users, BookOpen, Clock } from "lucide-react";

const stats = [
  { label: "Today's Classes", value: 0, icon: Calendar },
  { label: "Total Students", value: 0, icon: Users },
  { label: "Upcoming Sessions", value: 0, icon: Clock },
  { label: "Total Bookings", value: 0, icon: BookOpen },
];

export default function InstructorDashboard() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
            <p className="text-slate-600">Welcome back, Coach!</p>
          </div>
          <Link href="/dashboard/instructor" className="inline-flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-md font-semibold shadow">
            <Plus className="h-4 w-4" /> Create Class
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                <stat.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:col-span-2 space-y-3 min-h-[260px]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Upcoming Classes</h3>
              <Link href="/schedule" className="text-xs font-semibold text-slate-600">
                View All
              </Link>
            </div>
            <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-500 text-sm">
              No upcoming classes scheduled
              <div className="mt-4">
                <Link href="/dashboard/instructor" className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-semibold">
                  <Plus className="h-4 w-4" /> Create Your First Class
                </Link>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Quick Actions</h3>
            <div className="space-y-2 text-sm text-slate-700">
              <Link href="/dashboard/instructor" className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-slate-500" /> Create Class
              </Link>
              <Link href="/dashboard/instructor" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-500" /> View Students
              </Link>
              <Link href="/dashboard/instructor" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-500" /> Manage Content
              </Link>
              <Link href="/dashboard/parent" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" /> Availability
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-sm text-slate-500">
              <p className="font-semibold text-slate-900 mb-1">Recent Bookings</p>
              <p>No recent bookings</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
