"use client";

import { Users, GraduationCap, UserCircle, Award, BookOpen, CreditCard, TrendingUp, Activity, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import QuickActionsWidget from "./QuickActionsWidget";
import AtRiskStudentsWidget from "./AtRiskStudentsWidget";

type AdminOverviewProps = {
  stats: {
    totalParents: number;
    totalStudents: number;
    instructors: number;
    programs?: number;
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
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderHover: "hover:border-blue-300 dark:hover:border-blue-500/40",
      growth: growthMetrics.users,
      link: "/dashboard/admin/users",
    },
    {
      label: "Students",
      value: stats.totalStudents,
      icon: GraduationCap,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
      borderHover: "hover:border-purple-300 dark:hover:border-purple-500/40",
      growth: growthMetrics.students,
      link: "/dashboard/admin/users",
    },
    {
      label: "Parents",
      value: stats.totalParents,
      icon: UserCircle,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50 dark:bg-pink-500/10",
      iconColor: "text-pink-600 dark:text-pink-400",
      borderHover: "hover:border-pink-300 dark:hover:border-pink-500/40",
      growth: 6,
      link: "/dashboard/admin/users",
    },
    {
      label: "Instructors",
      value: stats.instructors,
      icon: Award,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
      borderHover: "hover:border-amber-300 dark:hover:border-amber-500/40",
      growth: 3,
      link: "/dashboard/admin/instructors",
    },
    {
      label: "Active Courses",
      value: totalCourses,
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      borderHover: "hover:border-emerald-300 dark:hover:border-emerald-500/40",
      growth: growthMetrics.courses,
      link: "/dashboard/admin/courses",
    },
    {
      label: "Programs",
      value: stats.programs || 0,
      icon: CreditCard,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-500/10",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      borderHover: "hover:border-indigo-300 dark:hover:border-indigo-500/40",
      growth: 0,
      link: "/dashboard/admin/programs",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Warning Banner */}
      {warning && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <p className="text-sm text-amber-800 dark:text-amber-200">{warning}</p>
        </div>
      )}

      {/* Stats Grid - Vercel-inspired cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.link}
              className={`group relative bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700/50 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 ${stat.borderHover}`}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.08] transition-opacity pointer-events-none from-slate-900 to-slate-600" />

              <div className="flex items-start justify-between">
                <div className={`${stat.bgColor} p-2.5 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors" />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {stat.value.toLocaleString()}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                  {stat.growth > 0 && (
                    <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="w-3 h-3" />
                      {stat.growth}%
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Widget */}
      <QuickActionsWidget />

      {/* At-Risk Students Alert */}
      <AtRiskStudentsWidget />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Users */}
        <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Recent Users
            </h2>
            <Link
              href="/dashboard/admin/users"
              className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-1">
            {recentUsers.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2.5 -mx-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium shadow-sm">
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
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize">
                    {user.type}
                  </span>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{user.joined}</p>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <p className="text-center text-slate-400 dark:text-slate-500 py-8 text-sm">No recent users</p>
            )}
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700/50 p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            Platform Health
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">System Status</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Operational
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500" style={{ width: "98%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">User Engagement</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">85%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500" style={{ width: "85%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Course Completion</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">72%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: "72%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Revenue Growth</span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">+15%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500" style={{ width: "90%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
