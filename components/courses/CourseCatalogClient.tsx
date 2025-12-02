"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Filter, Clock, Star, BookOpen } from "lucide-react";
import LanguageIcon from "../ui/LanguageIcon";

export type CatalogCourse = {
  id: string;
  title: string;
  level: string;
  age: string;
  xp: number;
  hours: number;
  description: string;
  language: string;
  slug: string;
  lessonsCount: number;
};

const ageFilters = ["All Ages", "7-10 years", "11-14 years", "15-18 years"];
const levelFilters = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const languageFilters = ["All Languages", "HTML", "CSS", "JavaScript", "Python", "Roblox"];

export default function CourseCatalogClient({ courses }: { courses: CatalogCourse[] }) {
  const [query, setQuery] = useState("");
  const [age, setAge] = useState("All Ages");
  const [level, setLevel] = useState("All Levels");
  const [language, setLanguage] = useState("All Languages");

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase());
      const matchesAge = age === "All Ages" || c.age.toLowerCase().includes(age.split(" ")[0]);
      const matchesLevel = level === "All Levels" || c.level.toLowerCase() === level.toLowerCase();
      const matchesLang = language === "All Languages" || c.language.toLowerCase() === language.toLowerCase();
      return matchesQuery && matchesAge && matchesLevel && matchesLang;
    });
  }, [query, age, level, language, courses]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200">
      <section className="pt-16 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-semibold">
              Learn to Code
            </span>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Explore Our Courses</h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              From beginner-friendly introductions to advanced projects, find the perfect course for your coding journey.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center gap-2 flex-1 w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-700">
                <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full outline-none text-sm text-slate-700 dark:text-slate-300 bg-transparent placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 flex-wrap">
                <span>All Languages</span>
                <div className="flex flex-wrap gap-2">
                  {["HTML", "CSS", "JavaScript", "Python", "Roblox"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang === language ? "All Languages" : lang)}
                      className={`px-3 py-1 rounded-full border text-xs ${
                        language === lang
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-600"
                          : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters:
              </span>
              {ageFilters.map((a) => (
                <button
                  key={a}
                  onClick={() => setAge(a)}
                  className={`px-3 py-1 rounded-full border ${
                    age === a ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-600" : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {a}
                </button>
              ))}
              {levelFilters.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-3 py-1 rounded-full border ${
                    level === l ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-600" : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">Showing {filtered.length} courses</p>

          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`}>
                <div className="rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition bg-white dark:bg-slate-800">
                  <div className="h-28 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <LanguageIcon language={course.language.toLowerCase()} size="lg" showLabel />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 capitalize">{course.level.toLowerCase()}</span>
                      <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">{course.age}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{course.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{course.description}</p>
                    <div className="flex gap-4 text-xs text-slate-600 dark:text-slate-400 font-semibold pt-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        {course.hours}h
                      </span>
                      <span className="inline-flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4" />
                        {course.xp} XP
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        {course.lessonsCount} lessons
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
