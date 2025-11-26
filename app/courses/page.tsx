"use client";

import Link from "next/link";
import { Search, Filter, Star } from "lucide-react";

const courses = [
  {
    id: "html-basics",
    title: "HTML Basics for Kids",
    level: "beginner",
    age: "Ages 7-10",
    xp: 500,
    hours: 5,
    gradient: "from-orange-400 to-pink-500",
  },
  {
    id: "css-magic",
    title: "CSS Magic: Style Your Pages",
    level: "beginner",
    age: "Ages 7-10",
    xp: 500,
    hours: 5,
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    id: "js-adventures",
    title: "JavaScript Adventures",
    level: "beginner",
    age: "Ages 11-14",
    xp: 750,
    hours: 8,
    gradient: "from-amber-400 to-orange-500",
  },
  {
    id: "python-young",
    title: "Python for Young Coders",
    level: "beginner",
    age: "Ages 11-14",
    xp: 750,
    hours: 10,
    gradient: "from-green-400 to-emerald-500",
  },
  {
    id: "roblox-creator",
    title: "Roblox Game Creator",
    level: "beginner",
    age: "Ages 11-14",
    xp: 1000,
    hours: 12,
    gradient: "from-rose-400 to-pink-500",
  },
  {
    id: "web-advanced",
    title: "Advanced Web Development",
    level: "intermediate",
    age: "Ages 15-18",
    xp: 1500,
    hours: 20,
    gradient: "from-purple-400 to-indigo-500",
  },
];

const ageFilters = ["All Ages", "7-10 years", "11-14 years", "15-18 years"];
const levelFilters = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="pt-20 pb-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
              Learn to Code
            </span>
            <h1 className="text-4xl font-bold">Explore Our Courses</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From beginner-friendly introductions to advanced projects, find the perfect course for your coding journey.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 flex-1 w-full">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full outline-none text-sm text-slate-700"
              />
            </div>
            <div className="flex gap-2 items-center w-full md:w-auto">
              <span className="text-sm text-slate-600">All Languages</span>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-xs">HTML</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-xs">CSS</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-xs">JavaScript</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filters:
            </span>
            {ageFilters.map((age) => (
              <button
                key={age}
                className={`px-3 py-1 rounded-full border border-slate-200 ${
                  age === "All Ages" ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-white"
                }`}
              >
                {age}
              </button>
            ))}
            {levelFilters.map((level) => (
              <button
                key={level}
                className={`px-3 py-1 rounded-full border border-slate-200 ${
                  level === "All Levels" ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-white"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <p className="text-sm text-slate-500">Showing {courses.length} courses</p>

          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition">
                  <div className={`h-28 bg-gradient-to-r ${course.gradient}`} />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="px-2 py-1 rounded-full bg-slate-100 capitalize">{course.level}</span>
                      <span className="px-2 py-1 rounded-full bg-slate-100">{course.age}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900">{course.title}</h3>
                    <div className="flex gap-4 text-xs text-amber-500 font-semibold">
                      <span>★ {course.xp} XP</span>
                      <span className="text-slate-500">⏱ {course.hours}h</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
