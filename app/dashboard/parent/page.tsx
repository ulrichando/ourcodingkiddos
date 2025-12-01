"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Calendar, BookOpen, Award, ChevronRight, Clock, Star, TrendingUp, MessageSquare, Users, Activity, Zap, Target, Settings } from "lucide-react";
import StudentCard from "../../../components/dashboard/StudentCard";
import Button from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { useSession } from "next-auth/react";
import { Video } from "lucide-react";

async function fetchClasses() {
  const res = await fetch("/api/classes", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.sessions ?? [];
}

export default function ParentDashboardPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<{
    plan_type: string;
    status: string;
    startDate?: Date;
    endDate?: Date;
  } | null>(null);

  // Check if user is admin - admins bypass all subscription restrictions
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  useEffect(() => {
    if (!session?.user?.email) return;
    setLoadingStudents(true);
    fetch("/api/students", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setStudents(data.students || []))
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false));
    fetchClasses().then((data) => {
      const normalized = data
        .map((c: any) => ({
          ...c,
          start: new Date(c.startTime || c.start),
        }))
        .sort((a: any, b: any) => a.start.getTime() - b.start.getTime());
      const buffer = new Date(Date.now() - 60 * 60 * 1000);
      const futureOnly = normalized.filter((cls) => cls.start >= buffer);
      setUpcoming(futureOnly);
    });

    // Subscription lookup (fallback to demo free trial)
    fetch("/api/subscriptions", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        const sub = data?.subscription || data?.subscriptions?.[0];
        if (sub) {
          setSubscription({
            plan_type: sub.plan_type || sub.planType || "free_trial",
            status: sub.status || "active",
            startDate: sub.startDate ? new Date(sub.startDate) : undefined,
            endDate: sub.endDate ? new Date(sub.endDate) : undefined,
          });
        } else {
          setSubscription(null);
        }
      })
      .catch(() => {
        setSubscription(null);
      });
  }, [session?.user?.email]);

  const totalXP = useMemo(() => students.reduce((sum, s) => sum + (s.totalXp || s.total_xp || 0), 0), [students]);
  const totalBadges = useMemo(() => students.reduce((sum, s) => sum + (s.badges?.length || 0), 0), [students]);
  // Admin users never have trial expiration restrictions
  const trialExpired = !isAdmin &&
    subscription?.plan_type === "free_trial" &&
    subscription?.endDate &&
    subscription.endDate.getTime() < Date.now();
  const planLabel = isAdmin
    ? "Admin Access"
    : subscription?.plan_type && subscription.plan_type !== "free_trial"
      ? subscription.plan_type === "family"
        ? "Premium Family"
        : "Premium"
      : subscription?.plan_type === "free_trial"
        ? "Free Trial"
        : "No Plan";

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}! 👋
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Here&apos;s what&apos;s happening with your young coders today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              { label: "Students", value: students.length, icon: Users, color: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30" },
              { label: "Total XP", value: totalXP.toLocaleString(), icon: Star, color: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30" },
              { label: "Badges Earned", value: totalBadges, icon: Award, color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30" },
              { label: "Upcoming Classes", value: upcoming.length, icon: Calendar, color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30" },
              {
                label: planLabel,
                value: isAdmin
                  ? "Unlimited"
                  : subscription?.plan_type === "free_trial" && subscription?.endDate
                    ? `${Math.max(0, Math.ceil((subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days left`
                    : subscription?.status === "active"
                      ? "Active"
                      : "Inactive",
                icon: TrendingUp,
                color: "text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30",
              },
            ].map((stat, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.color} flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 truncate">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Students Section */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {trialExpired && (
              <Card className="border border-amber-200 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-amber-800 dark:text-amber-400">Free trial ended</p>
                    <p className="text-sm text-amber-700 dark:text-amber-500">Upgrade to continue accessing classes and progress.</p>
                  </div>
                  <Link href="/checkout?plan=monthly">
                    <Button className="bg-purple-600 text-white hover:bg-purple-700">Upgrade</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Your Students</h2>

            {loadingStudents ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center text-slate-500 dark:text-slate-400">Loading students...</CardContent>
              </Card>
            ) : students.length === 0 ? (
              <Card className="border-2 border-dashed border-slate-200 dark:border-slate-600">
                <CardContent className="p-12 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-3xl">👤</div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Add Your First Student</h3>
                  <p className="text-slate-500 dark:text-slate-400">Get started by adding your child&apos;s profile.</p>
                  <Link href="/dashboard/parent/add-student">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Student
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={{
                      ...student,
                      total_xp: student.totalXp ?? 0,
                      current_level: student.currentLevel ?? 1,
                      streak_days: student.streakDays ?? 0,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Recent Activity Feed */}
            {students.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    Recent Activity
                  </h2>
                </div>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {students.slice(0, 3).map((student, idx) => {
                        const activities = [
                          { icon: Award, label: "Earned new badge", color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30", time: "2 hours ago" },
                          { icon: Zap, label: `Gained ${Math.floor(Math.random() * 50) + 10} XP`, color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30", time: "5 hours ago" },
                          { icon: BookOpen, label: "Completed a lesson", color: "text-green-500 bg-green-100 dark:bg-green-900/30", time: "1 day ago" },
                        ];
                        const activity = activities[idx % activities.length];
                        return (
                          <div key={student.id} className="flex items-center gap-3 pb-4 last:pb-0 border-b last:border-b-0 border-slate-100 dark:border-slate-700">
                            <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}>
                              <activity.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                {student.name || student.username}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{activity.label}</p>
                            </div>
                            <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">{activity.time}</span>
                          </div>
                        );
                      })}
                      {students.length === 0 && (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-8">No recent activity yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Learning Progress Overview */}
            {students.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    Learning Progress
                  </h2>
                </div>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {students.map((student) => {
                        const progress = Math.min(100, ((student.totalXp || 0) / 1000) * 100);
                        return (
                          <div key={student.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{student.avatar || "👤"}</span>
                                <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                  {student.name || student.username}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 dark:text-slate-400">Level {student.currentLevel || 1}</span>
                                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">{student.totalXp || 0} XP</span>
                              </div>
                            </div>
                            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500 dark:text-slate-400">
                                {student.badges?.length || 0} badges earned
                              </span>
                              <span className="text-slate-500 dark:text-slate-400">
                                🔥 {student.streakDays || 0} day streak
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Explore Courses */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Explore Courses</h2>
                <Link href="/courses">
                  <Button variant="ghost">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: "HTML Basics", level: "Beginner", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" },
                  { name: "Python for Kids", level: "Beginner", color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
                ].map((course) => (
                  <Link key={course.name} href="/courses" className="block">
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${course.color}`}>
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">{course.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{course.level}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </CardContent>
                  </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-900 dark:text-slate-100">
                  <Calendar className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  Upcoming Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcoming.length === 0 || trialExpired ? (
                  <div className="text-center py-6 space-y-2">
                    <p className="text-slate-500 dark:text-slate-400">
                      {trialExpired ? "Trial ended. Upgrade to keep booking classes." : "No upcoming classes"}
                    </p>
                    <Link href="/schedule">
                      <Button variant="outline" size="sm">
                        {trialExpired ? "View plans" : "Book a Class"}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcoming.map((cls) => (
                      <div key={cls.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{cls.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {cls.start.toLocaleDateString()} {cls.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                          </p>
                        </div>
                        {cls.meetingUrl && (
                          <span className="inline-flex items-center gap-1 text-sm text-slate-400 dark:text-slate-500">
                            <Video className="w-4 h-4" /> Join (student only)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Book a Class", icon: Calendar, href: "/schedule" },
                  { label: "Browse Courses", icon: BookOpen, href: "/courses" },
                  { label: "View Certificates", icon: Award, href: "/certificates" },
                  { label: "View Progress Reports", icon: TrendingUp, href: "/dashboard/parent/reports" },
                  { label: "Manage Students", icon: Settings, href: "/dashboard/parent/students" },
                  {
                    label: "Contact Instructor",
                    icon: MessageSquare,
                    href: "/messages",
                  },
                ].map((action) => (
                  <Link key={action.label} href={action.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-3 px-0"
                    >
                      <action.icon className="w-4 h-4 text-slate-700 dark:text-slate-400 flex-shrink-0" />
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Only show upgrade card for non-admin users */}
            {!isAdmin && subscription?.plan_type === "free_trial" && subscription?.endDate && (
              <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white overflow-hidden">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/80">Free Trial</p>
                      <p className="text-sm font-semibold">
                        {Math.max(0, Math.ceil((subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining
                      </p>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(0, Math.min(100, (subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7) * 100))}%`
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/85">
                    <span>Unlock all classes</span>
                    <span className="font-semibold">Upgrade</span>
                  </div>
                  <Link href="/pricing">
                    <Button className="w-full bg-white text-purple-600 hover:bg-slate-100">Upgrade Now</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

    </main>
  );
}
