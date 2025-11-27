"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Calendar, BookOpen, Award, ChevronRight, Clock, Star, TrendingUp, MessageSquare, Users } from "lucide-react";
import StudentCard from "../../../components/dashboard/StudentCard";
import Button from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { useSession } from "next-auth/react";

const demoUpcoming = [] as Array<{ title: string; start: string }>;

export default function ParentDashboardPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;
    setLoadingStudents(true);
    fetch("/api/students", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setStudents(data.students || []))
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false));
  }, [session?.user?.email]);

  const totalXP = useMemo(() => students.reduce((sum, s) => sum + (s.totalXp || s.total_xp || 0), 0), [students]);
  const totalBadges = 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Ando! 👋</h1>
          <p className="text-slate-600">Here&apos;s what&apos;s happening with your young coders today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Students", value: students.length, icon: Users, color: "text-purple-600 bg-purple-100" },
            { label: "Total XP", value: totalXP.toLocaleString(), icon: Star, color: "text-amber-600 bg-amber-100" },
            { label: "Badges Earned", value: totalBadges, icon: Award, color: "text-green-600 bg-green-100" },
            { label: "Upcoming Classes", value: demoUpcoming.length, icon: Calendar, color: "text-blue-600 bg-blue-100" },
            { label: "Free Trial", value: "7 days left", icon: TrendingUp, color: "text-pink-600 bg-pink-100" },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Students Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Your Students</h2>
              <Link href="/dashboard/parent/add-student">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </Link>
            </div>

            {loadingStudents ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center text-slate-500">Loading students...</CardContent>
              </Card>
            ) : students.length === 0 ? (
              <Card className="border-2 border-dashed border-slate-200">
                <CardContent className="p-12 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-3xl">👤</div>
                  <h3 className="text-lg font-semibold text-slate-800">Add Your First Student</h3>
                  <p className="text-slate-500">Get started by adding your child&apos;s profile.</p>
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

            {/* Explore Courses */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Explore Courses</h2>
                <Link href="/courses">
                  <Button variant="ghost">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: "HTML Basics", level: "Beginner", color: "bg-orange-100 text-orange-600" },
                  { name: "Python for Kids", level: "Beginner", color: "bg-green-100 text-green-600" },
                ].map((course) => (
                  <Card key={course.name} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${course.color}`}>
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{course.name}</h3>
                        <p className="text-sm text-slate-500">{course.level}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Upcoming Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {demoUpcoming.length === 0 ? (
                  <div className="text-center py-6 space-y-2">
                    <p className="text-slate-500">No upcoming classes</p>
                    <Link href="/schedule">
                      <Button variant="outline" size="sm">
                        Book a Class
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {demoUpcoming.map((cls) => (
                      <div key={cls.title} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{cls.title}</p>
                          <p className="text-xs text-slate-500">{cls.start}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Book a Class", icon: Calendar, href: "/schedule" },
                  { label: "Browse Courses", icon: BookOpen, href: "/courses" },
                  { label: "View Progress Reports", icon: TrendingUp, href: "/dashboard/parent" },
                  { label: "Contact Instructor", icon: MessageSquare, href: "/dashboard/parent" },
                ].map((action) => (
                  <Link key={action.label} href={action.href}>
                    <Button variant="ghost" className="w-full justify-start">
                      <action.icon className="w-4 h-4 mr-3" />
                      {action.label}
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white overflow-hidden">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/80">Free Trial</p>
                    <p className="text-sm font-semibold">7 days remaining</p>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-white rounded-full" />
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
          </div>
        </div>
      </div>

    </main>
  );
}
