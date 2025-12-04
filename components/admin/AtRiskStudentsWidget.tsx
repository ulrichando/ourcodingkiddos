"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  TrendingDown,
  BookX,
  RefreshCw,
  ChevronRight,
  User,
} from "lucide-react";

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

type AtRiskStudentsWidgetProps = {
  students?: AtRiskStudent[];
  loading?: boolean;
  onRefresh?: () => void;
};

export default function AtRiskStudentsWidget({
  students: propStudents,
  loading: propLoading,
  onRefresh,
}: AtRiskStudentsWidgetProps) {
  const [students, setStudents] = useState<AtRiskStudent[]>(propStudents || []);
  const [loading, setLoading] = useState(propLoading ?? true);

  useEffect(() => {
    if (!propStudents) {
      fetchAtRiskStudents();
    }
  }, [propStudents]);

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

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          At-Risk Students
          {students.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
              {students.length}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh || fetchAtRiskStudents}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/dashboard/admin/students/at-risk"
            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No at-risk students detected
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            All students are on track!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {students.slice(0, 5).map((student) => (
            <Link
              key={student.id}
              href={`/dashboard/admin/students/${student.id}`}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
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
                  <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                    {student.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {student.riskDetails}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                  student.riskType
                )}`}
              >
                {getRiskIcon(student.riskType)}
                {getRiskLabel(student.riskType)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
