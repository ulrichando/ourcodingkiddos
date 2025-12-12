"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ParentLayout from "@/components/parent/ParentLayout";
import { BookMarked, Clock, Users, Star, ChevronRight, Loader2 } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';



type Program = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  level: string;
  ageGroup: string | null;
  duration: string | null;
  _count?: { enrollments: number };
};

export default function ParentCurriculumPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch("/api/programs");
        if (res.ok) {
          const data = await res.json();
          setPrograms(data.programs || []);
        }
      } catch (error) {
        console.error("Failed to load programs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPrograms();
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

  return (
    <ParentLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Curriculum</h1>
          <p className="text-slate-600 dark:text-slate-400">Explore structured learning paths for your child</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : programs.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <BookMarked className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No Programs Available</h3>
            <p className="text-slate-500 dark:text-slate-400">Check back soon for new learning paths.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((program) => (
              <Link
                key={program.id}
                href={`/programs/${program.slug}`}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-600 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <BookMarked className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(program.level)}`}>
                    {program.level}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {program.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                  {program.description || "Learn coding skills through interactive lessons."}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  {program.ageGroup && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {program.ageGroup.replace("AGES_", "Ages ").replace("_", "-")}
                    </span>
                  )}
                  {program.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {program.duration}
                    </span>
                  )}
                  {program._count?.enrollments && program._count.enrollments > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" />
                      {program._count.enrollments} enrolled
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-violet-600 dark:text-violet-400">
                  View Details
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
