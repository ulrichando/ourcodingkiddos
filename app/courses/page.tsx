"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, Filter, Globe, Clock, Star, BookOpen } from "lucide-react";
import { courses } from "../../data/courses";

const ageFilters = ["All Ages", "7-10 years", "11-14 years", "15-18 years"];
const levelFilters = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const languageFilters = ["All Languages", "HTML", "CSS", "JavaScript", "Python", "Roblox"];

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const [age, setAge] = useState("All Ages");
  const [level, setLevel] = useState("All Levels");
  const [language, setLanguage] = useState("All Languages");

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase());
      const matchesAge = age === "All Ages" || c.age.toLowerCase().includes(age.split(" ")[0]);
      const matchesLevel = level === "All Levels" || c.level === level.toLowerCase();
      const matchesLang = language === "All Languages" || c.language.toLowerCase() === language.toLowerCase();
      return matchesQuery && matchesAge && matchesLevel && matchesLang;
    });
  }, [query, age, level, language]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="pt-16 pb-10 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
              Learn to Code
            </span>
            <h1 className="text-4xl font-bold">Explore Our Courses</h1>
            <p className="text-slate-600 max-w-3xl mx-auto">
              From beginner-friendly introductions to advanced projects, find the perfect course for your coding journey.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center gap-2 flex-1 w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full outline-none text-sm text-slate-700 bg-transparent"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>All Languages</span>
                <div className="flex flex-wrap gap-2">
                  {["HTML", "CSS", "JavaScript", "Python", "Roblox"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang === language ? "All Languages" : lang)}
                      className={`px-3 py-1 rounded-full border text-xs ${
                        language === lang
                          ? "bg-purple-100 text-purple-700 border-purple-200"
                          : "bg-white border-slate-200 text-slate-700"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters:
              </span>
              {ageFilters.map((a) => (
                <button
                  key={a}
                  onClick={() => setAge(a)}
                  className={`px-3 py-1 rounded-full border ${
                    age === a ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-white border-slate-200"
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
                    level === l ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-white border-slate-200"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-500">Showing {filtered.length} courses</p>

          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition bg-white">
                  <div className={`h-28 bg-gradient-to-r ${course.gradient}`} />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="px-2 py-1 rounded-full bg-slate-100 capitalize">{course.level}</span>
                      <span className="px-2 py-1 rounded-full bg-slate-100">{course.age}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900">{course.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{course.description}</p>
                    <div className="flex gap-4 text-xs text-slate-600 font-semibold pt-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-500" />
                        {course.hours}h
                      </span>
                      <span className="inline-flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4" />
                        {course.xp} XP
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="w-4 h-4 text-slate-500" />
                        {course.lessons.length} lessons
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
