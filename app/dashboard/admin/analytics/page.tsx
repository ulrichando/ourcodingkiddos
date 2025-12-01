"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, Activity, Award, Calendar } from "lucide-react";

type AnalyticsData = {
  overview: {
    totalUsers: number;
    totalStudents: number;
    totalParents: number;
    totalInstructors: number;
    totalCourses: number;
    totalLessons: number;
    totalEnrollments: number;
    activeSubscriptions: number;
    totalRevenue: number;
  };
  activity: {
    newUsers: number;
    newEnrollments: number;
    completedCourses: number;
    activeStudents: number;
  };
  topCourses: Array<{
    id: string;
    title: string;
    enrollments: number;
  }>;
  trends: {
    userGrowth: Array<{ month: string; count: number }>;
    enrollmentTrend: Array<{ month: string; count: number }>;
    revenueTrend: Array<{ month: string; revenue: number }>;
  };
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics");
        if (!res.ok) throw new Error("Failed to load analytics");
        const analytics = await res.json();
        setData(analytics);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Analytics Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Loading analytics...</p>
        </main>
      </AdminLayout>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Analytics Dashboard</h1>
          <p className="text-red-600 dark:text-red-400">Failed to load analytics</p>
        </main>
      </AdminLayout>
    );
  }

  const statCards = [
    { label: "Total Users", value: data.overview.totalUsers, icon: Users, color: "bg-blue-500" },
    { label: "Students", value: data.overview.totalStudents, icon: GraduationCap, color: "bg-purple-500" },
    { label: "Parents", value: data.overview.totalParents, icon: Users, color: "bg-pink-500" },
    { label: "Instructors", value: data.overview.totalInstructors, icon: Award, color: "bg-amber-500" },
    { label: "Total Courses", value: data.overview.totalCourses, icon: BookOpen, color: "bg-emerald-500" },
    { label: "Total Enrollments", value: data.overview.totalEnrollments, icon: TrendingUp, color: "bg-cyan-500" },
    { label: "Active Subscriptions", value: data.overview.activeSubscriptions, icon: Activity, color: "bg-indigo-500" },
    { label: "Total Revenue", value: `$${(data.overview.totalRevenue / 100).toFixed(2)}`, icon: DollarSign, color: "bg-green-500" },
  ];

  const activityCards = [
    { label: "New Users (30d)", value: data.activity.newUsers, icon: Users, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    { label: "New Enrollments (30d)", value: data.activity.newEnrollments, icon: BookOpen, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
    { label: "Completed Courses (30d)", value: data.activity.completedCourses, icon: Award, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
    { label: "Active Students (7d)", value: data.activity.activeStudents, icon: Activity, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
  ];

  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Analytics Dashboard</h1>
        </div>

      {/* Overview Stats */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activityCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`${stat.color} rounded-xl p-6 space-y-3`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{stat.label}</p>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Courses */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Top Courses by Enrollment</h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          {data.topCourses.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">No courses yet</p>
          ) : (
            <div className="space-y-4">
              {data.topCourses.map((course, idx) => (
                <div key={course.id} className="flex items-center justify-between pb-4 border-b last:border-b-0 border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{course.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{course.enrollments} enrollments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-32 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${Math.min(100, (course.enrollments / (data.topCourses[0]?.enrollments || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">User Growth (12 months)</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            {data.trends.userGrowth.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-2">
                {data.trends.userGrowth.slice(-6).map((item) => (
                  <div key={item.month} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${(item.count / Math.max(...data.trends.userGrowth.map(g => g.count))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100 w-12 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enrollment Trend */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Enrollment Trend (12 months)</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            {data.trends.enrollmentTrend.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-2">
                {data.trends.enrollmentTrend.slice(-6).map((item) => (
                  <div key={item.month} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${(item.count / Math.max(...data.trends.enrollmentTrend.map(g => g.count))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100 w-12 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Revenue Trend (12 months)</h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          {data.trends.revenueTrend.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">No revenue data yet</p>
          ) : (
            <div className="space-y-2">
              {data.trends.revenueTrend.slice(-6).map((item) => (
                <div key={item.month} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{item.month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-48 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${(item.revenue / Math.max(...data.trends.revenueTrend.map(g => g.revenue))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100 w-20 text-right">
                      ${(item.revenue / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </main>
    </AdminLayout>
  );
}
