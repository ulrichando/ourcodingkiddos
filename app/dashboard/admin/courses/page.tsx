"use client";

import AdminNav from "../../../../components/admin/AdminNav";
import AdminTable from "../../../../components/admin/AdminTable";

type CourseRow = {
  title: string;
  category: string;
  level: string;
  published: boolean;
  lessons: number;
  enrollments: number;
};

const courses: CourseRow[] = [
  { title: "HTML Funhouse", category: "HTML", level: "Beginner", published: true, lessons: 8, enrollments: 320 },
  { title: "CSS Magic", category: "CSS", level: "Beginner", published: true, lessons: 6, enrollments: 280 },
  { title: "JavaScript Quests", category: "JavaScript", level: "Intermediate", published: true, lessons: 10, enrollments: 450 },
  { title: "Python Puzzles", category: "Python", level: "Beginner", published: false, lessons: 5, enrollments: 0 },
  { title: "Roblox Studio", category: "Roblox", level: "Intermediate", published: true, lessons: 7, enrollments: 190 },
];

export default function AdminCoursesPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Courses</h1>
        </div>
        <AdminNav />
      </div>

      <AdminTable<CourseRow>
        columns={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "level", label: "Level" },
          {
            key: "published",
            label: "Status",
            render: (c) => (
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  c.published ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                {c.published ? "Published" : "Draft"}
              </span>
            ),
          },
          { key: "lessons", label: "Lessons" },
          { key: "enrollments", label: "Enrollments" },
          {
            key: "title",
            label: "Actions",
            render: (c) => (
              <div className="flex gap-2 text-xs">
                <button className="px-2 py-1 rounded bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600">Edit</button>
                <button className="px-2 py-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800">
                  {c.published ? "Unpublish" : "Publish"}
                </button>
              </div>
            ),
          },
        ]}
        data={courses}
      />
    </main>
  );
}
