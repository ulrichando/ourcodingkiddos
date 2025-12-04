"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Calendar, BookOpen, Award, Clock, Star, TrendingUp, MessageSquare, Users, Activity, Zap, Target, Settings, User, Sparkles, Tent } from "lucide-react";
import StudentCard from "../../../components/dashboard/StudentCard";
import Button from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { useSession } from "next-auth/react";

async function fetchClasses() {
  const res = await fetch("/api/classes", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.sessions ?? [];
}

export default function ParentDashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Session is still loading
  const isLoading = sessionStatus === "loading";

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

    // Fetch recent activities
    setLoadingActivities(true);
    fetch("/api/students/activity", { credentials: "include" })
      .then((r) => r.ok ? r.json() : { activities: [] })
      .then((data) => setActivities(data.activities || []))
      .catch(() => setActivities([]))
      .finally(() => setLoadingActivities(false));
  }, [session?.user?.email]);

  const totalXP = useMemo(() => students.reduce((sum, s) => sum + (s.totalXp || s.total_xp || 0), 0), [students]);
  const totalBadges = useMemo(() => students.reduce((sum, s) => sum + (s.badges?.length || 0), 0), [students]);

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

        {/* Show loading state while session is loading */}
        {isLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-16" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
            {[
              { label: "Students", value: students.length, icon: Users, color: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30" },
              { label: "Total XP", value: totalXP.toLocaleString(), icon: Star, color: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30" },
              { label: "Badges Earned", value: totalBadges, icon: Award, color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30" },
              { label: "Upcoming Classes", value: upcoming.length, icon: Calendar, color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30" },
            ].map((stat, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-100 truncate">{stat.value}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 truncate">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Students Section */}
          <div className="lg:col-span-2 space-y-6">
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
                      {loadingActivities ? (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-4">Loading activities...</p>
                      ) : activities.length > 0 ? (
                        activities.slice(0, 5).map((activity) => {
                          const getActivityStyle = (type: string) => {
                            switch (type) {
                              case "badge":
                                return { icon: Award, color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30" };
                              case "achievement":
                                return { icon: Zap, color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30" };
                              case "lesson":
                                return { icon: BookOpen, color: "text-green-500 bg-green-100 dark:bg-green-900/30" };
                              default:
                                return { icon: Activity, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30" };
                            }
                          };
                          const style = getActivityStyle(activity.type);
                          const ActivityIcon = style.icon;
                          const timeAgo = (dateStr: string) => {
                            const date = new Date(dateStr);
                            const now = new Date();
                            const diffMs = now.getTime() - date.getTime();
                            const diffMins = Math.floor(diffMs / 60000);
                            const diffHours = Math.floor(diffMs / 3600000);
                            const diffDays = Math.floor(diffMs / 86400000);
                            if (diffMins < 1) return "just now";
                            if (diffMins < 60) return `${diffMins} min ago`;
                            if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
                            if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
                            return date.toLocaleDateString();
                          };
                          return (
                            <div key={activity.id} className="flex items-center gap-3 pb-4 last:pb-0 border-b last:border-b-0 border-slate-100 dark:border-slate-700">
                              <div className={`w-10 h-10 rounded-full ${style.color} flex items-center justify-center flex-shrink-0`}>
                                <ActivityIcon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                  {activity.studentName}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {activity.title}
                                  {activity.xp > 0 && ` (+${activity.xp} XP)`}
                                </p>
                              </div>
                              <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                {timeAgo(activity.timestamp)}
                              </span>
                            </div>
                          );
                        })
                      ) : (
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

          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Schedule Header Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-4 text-white shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative flex items-center gap-3">
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <span className="text-[10px] uppercase tracking-wider font-semibold opacity-90">
                    {new Date().toLocaleDateString([], { month: 'short' })}
                  </span>
                  <span className="text-xl font-bold leading-none">
                    {new Date().getDate()}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold">Schedule</h2>
                  <p className="text-xs text-white/80">
                    {new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base text-slate-900 dark:text-slate-100">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    Upcoming Classes
                  </span>
                  {upcoming.length > 3 && (
                    <Link href="/dashboard/parent/class-requests" className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-normal">
                      View all ({upcoming.length})
                    </Link>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {upcoming.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming classes</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {upcoming.slice(0, 3).map((cls) => {
                      // Get class type styling
                      const getClassTypeStyle = (type: string) => {
                        switch (type?.toUpperCase()) {
                          case "ONE_ON_ONE":
                            return {
                              icon: User,
                              bg: "bg-purple-50 dark:bg-purple-900/20",
                              iconBg: "bg-purple-100 dark:bg-purple-900/50",
                              iconColor: "text-purple-600 dark:text-purple-400",
                              label: "1-on-1",
                              labelBg: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
                              border: "border-l-purple-500"
                            };
                          case "WORKSHOP":
                            return {
                              icon: Sparkles,
                              bg: "bg-orange-50 dark:bg-orange-900/20",
                              iconBg: "bg-orange-100 dark:bg-orange-900/50",
                              iconColor: "text-orange-600 dark:text-orange-400",
                              label: "Workshop",
                              labelBg: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300",
                              border: "border-l-orange-500"
                            };
                          case "CAMP":
                            return {
                              icon: Tent,
                              bg: "bg-green-50 dark:bg-green-900/20",
                              iconBg: "bg-green-100 dark:bg-green-900/50",
                              iconColor: "text-green-600 dark:text-green-400",
                              label: "Camp",
                              labelBg: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
                              border: "border-l-green-500"
                            };
                          case "GROUP":
                          default:
                            return {
                              icon: Users,
                              bg: "bg-blue-50 dark:bg-blue-900/20",
                              iconBg: "bg-blue-100 dark:bg-blue-900/50",
                              iconColor: "text-blue-600 dark:text-blue-400",
                              label: "Group",
                              labelBg: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
                              border: "border-l-blue-500"
                            };
                        }
                      };
                      const style = getClassTypeStyle(cls.sessionType);
                      const TypeIcon = style.icon;

                      return (
                        <div key={cls.id} className={`flex items-center gap-2 p-2 rounded-lg border-l-4 ${style.border} ${style.bg}`}>
                          <div className={`w-8 h-8 rounded-lg ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
                            <TypeIcon className={`w-4 h-4 ${style.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">{cls.title}</p>
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${style.labelBg} flex-shrink-0`}>
                                {style.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {cls.start.toLocaleDateString([], { month: 'short', day: 'numeric' })} at {cls.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
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
                  { label: "Request 1-on-1 Class", icon: Users, href: "/dashboard/parent/class-requests" },
                  { label: "Browse Courses", icon: BookOpen, href: "/courses" },
                  { label: "View Certificates", icon: Award, href: "/certificates" },
                  { label: "View Progress Reports", icon: TrendingUp, href: "/dashboard/parent/reports" },
                  { label: "Manage Students", icon: Settings, href: "/dashboard/parent/students" },
                  {
                    label: "Contact Instructor",
                    icon: MessageSquare,
                    href: "/messages",
                  },
                ].map((action: any) => (
                  <Link key={action.label} href={action.href}>
                    <Button
                      variant={action.highlight ? "default" : "ghost"}
                      className={action.highlight
                        ? "w-full justify-start font-semibold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-3"
                        : "w-full justify-start font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-3 px-0"
                      }
                    >
                      <action.icon className={`w-4 h-4 flex-shrink-0 ${action.highlight ? "text-white" : "text-slate-700 dark:text-slate-400"}`} />
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
          </>
        )}
      </div>

    </main>
  );
}
