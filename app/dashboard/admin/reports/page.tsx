"use client";

import { useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import {
  Download,
  FileText,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  DollarSign,
  Calendar,
  Filter,
} from "lucide-react";

type DateRange = "7d" | "30d" | "90d" | "1y" | "all";

type ReportCategory = {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: any;
  color: string;
};

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const dateRangeLabels: Record<DateRange, string> = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    "1y": "Last Year",
    all: "All Time",
  };

  const categories: ReportCategory[] = [
    {
      title: "Total Users",
      value: "0",
      change: "--",
      trend: "neutral",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Active Students",
      value: "0",
      change: "--",
      trend: "neutral",
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Course Enrollments",
      value: "0",
      change: "--",
      trend: "neutral",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Completion Rate",
      value: "0%",
      change: "--",
      trend: "neutral",
      icon: TrendingUp,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Total Revenue",
      value: "$0",
      change: "--",
      trend: "neutral",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Avg Session Time",
      value: "0 min",
      change: "--",
      trend: "neutral",
      icon: Calendar,
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "Badges Awarded",
      value: "0",
      change: "--",
      trend: "neutral",
      icon: Award,
      color: "from-rose-500 to-pink-500",
    },
    {
      title: "XP Earned",
      value: "0",
      change: "--",
      trend: "neutral",
      icon: TrendingUp,
      color: "from-violet-500 to-purple-500",
    },
  ];

  const detailedReports = [
    {
      category: "User Engagement",
      metrics: [
        { label: "Daily Active Users", value: "0", change: "--" },
        { label: "Weekly Active Users", value: "0", change: "--" },
        { label: "Monthly Active Users", value: "0", change: "--" },
        { label: "Average Session Duration", value: "0 min", change: "--" },
        { label: "Sessions per User", value: "0", change: "--" },
      ],
    },
    {
      category: "Course Performance",
      metrics: [
        { label: "Total Courses", value: "6", change: "--" },
        { label: "Published Courses", value: "6", change: "--" },
        { label: "Avg Completion Rate", value: "0%", change: "--" },
        { label: "Avg Course Rating", value: "--", change: "--" },
        { label: "Total Lessons", value: "18", change: "--" },
      ],
    },
    {
      category: "Revenue Analytics",
      metrics: [
        { label: "Monthly Revenue", value: "$0", change: "--" },
        { label: "Quarterly Revenue", value: "$0", change: "--" },
        { label: "Avg Revenue per User", value: "$0", change: "--" },
        { label: "Subscription Rate", value: "0%", change: "--" },
        { label: "Churn Rate", value: "0%", change: "--" },
      ],
    },
    {
      category: "Learning Outcomes",
      metrics: [
        { label: "Lessons Completed", value: "0", change: "--" },
        { label: "Avg Quiz Score", value: "--", change: "--" },
        { label: "Projects Submitted", value: "0", change: "--" },
        { label: "Certificates Issued", value: "0", change: "--" },
        { label: "Skills Mastered", value: "0", change: "--" },
      ],
    },
  ];

  const handleExportCSV = () => {
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
    // Placeholder for PDF export functionality
    alert(
      "PDF export would be implemented with a library like jsPDF or react-pdf. For now, use CSV export or print this page."
    );
  };

  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
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
              Note: All percentage changes are compared to the previous period. Export
              functionality allows you to download this data in CSV format or print as PDF.
            </p>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
