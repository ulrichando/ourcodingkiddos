"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ParentLayout from "@/components/parent/ParentLayout";
import {
  Calendar,
  Clock,
  Video,
  Loader2,
  Search,
  Grid,
  List,
  Users,
  User,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

type EnrolledStudent = {
  id: string;
  name: string;
  avatar: string | null;
};

type ClassSession = {
  id: string;
  title: string;
  description?: string;
  language: string;
  ageGroup: string;
  sessionType: string;
  startTime: string;
  durationMinutes: number;
  maxStudents: number | null;
  enrolledCount: number;
  meetingUrl?: string;
  instructorEmail: string;
  enrolledStudents: EnrolledStudent[];
};

export default function ParentClassesPage() {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  useEffect(() => {
    fetchClasses();
  }, []);

  async function fetchClasses() {
    setLoading(true);
    try {
      const res = await fetch("/api/parent/classes");
      if (res.ok) {
        const data = await res.json();
        setClasses(data.sessions || []);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredClasses = classes.filter((cls) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      cls.title.toLowerCase().includes(query) ||
      cls.description?.toLowerCase().includes(query) ||
      cls.language.toLowerCase().includes(query) ||
      cls.enrolledStudents.some((s) => s.name.toLowerCase().includes(query))
    );
  });

  const getLanguageColor = (language: string) => {
    switch (language.toLowerCase()) {
      case "python":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "javascript":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "html":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "css":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) {
      return `Today at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    } else if (isTomorrow) {
      return `Tomorrow at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    }
  };

  const upcomingClasses = filteredClasses.filter(
    (cls) => new Date(cls.startTime) > new Date()
  );

  return (
    <ParentLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Home / Classes</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            My Children's Classes
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            View and manage your children's upcoming classes
          </p>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search classes or students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-violet-500 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-violet-500 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : upcomingClasses.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No Classes Scheduled
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {searchQuery
                ? "Try changing your search query."
                : "Your children don't have any upcoming classes yet."}
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
            }
          >
            {upcomingClasses.map((cls) => (
              <div
                key={cls.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-600 transition-all ${
                  viewMode === "list" ? "flex gap-4 items-start" : ""
                }`}
              >
                <div className={viewMode === "list" ? "flex-shrink-0" : ""}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-3">
                    {cls.meetingUrl ? (
                      <Video className="w-6 h-6 text-white" />
                    ) : (
                      <Calendar className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {cls.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(
                        cls.language
                      )}`}
                    >
                      {cls.language}
                    </span>
                  </div>

                  {cls.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                      {cls.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-violet-500" />
                      <span>{formatDate(cls.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-violet-500" />
                      <span>{cls.durationMinutes} minutes</span>
                    </div>
                    {cls.maxStudents && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Users className="w-3.5 h-3.5 text-violet-500" />
                        <span>
                          {cls.enrolledCount}/{cls.maxStudents} students
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Enrolled Students */}
                  {cls.enrolledStudents.length > 0 && (
                    <div className="mb-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                        Your enrolled children:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cls.enrolledStudents.map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center gap-1.5 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 px-2.5 py-1 rounded-full text-xs font-medium"
                          >
                            {student.avatar ? (
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-4 h-4 rounded-full"
                              />
                            ) : (
                              <User className="w-3 h-3" />
                            )}
                            {student.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {cls.meetingUrl && (
                    <a
                      href={cls.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-sm font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-3 py-2 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                    >
                      View Meeting Link
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
