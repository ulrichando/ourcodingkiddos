"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  User,
  Sparkles,
  Tent,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

interface ClassSession {
  id: string;
  programId?: string;
  programSlug?: string;
  title: string;
  description?: string;
  language?: string;
  ageGroup?: string;
  sessionType: string;
  startTime: string;
  durationMinutes: number;
  maxStudents?: number;
  enrolledCount?: number;
  thumbnailUrl?: string;
}

const ITEMS_PER_PAGE = 4;

const languageLabels: Record<string, string> = {
  HTML: "HTML & CSS",
  CSS: "CSS",
  JAVASCRIPT: "JavaScript",
  PYTHON: "Python",
  ROBLOX: "Roblox Studio",
  AI_ML: "AI & Machine Learning",
  GAME_DEVELOPMENT: "Game Development",
  WEB_DEVELOPMENT: "Web Development",
  MOBILE_DEVELOPMENT: "Mobile Apps",
  ROBOTICS: "Robotics",
  ENGINEERING: "Engineering",
  CAREER_PREP: "Career Prep",
};

export default function UpcomingClassesSection() {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/classes", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setClasses(data.sessions ?? []);
      } catch {
        setClasses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);

  const totalPages = Math.ceil(classes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleClasses = classes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getSessionStyle = (sessionType: string) => {
    switch (sessionType?.toUpperCase()) {
      case "ONE_ON_ONE":
        return {
          icon: User,
          gradient: "from-purple-500 to-violet-600",
          bg: "bg-purple-50 dark:bg-purple-900/20",
          text: "text-purple-600 dark:text-purple-400",
          label: "1-on-1",
        };
      case "WORKSHOP":
        return {
          icon: Sparkles,
          gradient: "from-orange-500 to-amber-600",
          bg: "bg-orange-50 dark:bg-orange-900/20",
          text: "text-orange-600 dark:text-orange-400",
          label: "Workshop",
        };
      case "CAMP":
        return {
          icon: Tent,
          gradient: "from-emerald-500 to-green-600",
          bg: "bg-emerald-50 dark:bg-emerald-900/20",
          text: "text-emerald-600 dark:text-emerald-400",
          label: "Camp",
        };
      default:
        return {
          icon: Users,
          gradient: "from-blue-500 to-cyan-600",
          bg: "bg-blue-50 dark:bg-blue-900/20",
          text: "text-blue-600 dark:text-blue-400",
          label: "Group",
        };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getAgeGroupLabel = (ageGroup?: string) => {
    switch (ageGroup) {
      case "AGES_7_10":
        return "Ages 7-10";
      case "AGES_11_14":
        return "Ages 11-14";
      case "AGES_15_18":
        return "Ages 15-18";
      case "AGES_18_PLUS":
        return "Ages 18+";
      default:
        return "All Ages";
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              Live Classes
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Upcoming Classes
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Loading schedule...
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6 animate-pulse"
              >
                <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4" />
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (classes.length === 0) {
    return (
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              Live Classes
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Upcoming Classes
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Classes held every Saturday &amp; Sunday, 9am-10am. Browse our programs to enroll!
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-full"
            >
              View Programs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-6xl lg:max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            Live Classes
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Weekend Classes
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Join live sessions every Saturday &amp; Sunday, 9am-10am EST
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {visibleClasses.map((cls) => {
            const style = getSessionStyle(cls.sessionType);
            const Icon = style.icon;

            return (
              <div
                key={cls.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-slate-100 dark:border-slate-700 overflow-hidden group"
              >
                <div className={`h-1.5 bg-gradient-to-r ${style.gradient}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}
                    >
                      {style.label}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
                    {cls.title}
                  </h3>

                  {cls.language && (
                    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mb-3">
                      {languageLabels[cls.language] || cls.language}
                    </span>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{formatDate(cls.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {formatTime(cls.startTime)} ({cls.durationMinutes} min)
                      </span>
                    </div>
                    {cls.ageGroup && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>{getAgeGroupLabel(cls.ageGroup)}</span>
                      </div>
                    )}
                  </div>

                  {cls.maxStudents && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span>Spots filled</span>
                        <span>
                          {cls.enrolledCount || 0}/{cls.maxStudents}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${style.gradient} rounded-full transition-all`}
                          style={{
                            width: `${Math.min(
                              ((cls.enrolledCount || 0) / cls.maxStudents) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <Link
                    href={cls.programSlug ? `/programs/${cls.programSlug}` : "/programs"}
                    className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    View Program
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${
                  page === currentPage
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:underline"
          >
            View All Programs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
