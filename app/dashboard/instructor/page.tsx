"use client";

import Link from "next/link";
import React, { useMemo, useState, useEffect } from "react";
import {
  Calendar,
  Users,
  BookOpen,
  Clock,
  Plus,
  ChevronRight,
  MessageSquare,
  Video,
} from "lucide-react";

async function fetchSessions() {
  const res = await fetch("/api/instructor/classes", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.sessions ?? [];
}

export default function InstructorDashboard() {
  const userName = "Instructor";
  const [sessions, setSessions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchSessions().then((data) => {
      if (!mounted) return;
      // Normalize dates
      const normalized = data.map((s: any) => ({
        ...s,
        start: new Date(s.startTime || s.start),
        bookings: s.enrolledCount ?? 0,
      }));
      setSessions(normalized);
    });
    // simple demo bookings/students fallback (could be replaced with real fetch)
    setBookings([]);
    setStudents([]);
    return () => {
      mounted = false;
    };
  }, []);

  const upcoming = useMemo(() => {
    const future = sessions.filter((s) => s.start && s.start.getTime() > Date.now()).slice(0, 5);
    return future.length > 0 ? future : sessions.slice(0, 5); // fallback to show recent created
  }, [sessions]);
  const todays = useMemo(
    () =>
      sessions.filter(
        (s) => s.start.toDateString() === new Date().toDateString()
      ),
    [sessions]
  );
  const uniqueStudentCount = students.length;

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
            <p className="text-slate-600">Welcome back, {userName}!</p>
          </div>
          <Link
            href="/dashboard/instructor/create-class"
            className="inline-flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-md font-semibold shadow"
          >
            <Plus className="h-4 w-4" /> Create Class
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: "Today's Classes", value: todays.length, icon: Calendar, color: "bg-purple-100 text-purple-600" },
            { label: "Total Students", value: uniqueStudentCount, icon: Users, color: "bg-blue-100 text-blue-600" },
            { label: "Upcoming Sessions", value: upcoming.length, icon: Clock, color: "bg-green-100 text-green-600" },
            { label: "Total Bookings", value: bookings.length, icon: BookOpen, color: "bg-amber-100 text-amber-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3"
            >
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
          <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:col-span-2 space-y-4 min-h-[260px]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Upcoming Classes</h3>
              <Link href="/dashboard/instructor" className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                View All <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-500 text-sm">
                No classes yet. Create one to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex flex-col items-center justify-center">
                      <span className="text-xs font-medium">
                        {session.start ? session.start.toLocaleDateString(undefined, { weekday: "short" }) : ""}
                      </span>
                      <span className="text-lg font-bold">{session.start ? session.start.getDate() : ""}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800">{session.title}</h3>
                        {session.start && new Date().toDateString() === session.start.toDateString() && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Today</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {session.start
                            ? session.start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
                            : "--"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {session.bookings}/{session.maxStudents ?? "∞"}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full border border-slate-200 capitalize">
                          {(session.sessionType || session.type || "").toLowerCase()}
                        </span>
                      </div>
                    </div>
                    {session.meetingUrl && (
                      <Link
                        href={session.meetingUrl}
                        className="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-md text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Video className="h-4 w-4" /> Join
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-2">
              <h3 className="font-semibold text-slate-900">Quick Actions</h3>
              {[
                { label: "View Students", href: "/dashboard/instructor/students", icon: Users },
                { label: "Manage Content", href: "/dashboard/instructor/content", icon: BookOpen },
                { label: "Messages", href: "/messages", icon: MessageSquare },
                { label: "Availability", href: "/dashboard/instructor/availability", icon: Calendar },
              ].map((action) => (
                <Link key={action.label} href={action.href} className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900">
                  <action.icon className="h-4 w-4 text-slate-500" /> {action.label}
                </Link>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Recent Bookings</h3>
              {bookings.length === 0 ? (
                <p className="text-sm text-slate-500">No recent bookings</p>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm text-purple-700">
                        {booking.student[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{booking.student} booked</p>
                        <p className="text-xs text-slate-500">{booking.sessionTitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
