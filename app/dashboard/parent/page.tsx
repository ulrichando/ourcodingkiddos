"use client";

import Link from "next/link";
import { Plus, Calendar, MessageCircle, BookOpen, ArrowRight, Users } from "lucide-react";

const stats = [
  { label: "Students", value: 0, icon: Users, color: "bg-purple-50 text-purple-600" },
  { label: "Total XP", value: 0, icon: BookOpen, color: "bg-amber-50 text-amber-600" },
  { label: "Badges Earned", value: 0, icon: MessageCircle, color: "bg-emerald-50 text-emerald-600" },
  { label: "Upcoming Classes", value: 0, icon: Calendar, color: "bg-sky-50 text-sky-600" },
];

const explore = [
  { title: "HTML Basics", level: "Beginner" },
  { title: "Python for Kids", level: "Beginner" },
];

export default function ParentDashboard() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold">Welcome back, Ando! 👋</h1>
          <p className="text-slate-600">Here's what's happening with your young coders today.</p>
        </header>

        <div className="grid md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <span className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
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
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 lg:col-span-2 min-h-[220px] flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Add Your First Student</h3>
            <p className="text-sm text-slate-600 mb-4">Get started by adding your child's profile</p>
            <Link href="/add-student" className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-semibold">
              <Plus className="h-4 w-4" /> Add Student
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Upcoming Classes</h3>
              <Link href="/schedule" className="text-xs font-semibold text-slate-600">
                View All
              </Link>
            </div>
            <p className="text-sm text-slate-500">No upcoming classes</p>
            <Link href="/schedule" className="inline-flex items-center justify-center gap-2 border border-slate-200 rounded-md px-3 py-2 text-sm font-semibold text-slate-700">
              Book a Class
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Explore Courses</h3>
              <Link href="/courses/intro" className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {explore.map((course) => (
                <Link
                  key={course.title}
                  href={`/courses/${course.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="border border-slate-200 bg-white rounded-xl px-3 py-3 flex items-center justify-between hover:border-purple-200"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{course.title}</p>
                    <p className="text-xs text-slate-500">{course.level}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Quick Actions</h3>
            <div className="space-y-2 text-sm text-slate-700">
              <Link href="/schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" /> Book a Class
              </Link>
              <Link href="/courses/intro" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-500" /> Browse Courses
              </Link>
              <Link href="/dashboard/parent" className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-slate-500" /> View Progress Reports
              </Link>
              <Link href="/dashboard/parent" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-slate-500" /> Contact Instructor
              </Link>
            </div>
            <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 space-y-1">
              <p className="text-sm font-semibold">Free Trial</p>
              <p className="text-xs text-white/90">You have 7 days left in your free trial</p>
              <Link href="/subscription" className="inline-flex mt-2 items-center justify-center bg-white text-purple-600 font-semibold text-sm px-3 py-2 rounded-full">
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
