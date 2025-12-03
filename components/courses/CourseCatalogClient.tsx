"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import {
  Search,
  Clock,
  Star,
  BookOpen,
  X,
  SlidersHorizontal,
  Globe,
  Smartphone,
  Joystick,
  Brain,
  Wrench,
  Bot,
  Award,
  Grid3X3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const COURSES_PER_PAGE = 9;
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
const levelFilters = ["All Levels", "Beginner", "Intermediate", "Advanced", "Expert", "Master"];

// Category config with icons and colors
const categoryConfig = [
  { id: "all", label: "All", icon: Grid3X3, color: "from-slate-400 to-slate-500", languages: [] },
  { id: "web", label: "Web Dev", icon: Globe, color: "from-indigo-400 to-blue-500", languages: ["html", "css", "javascript", "web_development"] },
  { id: "mobile", label: "Mobile", icon: Smartphone, color: "from-pink-400 to-rose-500", languages: ["mobile_development"] },
  { id: "game", label: "Games", icon: Joystick, color: "from-emerald-400 to-green-500", languages: ["game_development", "roblox"] },
  { id: "ai", label: "AI & ML", icon: Brain, color: "from-purple-400 to-violet-500", languages: ["ai_ml", "python"] },
  { id: "engineering", label: "Engineering", icon: Wrench, color: "from-slate-400 to-gray-500", languages: ["engineering"] },
  { id: "robotics", label: "Robotics", icon: Bot, color: "from-cyan-400 to-teal-500", languages: ["robotics"] },
  { id: "career", label: "Career", icon: Award, color: "from-amber-400 to-orange-500", languages: ["career_prep"] },
];

const levelColors: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  expert: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  master: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
};

// Language display names for filter tags
const languageLabels: Record<string, string> = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  python: "Python",
  roblox: "Roblox",
  engineering: "Engineering",
  ai_ml: "AI & ML",
  robotics: "Robotics",
  web_development: "Web Development",
  mobile_development: "Mobile Development",
  game_development: "Game Development",
  career_prep: "Career Prep",
};

