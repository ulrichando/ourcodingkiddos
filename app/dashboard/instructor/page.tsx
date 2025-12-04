"use client";

import Link from "next/link";
import React, { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Calendar,
  Users,
  BookOpen,
  Clock,
  Plus,
  ChevronRight,
  MessageSquare,
  Video,
  UserCheck,
  AlertTriangle,
  Bell,
} from "lucide-react";

async function fetchSessions() {
  const res = await fetch("/api/instructor/classes", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.sessions ?? [];
}

export default function InstructorDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Instructor";
  const [sessions, setSessions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  // Check if this is a demo account
  const isDemoAccount = session?.user?.email?.includes("demo") || session?.user?.email?.endsWith("@example.com");
  const [checkingAttendance, setCheckingAttendance] = useState<string | null>(null);
  const [attendanceResult, setAttendanceResult] = useState<{
    classId: string;
    online: number;
    offline: number;
    offlineStudents: string[];
  } | null>(null);

  // Check attendance for a class
  const checkAttendance = async (classId: string, notifyParents = false) => {
    setCheckingAttendance(classId);
    setAttendanceResult(null);
    try {
      const res = await fetch(`/api/instructor/attendance?classId=${classId}`);
      if (!res.ok) throw new Error("Failed to check attendance");
      const data = await res.json();

      setAttendanceResult({
        classId,
        online: data.summary.online,
        offline: data.summary.offline,
        offlineStudents: data.attendance.filter((a: any) => !a.online).map((a: any) => a.studentName),
      });

      // If there are offline students, notify instructor and optionally parents
      if (data.summary.offline > 0) {
        await fetch("/api/instructor/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classId, notifyParents }),
        });
      }
    } catch (error) {
      console.error("Error checking attendance:", error);
    } finally {
      setCheckingAttendance(null);
    }
  };

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

    // Fetch dashboard data (students and bookings)
    fetch("/api/instructor/dashboard", { credentials: "include" })
      .then((res) => res.ok ? res.json() : { students: [], bookings: [] })
      .then((data) => {
        if (!mounted) return;
        setStudents(data.students || []);
        setBookings(data.bookings || []);
      })
      .catch(() => {
        if (!mounted) return;
        setStudents([]);
        setBookings([]);
      });

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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Demo Account Banner */}
        {isDemoAccount && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200">Demo Account</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                You&apos;re logged in as <span className="font-mono">{session?.user?.email}</span>. This is a demo account for testing purposes.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Instructor Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Welcome back, {userName}!</p>
          </div>
          <Link
            href="/dashboard/instructor/create-class"
            className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md font-semibold shadow"
          >
            <Plus className="h-4 w-4" /> Create Class
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: "Today's Classes", value: todays.length, icon: Calendar, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
            { label: "Total Students", value: uniqueStudentCount, icon: Users, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
            { label: "Upcoming Sessions", value: upcoming.length, icon: Clock, color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
            { label: "Total Bookings", value: bookings.length, icon: BookOpen, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 flex items-center gap-3"
            >
              <span className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 lg:col-span-2 space-y-4 min-h-[260px]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Upcoming Classes</h3>
              <Link href="/dashboard/instructor" className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200">
                View All <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="border border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                No classes yet. Create one to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((session) => (
                  <div key={session.id} className="space-y-2">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex flex-col items-center justify-center">
                        <span className="text-xs font-medium">
                          {session.start ? session.start.toLocaleDateString(undefined, { weekday: "short" }) : ""}
                        </span>
                        <span className="text-lg font-bold">{session.start ? session.start.getDate() : ""}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-800 dark:text-slate-200">{session.title}</h3>
                          {session.start && new Date().toDateString() === session.start.toDateString() && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">Today</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
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
                          <span className="text-xs px-2 py-1 rounded-full border border-slate-200 dark:border-slate-600 capitalize text-slate-700 dark:text-slate-300">
                            {(session.sessionType || session.type || "").toLowerCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Check Attendance Button */}
                        <button
                          onClick={() => checkAttendance(session.id, true)}
                          disabled={checkingAttendance === session.id}
                          className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white px-3 py-2 rounded-md text-sm"
                          title="Check student attendance and notify parents of offline students"
                        >
                          {checkingAttendance === session.id ? (
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4" /> Attendance
                            </>
                          )}
                        </button>
                        {session.meetingUrl && (
                          <Link
                            href={session.meetingUrl}
                            className="inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Video className="h-4 w-4" /> Join
                          </Link>
                        )}
                      </div>
                    </div>
                    {/* Attendance Result */}
                    {attendanceResult && attendanceResult.classId === session.id && (
                      <div className={`p-3 rounded-lg text-sm ${
                        attendanceResult.offline > 0
                          ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                          : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      }`}>
                        <div className="flex items-center gap-2">
                          {attendanceResult.offline > 0 ? (
                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                          )}
                          <span className={attendanceResult.offline > 0 ? "text-amber-800 dark:text-amber-300" : "text-green-800 dark:text-green-300"}>
                            {attendanceResult.online} online, {attendanceResult.offline} offline
                          </span>
                        </div>
                        {attendanceResult.offline > 0 && (
                          <div className="mt-2 text-amber-700 dark:text-amber-400">
                            <div className="flex items-center gap-1 mb-1">
                              <Bell className="h-3 w-3" />
                              <span className="text-xs">Parents notified about:</span>
                            </div>
                            <span className="text-xs">{attendanceResult.offlineStudents.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 space-y-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Quick Actions</h3>
              {[
                { label: "View Students", href: "/dashboard/instructor/students", icon: Users },
                { label: "Messages", href: "/messages", icon: MessageSquare },
                { label: "Availability", href: "/dashboard/instructor/availability", icon: Calendar },
              ].map((action) => (
                <Link key={action.label} href={action.href} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100">
                  <action.icon className="h-4 w-4 text-slate-500 dark:text-slate-400" /> {action.label}
                </Link>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Recent Bookings</h3>
              {bookings.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No recent bookings</p>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => {
                    const timeAgo = (dateStr: string) => {
                      const date = new Date(dateStr);
                      const now = new Date();
                      const diffMs = now.getTime() - date.getTime();
                      const diffMins = Math.floor(diffMs / 60000);
                      const diffHours = Math.floor(diffMs / 3600000);
                      const diffDays = Math.floor(diffMs / 86400000);
                      if (diffMins < 1) return "just now";
                      if (diffMins < 60) return `${diffMins}m ago`;
                      if (diffHours < 24) return `${diffHours}h ago`;
                      return `${diffDays}d ago`;
                    };
                    return (
                      <div key={booking.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-sm">
                          {booking.avatar || booking.student?.[0] || "👤"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{booking.student} booked</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{booking.sessionTitle}</p>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {timeAgo(booking.createdAt)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
