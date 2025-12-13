"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, Star, ChevronRight, Loader2, Search, Sparkles, Award, Zap } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string;
  language: string;
  ageGroup: string | null;
  totalXp: number | null;
  estimatedHours: number | null;
  lessonCount?: number;
};

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
        }
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case "BEGINNER":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "INTERMEDIATE":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "ADVANCED":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
    }
  };

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

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === "all" || course.level.toLowerCase() === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header with fun gradient */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border-2 border-purple-200 dark:border-purple-900">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Learn & Explore</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Courses
              </h1>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 ml-15">Discover awesome coding adventures!</p>
        </div>

        {/* Filters with colorful design */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search for cool courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-800 text-sm focus:border-purple-400 dark:focus:border-purple-600 focus:outline-none transition-colors"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-3 rounded-2xl border-2 border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-800 text-sm focus:border-purple-400 dark:focus:border-purple-600 focus:outline-none transition-colors font-medium"
          >
            <option value="all">🎯 All Levels</option>
            <option value="beginner">🌟 Beginner</option>
            <option value="intermediate">⚡ Intermediate</option>
            <option value="advanced">🚀 Advanced</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">Loading awesome courses...</p>
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-purple-200 dark:border-purple-900 p-12 text-center">
            <BookOpen className="w-16 h-16 text-purple-300 dark:text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No Courses Found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try changing your search or filters!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-purple-200 dark:border-purple-900 p-6 hover:shadow-2xl hover:border-purple-400 dark:hover:border-purple-600 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getLanguageColor(course.language)}`}>
                      {course.language}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                  {course.description || "Learn coding through fun interactive lessons!"}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-full font-semibold ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                  {course.estimatedHours && (
                    <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {course.estimatedHours}h
                    </span>
                  )}
                  {course.totalXp && (
                    <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full font-medium">
                      <Zap className="w-3.5 h-3.5" />
                      {course.totalXp} XP
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-xl group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                  Start Learning
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
