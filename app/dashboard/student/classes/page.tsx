"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  Sparkles,
  Loader2,
  Search,
  Grid,
  List,
  ChevronRight,
  Rocket,
  Users,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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
};

export default function StudentClassesPage() {
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
      const res = await fetch("/api/student/classes");
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
      cls.language.toLowerCase().includes(query)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-900">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">My Schedule</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Classes
              </h1>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 ml-15">
            Your upcoming coding adventures!
          </p>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search your classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-800 text-sm focus:border-purple-400 dark:focus:border-purple-600 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-xl transition-all ${
                viewMode === "grid"
                  ? "bg-purple-500 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-purple-200 dark:border-purple-900"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-xl transition-all ${
                viewMode === "list"
                  ? "bg-purple-500 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-purple-200 dark:border-purple-900"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Loading your classes...
              </p>
            </div>
          </div>
        ) : upcomingClasses.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-purple-200 dark:border-purple-900 p-12 text-center">
            <Calendar className="w-16 h-16 text-purple-300 dark:text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
              No Classes Scheduled
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {searchQuery
                ? "Try changing your search query!"
                : "You don't have any upcoming classes yet. Check back soon!"}
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-5"
                : "space-y-4"
            }
          >
            {upcomingClasses.map((cls) => (
              <div
                key={cls.id}
                className={`bg-white dark:bg-slate-800 rounded-3xl border-2 border-purple-200 dark:border-purple-900 p-6 hover:shadow-2xl hover:border-purple-400 dark:hover:border-purple-600 hover:-translate-y-1 transition-all duration-300 ${
                  viewMode === "list" ? "flex gap-4 items-start" : ""
                }`}
              >
                <div className={viewMode === "list" ? "flex-shrink-0" : ""}>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    {cls.meetingUrl ? (
                      <Video className="w-7 h-7 text-white" />
                    ) : (
                      <Calendar className="w-7 h-7 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                      {cls.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getLanguageColor(
                        cls.language
                      )}`}
                    >
                      {cls.language}
                    </span>
                  </div>

                  {cls.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                      {cls.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{formatDate(cls.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span>{cls.durationMinutes} minutes</span>
                    </div>
                    {cls.maxStudents && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Users className="w-4 h-4 text-green-500" />
                        <span>
                          {cls.enrolledCount}/{cls.maxStudents} students
                        </span>
                      </div>
                    )}
                  </div>

                  {cls.meetingUrl && (
                    <a
                      href={cls.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
                    >
                      <Video className="w-4 h-4" />
                      Join Class
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
