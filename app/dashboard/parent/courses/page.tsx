"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ParentLayout from "@/components/parent/ParentLayout";
import { BookOpen, Clock, Star, ChevronRight, Loader2, Search } from "lucide-react";

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

export default function ParentCoursesPage() {
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
    <ParentLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Home / Courses</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Courses</h1>
          <p className="text-slate-600 dark:text-slate-400">Browse coding courses for your child</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No Courses Found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-600 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(course.language)}`}>
                      {course.language}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                  {course.description || "Learn coding through interactive lessons."}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                  <span className={`px-2 py-0.5 rounded-full ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                  {course.estimatedHours && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.estimatedHours}h
                    </span>
                  )}
                  {course.totalXp && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" />
                      {course.totalXp} XP
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm font-medium text-violet-600 dark:text-violet-400">
                  View Course
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
