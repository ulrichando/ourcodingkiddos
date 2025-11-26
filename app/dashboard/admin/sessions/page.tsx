"use client";

import AdminNav from "../../../../components/admin/AdminNav";
import AdminTable from "../../../../components/admin/AdminTable";

type SessionRow = {
  course: string;
  instructor: string;
  type: "1:1" | "Group";
  startsAt: string;
  students: number;
  status: "Scheduled" | "Completed" | "Cancelled";
};

const sessions: SessionRow[] = [
  { course: "Roblox 101", instructor: "Coach Alex", type: "Group", startsAt: "Today 4:00 PM", students: 8, status: "Scheduled" },
  { course: "JS Quests", instructor: "Coach Sam", type: "1:1", startsAt: "Today 5:00 PM", students: 1, status: "Scheduled" },
  { course: "Python Puzzles", instructor: "Coach Priya", type: "Group", startsAt: "Tomorrow 3:00 PM", students: 10, status: "Scheduled" },
  { course: "CSS Magic", instructor: "Coach Lee", type: "1:1", startsAt: "Tomorrow 6:00 PM", students: 1, status: "Cancelled" },
];

export default function AdminSessionsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Admin</p>
          <h1 className="text-2xl font-bold text-slate-900">Sessions</h1>
        </div>
        <AdminNav />
      </div>

      <AdminTable<SessionRow>
        columns={[
          { key: "course", label: "Course" },
          { key: "instructor", label: "Instructor" },
          { key: "type", label: "Type" },
          { key: "startsAt", label: "Starts At" },
          { key: "students", label: "Students" },
          {
            key: "status",
            label: "Status",
            render: (s) => (
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  s.status === "Scheduled"
                    ? "bg-emerald-100 text-emerald-700"
                    : s.status === "Completed"
                    ? "bg-slate-100 text-slate-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {s.status}
              </span>
            ),
          },
        ]}
        data={sessions}
      />
    </main>
  );
}