export default function CourseCatalogClient({ courses }: { courses: CatalogCourse[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [age, setAge] = useState("All Ages");
  const [level, setLevel] = useState("All Levels");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Read URL language parameter and filter by specific language
  useEffect(() => {
    const languageParam = searchParams.get("language");
    if (languageParam) {
      const lang = languageParam.toLowerCase();
      setSelectedLanguage(lang);
      // Also select the matching category for visual feedback
      const matchingCategory = categoryConfig.find(cat =>
        cat.languages.includes(lang)
      );
      if (matchingCategory) {
        setSelectedCategory(matchingCategory.id);
      }
    }
  }, [searchParams]);

  const activeFiltersCount = (age !== "All Ages" ? 1 : 0) + (level !== "All Levels" ? 1 : 0) + (selectedCategory !== "all" ? 1 : 0) + (selectedLanguage ? 1 : 0);

  const clearAllFilters = () => {
    setQuery("");
    setAge("All Ages");
    setLevel("All Levels");
    setSelectedCategory("all");
    setSelectedLanguage(null);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase());
      const matchesAge = age === "All Ages" || c.age.toLowerCase().includes(age.split(" ")[0]);
      const matchesLevel = level === "All Levels" || c.level.toLowerCase() === level.toLowerCase();

      // If specific language is selected (from URL), filter by exact language
      if (selectedLanguage) {
        const matchesLanguage = c.language.toLowerCase() === selectedLanguage;
        return matchesQuery && matchesAge && matchesLevel && matchesLanguage;
      }

      // Otherwise filter by category
      const categoryLangs = categoryConfig.find(cat => cat.id === selectedCategory)?.languages || [];
      const matchesCategory = selectedCategory === "all" || categoryLangs.includes(c.language.toLowerCase());
      return matchesQuery && matchesAge && matchesLevel && matchesCategory;
    });
  }, [query, age, level, selectedCategory, selectedLanguage, courses]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, age, level, selectedCategory, selectedLanguage]);

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / COURSES_PER_PAGE);
  const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
  const endIndex = startIndex + COURSES_PER_PAGE;
  const paginatedCourses = filtered.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200">
      <section className="pt-12 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-semibold">
              Learn to Code
            </span>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Explore Our Courses</h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Find the perfect course for your coding journey
            </p>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
            {categoryConfig.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedLanguage(null); // Clear language filter when selecting category
                  }}
                  className={`group flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 ${
                    isSelected
                      ? "bg-white dark:bg-slate-800 shadow-lg ring-2 ring-purple-500 dark:ring-purple-400 scale-105"
                      : "bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xs font-medium ${isSelected ? "text-purple-600 dark:text-purple-400" : "text-slate-600 dark:text-slate-400"}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 flex items-center gap-2 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full outline-none text-sm text-slate-700 dark:text-slate-300 bg-transparent placeholder:text-slate-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filter Dropdowns */}
              <div className="flex gap-2">
                {/* Age Dropdown */}
                <div className="relative">
                  <select
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={`appearance-none px-4 py-2.5 pr-8 rounded-xl border text-sm font-medium cursor-pointer transition ${
                      age !== "All Ages"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-400"
                        : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-700/50 dark:border-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {ageFilters.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>

                {/* Level Dropdown */}
                <div className="relative">
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className={`appearance-none px-4 py-2.5 pr-8 rounded-xl border text-sm font-medium cursor-pointer transition ${
                      level !== "All Levels"
                        ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400"
                        : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-700/50 dark:border-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {levelFilters.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/50 transition flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters Tags */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 py-1">Active filters:</span>
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 text-xs font-medium">
                    {categoryConfig.find(c => c.id === selectedCategory)?.label}
                    <button onClick={() => setSelectedCategory("all")} className="hover:text-purple-900 dark:hover:text-purple-200">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {age !== "All Ages" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                    {age}
                    <button onClick={() => setAge("All Ages")} className="hover:text-emerald-900 dark:hover:text-emerald-200">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {level !== "All Levels" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-medium">
                    {level}
                    <button onClick={() => setLevel("All Levels")} className="hover:text-blue-900 dark:hover:text-blue-200">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedLanguage && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 text-xs font-medium">
                    {languageLabels[selectedLanguage] || selectedLanguage.toUpperCase()}
                    <button onClick={() => setSelectedLanguage(null)} className="hover:text-orange-900 dark:hover:text-orange-200">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {filtered.length === 0 ? (
                <span className="font-semibold text-slate-900 dark:text-slate-100">0</span>
              ) : (
                <>
                  Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{startIndex + 1}-{Math.min(endIndex, filtered.length)}</span> of{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{filtered.length}</span>
                </>
              )}{" "}
              courses
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>

          {/* Course Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No courses found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">Try adjusting your filters or search query</p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-lg bg-purple-500 text-white font-medium hover:bg-purple-600 transition"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <div className="group rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 bg-white dark:bg-slate-800 h-full flex flex-col">
                    <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-colors" />
                      <LanguageIcon language={course.language.toLowerCase()} size="lg" showLabel />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${levelColors[course.level.toLowerCase()] || "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"}`}>
                          {course.level}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium">
                          {course.age}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-medium pt-3 border-t border-slate-100 dark:border-slate-700">
                        <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          {course.hours}h
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-amber-500">
                          <Star className="w-4 h-4 fill-amber-500" />
                          {course.xp} XP
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <BookOpen className="w-4 h-4" />
                          {course.lessonsCount} lessons
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-1 pt-8" aria-label="Pagination">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:hover:bg-white dark:disabled:hover:bg-slate-800"
                aria-label="Go to previous page"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-3 py-2 text-slate-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-purple-600 text-white shadow-md"
                          : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                      aria-label={`Go to page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:hover:bg-white dark:disabled:hover:bg-slate-800"
                aria-label="Go to next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          )}
        </div>
      </section>
    </main>
  );
}
