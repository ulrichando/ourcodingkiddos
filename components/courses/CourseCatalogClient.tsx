"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import {
  Search,
  Clock,
  Star,
  BookOpen,
  X,
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
  Sparkles,
  ArrowRight,
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
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
  intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
  advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800",
  expert: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800",
  master: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

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

  // Trigger card animations on filter change
  useEffect(() => {
    setAnimateCards(false);
    const timer = setTimeout(() => setAnimateCards(true), 50);
    return () => clearTimeout(timer);
  }, [query, age, level, selectedCategory, selectedLanguage, currentPage]);

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
      {/* Hero Section with gradient background */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-slate-50 to-slate-50 dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-200/30 dark:bg-pink-900/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative">
          {/* Header with animations */}
          <div className="text-center space-y-4 animate-fade-in">
            <span className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 px-4 py-1.5 rounded-full text-xs font-semibold border border-purple-200 dark:border-purple-800">
              <Sparkles className="w-3.5 h-3.5" />
              Learn to Code
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100">
              Explore Our <span className="text-gradient">Courses</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Find the perfect course for your coding journey. From HTML basics to AI mastery.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Category Cards with staggered animation */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
            {categoryConfig.map((cat, index) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedLanguage(null);
                  }}
                  className={`group flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-300 animate-fade-in-up ${
                    isSelected
                      ? "bg-white dark:bg-slate-800 shadow-lg shadow-purple-500/10 ring-2 ring-purple-500 dark:ring-purple-400 scale-105"
                      : "bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:scale-105"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xs font-medium transition-colors ${isSelected ? "text-purple-600 dark:text-purple-400" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100"}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-4 transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search with animated border */}
              <div className={`flex-1 flex items-center gap-2 border rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 transition-all duration-300 ${
                isSearchFocused
                  ? "ring-2 ring-purple-500/30 border-purple-500 dark:border-purple-400 shadow-sm shadow-purple-500/10"
                  : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
              }`}>
                <Search className={`h-5 w-5 transition-colors ${isSearchFocused ? "text-purple-500" : "text-slate-400"}`} />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full outline-none text-sm text-slate-700 dark:text-slate-300 bg-transparent placeholder:text-slate-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap gap-2">
                {/* Age Dropdown */}
                <div className="relative flex-1 sm:flex-none min-w-[120px]">
                  <select
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={`w-full appearance-none px-3 sm:px-4 py-2.5 pr-8 rounded-xl border text-sm font-medium cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${
                      age !== "All Ages"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-400 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-700/50 dark:border-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500"
                    }`}
                  >
                    {ageFilters.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>

                {/* Level Dropdown */}
                <div className="relative flex-1 sm:flex-none min-w-[120px]">
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className={`w-full appearance-none px-3 sm:px-4 py-2.5 pr-8 rounded-xl border text-sm font-medium cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${
                      level !== "All Levels"
                        ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-700/50 dark:border-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500"
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
                    className="px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/50 transition-all duration-200 flex items-center gap-1 active:scale-95"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters Tags with smooth animations */}
            <div className={`overflow-hidden transition-all duration-300 ${activeFiltersCount > 0 ? "max-h-20 opacity-100 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700" : "max-h-0 opacity-0"}`}>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 py-1">Active filters:</span>
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 text-xs font-medium animate-scale-in border border-purple-200 dark:border-purple-800">
                    {categoryConfig.find(c => c.id === selectedCategory)?.label}
                    <button onClick={() => setSelectedCategory("all")} className="hover:text-purple-900 dark:hover:text-purple-200 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {age !== "All Ages" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-medium animate-scale-in border border-emerald-200 dark:border-emerald-800">
                    {age}
                    <button onClick={() => setAge("All Ages")} className="hover:text-emerald-900 dark:hover:text-emerald-200 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {level !== "All Levels" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-medium animate-scale-in border border-blue-200 dark:border-blue-800">
                    {level}
                    <button onClick={() => setLevel("All Levels")} className="hover:text-blue-900 dark:hover:text-blue-200 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedLanguage && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 text-xs font-medium animate-scale-in border border-orange-200 dark:border-orange-800">
                    {languageLabels[selectedLanguage] || selectedLanguage.toUpperCase()}
                    <button onClick={() => setSelectedLanguage(null)} className="hover:text-orange-900 dark:hover:text-orange-200 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {filtered.length === 0 ? (
                <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">0</span>
              ) : (
                <>
                  Showing <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{startIndex + 1}-{Math.min(endIndex, filtered.length)}</span> of{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{filtered.length}</span>
                </>
              )}{" "}
              courses
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>

          {/* Course Grid with staggered animations */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/50 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No courses found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your filters or search query</p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 active:scale-95"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCourses.map((course, index) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <div
                    className={`group rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm h-full flex flex-col transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1 hover:border-purple-300 dark:hover:border-purple-600 ${
                      animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: `${index * 75}ms` }}
                  >
                    {/* Card Header with gradient overlay */}
                    <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent)]" />
                      <div className="transform transition-transform duration-500 group-hover:scale-110">
                        <LanguageIcon language={course.language.toLowerCase()} size="lg" showLabel />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${levelColors[course.level.toLowerCase()] || "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"}`}>
                          {course.level}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-600">
                          {course.age}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                        {course.description}
                      </p>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 text-xs font-medium">
                          <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span className="tabular-nums">{course.hours}h</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-amber-500">
                            <Star className="w-4 h-4 fill-amber-500" />
                            <span className="tabular-nums">{course.xp} XP</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <BookOpen className="w-4 h-4" />
                            <span className="tabular-nums">{course.lessonsCount}</span>
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination Controls with improved styling */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-1 pt-8" aria-label="Pagination">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 active:scale-95"
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
                      className={`min-w-[44px] px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 tabular-nums active:scale-95 ${
                        currentPage === page
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                          : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
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
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 active:scale-95"
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
