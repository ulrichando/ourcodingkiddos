"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import {  Download,
  FileText,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  DollarSign,
  Calendar,
  Filter,
  Loader2,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




type DateRange = "7d" | "30d" | "90d" | "1y" | "all";

type AnalyticsData = {
  overview: {
    totalUsers: number;
    totalStudents: number;
    totalParents: number;
    totalInstructors: number;
    totalCourses: number;
    totalLessons: number;
    totalEnrollments: number;
    totalPrograms: number;
    totalRevenue: number;
    totalBadgesAwarded: number;
    totalXpEarned: number;
    completedLessons: number;
    completionRate: number;
    avgQuizScore: number;
    totalCertificates: number;
  };
  activity: {
    newUsers: number;
    newEnrollments: number;
    completedCourses: number;
    activeStudents: number;
  };
  topCourses: Array<{ id: string; title: string; enrollments: number }>;
  trends: {
    userGrowth: Array<{ month: string; count: number }>;
    enrollmentTrend: Array<{ month: string; count: number }>;
    revenueTrend: Array<{ month: string; revenue: number }>;
  };
};

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const dateRangeLabels: Record<DateRange, string> = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    "1y": "Last Year",
    all: "All Time",
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/analytics", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const categories = analytics
    ? [
        {
          title: "Total Users",
          value: formatNumber(analytics.overview.totalUsers),
          change: `+${analytics.activity.newUsers} new`,
          trend: analytics.activity.newUsers > 0 ? "up" : "neutral",
          icon: Users,
          color: "from-blue-500 to-cyan-500",
        },
        {
          title: "Active Students",
          value: formatNumber(analytics.activity.activeStudents),
          change: `${analytics.overview.totalStudents} total`,
          trend: analytics.activity.activeStudents > 0 ? "up" : "neutral",
          icon: Users,
          color: "from-purple-500 to-pink-500",
        },
        {
          title: "Course Enrollments",
          value: formatNumber(analytics.overview.totalEnrollments),
          change: `+${analytics.activity.newEnrollments} recent`,
          trend: analytics.activity.newEnrollments > 0 ? "up" : "neutral",
          icon: BookOpen,
          color: "from-emerald-500 to-teal-500",
        },
        {
          title: "Completion Rate",
          value: `${analytics.overview.completionRate}%`,
          change: `${analytics.overview.completedLessons} lessons`,
          trend: analytics.overview.completionRate > 50 ? "up" : analytics.overview.completionRate > 0 ? "neutral" : "down",
          icon: TrendingUp,
          color: "from-amber-500 to-orange-500",
        },
        {
          title: "Total Revenue",
          value: formatCurrency(analytics.overview.totalRevenue),
          change: `${analytics.overview.totalPrograms} programs`,
          trend: analytics.overview.totalRevenue > 0 ? "up" : "neutral",
          icon: DollarSign,
          color: "from-green-500 to-emerald-500",
        },
        {
          title: "Avg Quiz Score",
          value: analytics.overview.avgQuizScore > 0 ? `${Math.round(analytics.overview.avgQuizScore)}%` : "N/A",
          change: `${analytics.overview.totalCertificates} certs issued`,
          trend: analytics.overview.avgQuizScore >= 70 ? "up" : analytics.overview.avgQuizScore > 0 ? "neutral" : "neutral",
          icon: Calendar,
          color: "from-indigo-500 to-purple-500",
        },
        {
          title: "Badges Awarded",
          value: formatNumber(analytics.overview.totalBadgesAwarded),
          change: "total awards",
          trend: analytics.overview.totalBadgesAwarded > 0 ? "up" : "neutral",
          icon: Award,
          color: "from-rose-500 to-pink-500",
        },
        {
          title: "XP Earned",
          value: formatNumber(analytics.overview.totalXpEarned),
          change: "across all students",
          trend: analytics.overview.totalXpEarned > 0 ? "up" : "neutral",
          icon: TrendingUp,
          color: "from-violet-500 to-purple-500",
        },
      ]
    : [];

  const detailedReports = analytics
    ? [
        {
          category: "User Engagement",
          metrics: [
            { label: "Total Users", value: formatNumber(analytics.overview.totalUsers), change: `+${analytics.activity.newUsers}` },
            { label: "Active Students (7d)", value: formatNumber(analytics.activity.activeStudents), change: "--" },
            { label: "Total Students", value: formatNumber(analytics.overview.totalStudents), change: "--" },
            { label: "Total Parents", value: formatNumber(analytics.overview.totalParents), change: "--" },
            { label: "Total Instructors", value: formatNumber(analytics.overview.totalInstructors), change: "--" },
          ],
        },
        {
          category: "Course Performance",
          metrics: [
            { label: "Total Courses", value: formatNumber(analytics.overview.totalCourses), change: "--" },
            { label: "Total Lessons", value: formatNumber(analytics.overview.totalLessons), change: "--" },
            { label: "Total Enrollments", value: formatNumber(analytics.overview.totalEnrollments), change: `+${analytics.activity.newEnrollments}` },
            { label: "Completed Courses", value: formatNumber(analytics.activity.completedCourses), change: "--" },
            { label: "Completion Rate", value: `${analytics.overview.completionRate}%`, change: "--" },
          ],
        },
        {
          category: "Revenue Analytics",
          metrics: [
            { label: "Total Revenue", value: formatCurrency(analytics.overview.totalRevenue), change: "--" },
            { label: "Total Programs", value: formatNumber(analytics.overview.totalPrograms), change: "--" },
            { label: "Certificates Issued", value: formatNumber(analytics.overview.totalCertificates), change: "--" },
            { label: "Avg Quiz Score", value: analytics.overview.avgQuizScore > 0 ? `${Math.round(analytics.overview.avgQuizScore)}%` : "N/A", change: "--" },
          ],
        },
        {
          category: "Learning Outcomes",
          metrics: [
            { label: "Lessons Completed", value: formatNumber(analytics.overview.completedLessons), change: "--" },
            { label: "Badges Awarded", value: formatNumber(analytics.overview.totalBadgesAwarded), change: "--" },
            { label: "Total XP Earned", value: formatNumber(analytics.overview.totalXpEarned), change: "--" },
            { label: "Certificates", value: formatNumber(analytics.overview.totalCertificates), change: "--" },
            { label: "Top Course", value: analytics.topCourses[0]?.title || "N/A", change: analytics.topCourses[0] ? `${analytics.topCourses[0].enrollments} enrolled` : "--" },
          ],
        },
      ]
    : [];

  const handleExportCSV = () => {
    if (!analytics) return;

    const csvData = [
      ["Category", "Metric", "Value", "Change"],
      ...detailedReports.flatMap((report) =>
        report.metrics.map((metric) => [
          report.category,
          metric.label,
          metric.value,
          metric.change,
        ])
      ),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-report-${dateRange}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    alert(
      "PDF export would be implemented with a library like jsPDF or react-pdf. For now, use CSV export or print this page."
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500 mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Reports</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Analytics & Reports
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              View detailed reports and export data for analysis
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg text-white rounded-lg transition-shadow"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Date Range:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["7d", "30d", "90d", "1y", "all"] as DateRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    dateRange === range
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {dateRangeLabels[range]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${category.color} bg-opacity-10`}
                  >
                    <Icon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      category.trend === "up"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : category.trend === "down"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {category.change}
                  </span>
                </div>
                <h3 className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  {category.title}
                </h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {category.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Top Courses */}
        {analytics && analytics.topCourses.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              Top Courses by Enrollment
            </h2>
            <div className="space-y-3">
              {analytics.topCourses.map((course, idx) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {course.title}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    {course.enrollments} enrollments
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {detailedReports.map((report) => (
            <div
              key={report.category}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-500" />
                {report.category}
              </h2>
              <div className="space-y-3">
                {report.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {metric.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {metric.value}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          metric.change.startsWith("+")
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : metric.change.startsWith("-")
                            ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {metric.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Report Info */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Report Information
          </h3>
          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <p>
              <strong>Period:</strong> {dateRangeLabels[dateRange]}
            </p>
            <p>
              <strong>Generated:</strong> {new Date().toLocaleString()}
            </p>
            <p>
              <strong>Data Sources:</strong> User Database, Course Analytics, Payment Records
            </p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
              Note: All data is pulled in real-time from your database. Export
              functionality allows you to download this data in CSV format.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
