"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../../../../components/admin/AdminLayout";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  TrendingDown,
  BookX,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Mail,
  User,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';



type AtRiskStudent = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  riskType: "inactive" | "low_score" | "incomplete" | "no_progress";
  riskDetails: string;
  lastActive?: string;
  daysInactive?: number;
  averageScore?: number;
  completionRate?: number;
};

export default function AtRiskStudentsPage() {
  const [students, setStudents] = useState<AtRiskStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    fetchAtRiskStudents();
  }, []);

  const fetchAtRiskStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/students/at-risk");
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error("Failed to fetch at-risk students:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskIcon = (riskType: AtRiskStudent["riskType"]) => {
    switch (riskType) {
      case "inactive":
        return <Clock className="w-4 h-4" />;
      case "low_score":
        return <TrendingDown className="w-4 h-4" />;
      case "incomplete":
        return <BookX className="w-4 h-4" />;
      case "no_progress":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getRiskColor = (riskType: AtRiskStudent["riskType"]) => {
    switch (riskType) {
      case "inactive":
        return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20";
      case "low_score":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "incomplete":
        return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
      case "no_progress":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20";
      default:
        return "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20";
    }
  };

  const getRiskLabel = (riskType: AtRiskStudent["riskType"]) => {
    switch (riskType) {
      case "inactive":
        return "Inactive";
      case "low_score":
        return "Low Score";
      case "incomplete":
        return "Incomplete";
      case "no_progress":
        return "No Progress";
      default:
        return "At Risk";
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || student.riskType === filterType;
    return matchesSearch && matchesFilter;
  });

  const riskTypeCounts = {
    all: students.length,
    inactive: students.filter((s) => s.riskType === "inactive").length,
    low_score: students.filter((s) => s.riskType === "low_score").length,
    incomplete: students.filter((s) => s.riskType === "incomplete").length,
    no_progress: students.filter((s) => s.riskType === "no_progress").length,
  };

  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/admin"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Students</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              At-Risk Students
              {students.length > 0 && (
                <span className="px-3 py-1 text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                  {students.length}
                </span>
              )}
            </h1>
          </div>
          <button
            onClick={fetchAtRiskStudents}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Risk Type Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Students" },
            { id: "inactive", label: "Inactive" },
            { id: "low_score", label: "Low Score" },
            { id: "incomplete", label: "Incomplete" },
            { id: "no_progress", label: "No Progress" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filterType === tab.id
                  ? "bg-purple-600 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/20">
                {riskTypeCounts[tab.id as keyof typeof riskTypeCounts]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Students List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {searchQuery || filterType !== "all"
                ? "No matching students found"
                : "No at-risk students detected"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {searchQuery || filterType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "All students are progressing well!"}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Student
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Risk Type
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Details
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Last Active
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {student.avatar ? (
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {student.name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(
                            student.riskType
                          )}`}
                        >
                          {getRiskIcon(student.riskType)}
                          {getRiskLabel(student.riskType)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {student.riskDetails}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {student.lastActive
                            ? new Date(student.lastActive).toLocaleDateString()
                            : "Never"}
                        </p>
                        {student.daysInactive && student.daysInactive > 0 && (
                          <p className="text-xs text-red-500 dark:text-red-400">
                            {student.daysInactive} days ago
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/admin/students/${student.id}`}
                            className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <User className="w-4 h-4" />
                          </Link>
                          <button
                            className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/dashboard/admin/students/${student.id}`}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </AdminLayout>
  );
}
