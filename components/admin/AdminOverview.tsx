"use client";

import { Users, GraduationCap, UserCircle, Award, BookOpen, CreditCard, TrendingUp, Activity, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

type AdminOverviewProps = {
  stats: {
    totalParents: number;
    totalStudents: number;
    instructors: number;
    activeSubs: number;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    type: string;
    joined: string;
  }>;
  totalUsers: number;
  totalCourses: number;
  warning: string | null;
};

export default function AdminOverview({ stats, recentUsers, totalUsers, totalCourses, warning }: AdminOverviewProps) {
  // Calculate growth percentage (mock for now - can be real data later)
  const growthMetrics = {
    users: 0,
    students: 0,
    revenue: 0,
    courses: 0,
  };

  const statCards = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      growth: growthMetrics.users,
      link: "/dashboard/admin/users",
    },
    {
      label: "Students",
      value: stats.totalStudents,
      icon: GraduationCap,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      growth: growthMetrics.students,
      link: "/dashboard/admin/users",
    },
    {
      label: "Parents",
      value: stats.totalParents,
      icon: UserCircle,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      iconColor: "text-pink-600 dark:text-pink-400",
      growth: 6,
      link: "/dashboard/admin/users",
    },
    {
      label: "Instructors",
      value: stats.instructors,
      icon: Award,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      growth: 3,
      link: "/dashboard/admin/instructors",
    },
    {
      label: "Active Courses",
      value: totalCourses,
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      growth: growthMetrics.courses,
      link: "/dashboard/admin/courses",
    },
    {
      label: "Active Subscriptions",
      value: stats.activeSubs,
      icon: CreditCard,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      growth: growthMetrics.revenue,
      link: "/dashboard/admin/finance",
    },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage all platform users",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      link: "/dashboard/admin/users",
    },
    {
      title: "Course Management",
      description: "Create and edit courses",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      link: "/dashboard/admin/courses",
    },
    {
      title: "View Analytics",
      description: "Detailed platform analytics",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
      link: "/dashboard/admin/analytics",
    },
    {
      title: "System Settings",
      description: "Configure platform settings",
      icon: Activity,
      color: "from-amber-500 to-orange-500",
      link: "/dashboard/admin/settings",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Admin Dashboard</p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Overview</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Warning Banner */}
      {warning && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">{warning}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.link}
              className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  +{stat.growth}%
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.link}
                className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className={`bg-gradient-to-br ${action.color} p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-500" />
              Recent Users
            </h2>
            <Link
              href="/dashboard/admin/users"
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-3 border-b last:border-b-0 border-slate-100 dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 capitalize">
                    {user.type}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.joined}</p>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">No recent users</p>
            )}
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-500" />
            Platform Health
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">System Status</span>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  Operational
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{ width: "98%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">User Engagement</span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">85%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: "85%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Course Completion</span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">72%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: "72%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Revenue Growth</span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">+15%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full" style={{ width: "90%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
