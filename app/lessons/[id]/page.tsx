"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Code2, Play, Star, Menu, X } from "lucide-react";
import CodeEditor from "@/components/playground/CodeEditor";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { courses as mockCourses } from "@/data/courses";
import QuizCard from "@/components/quiz/QuizCard";
import { useSearchParams } from "next/navigation";

type CourseType = ((typeof mockCourses)[number]) & { slug?: string };
type LessonType = CourseType["lessons"][number];

function normalizeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findCourse(identifier: string): CourseType | null {
  const slugged = identifier.toLowerCase();
  const normalized = normalizeSlug(identifier);
  return (
    mockCourses.find(
      (c) =>
        c.id === identifier ||
        c.id === slugged ||
        c.title.toLowerCase() === slugged ||
        normalizeSlug(c.title) === normalized ||
        (c as any).slug === identifier ||
        (c as any).slug === slugged ||
        normalizeSlug((c as any).slug || "") === normalized
    ) || null
  );
}

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = use(params);
  const courseId = resolved?.id;
  const searchParams = useSearchParams();
  const [course, setCourse] = useState<CourseType | null>(courseId ? findCourse(courseId) : null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(!course);
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isExactCourse =
    !!course &&
    !!courseId &&
    (course.id === courseId ||
      (course as any).slug === courseId ||
      normalizeSlug((course as any).title || "") === normalizeSlug(courseId));

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    setIsLoadingCourse(true);
    (async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`, { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setIsLoadingCourse(false);
          return;
        }
        const json = await res.json();
        const data = json.data;
        if (!data) {
          if (!cancelled) setIsLoadingCourse(false);
          return;
        }
        const lessons = Array.isArray(data.lessons) ? data.lessons : [];
        const mapped: CourseType = {
          id: data.id,
          slug: data.slug || data.id,
          title: data.title,
          level: (data.level || "beginner").toLowerCase(),
          age: data.ageGroup || "Ages 7-10",
          xp: data.totalXp || 0,
          hours: data.estimatedHours || 0,
          description: data.description || "",
          language: (data.language || "html").toLowerCase(),
          gradient: "from-purple-500 to-pink-500",
          lessons: lessons.map((l: any, idx: number) => ({
            id: l.id || `${data.id}-${idx}`,
            title: l.title || `Lesson ${idx + 1}`,
            description: l.description || "",
            xp: l.xpReward || 50,
            example: l.example_code || l.exampleCode || "",
            content: l.content || "",
            video_url: l.videoUrl || l.video_url || "",
            exercise_instructions: l.exerciseInstructions || l.exercise_instructions || "",
            exercise_starter_code: l.exerciseStarterCode || l.exercise_starter_code || "",
          })),
        };
        if (!cancelled) {
          setCourse(mapped);
          setIsLoadingCourse(false);
        }
      } catch {
        if (!cancelled) setIsLoadingCourse(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  // ensure lessons have ids even for mock/static courses
  useEffect(() => {
    if (!course) return;
    const lessons = course.lessons || [];
    const needsIds = lessons.some((l: any, idx: number) => !(l as any).id);
    if (needsIds) {
      setCourse({
        ...course,
        // @ts-ignore
        lessons: lessons.map((l: any, idx: number) => ({
          ...l,
          id: (l as any).id || `${course.id}-${idx}`,
        })),
      });
    }
  }, [course]);

  useEffect(() => {
    // reset completion state when course changes
    setCompleted(new Set());
    setCurrent(0);
    setQuizQuestions([]);
  }, [course?.id]);

  useEffect(() => {
    // Pull student id from query or stored session
    const qpId = searchParams?.get("studentId") || searchParams?.get("id");
    if (qpId) {
      setStudentId(qpId);
      return;
    }
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("studentSession") || localStorage.getItem("studentSession");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.id) setStudentId(parsed.id);
        } catch {
          /* ignore */
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const lessonId = (lessons as any)?.[current]?.id || `${course?.id}-${current}`;
    if (!lessonId) {
      setQuizQuestions([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setQuizLoading(true);
      setQuizError(null);
      try {
        const res = await fetch(`/api/admin/quizzes?lessonId=${lessonId}`, { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!cancelled) {
          setQuizQuestions(Array.isArray(data?.quiz?.questions) ? data.quiz.questions : []);
        }
      } catch (e: any) {
        if (!cancelled) {
          setQuizQuestions([]);
          setQuizError("No quiz found for this lesson yet.");
        }
      } finally {
        if (!cancelled) setQuizLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [course?.id, current]);

  const lessons: LessonType[] = course?.lessons || [];
  const active = lessons[current];
  const progressPct = lessons.length ? Math.round((completed.size / lessons.length) * 100) : 0;
  const toastSuccess = (msg: string) => {
    if (typeof window !== "undefined" && window?.alert) {
      try {
        window.alert(msg);
        return;
      } catch {
        // ignore
      }
    }
    console.log(msg);
  };

  const exampleCode = useMemo(() => {
    if (!active) return "";
    return (
      (active as any).example ||
      (active as any).example_code ||
      (active as any).exampleCode ||
      `<!DOCTYPE html>
<html>
  <head><title>My First Page</title></head>
  <body>
    <h1>Hello, World!</h1>
    <p>Welcome to coding!</p>
  </body>
</html>`
    );
  }, [active]);

  const handleMarkComplete = async () => {
    if (!active || completed.has(current)) return;
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(current);
      return next;
    });

    if (!studentId) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/lessons/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: (active as any).id,
          courseId: course?.id,
          studentId,
          xp: (active as any).xp || (active as any).xpReward || 50,
        }),
      });
      if (res.ok) {
        toastSuccess("Progress saved! XP awarded.");
      }
    } catch (e) {
      console.error("failed to save progress", e);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingCourse) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#0b1224] text-slate-900 dark:text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">Loading lesson...</p>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#0b1224] text-slate-900 dark:text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">Course not found</p>
          <Link href="/courses" className="text-purple-600 dark:text-purple-300 underline">
            Back to courses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="lesson-page min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/20 dark:bg-none dark:!bg-[#0b1224] text-slate-900 dark:text-white">
      <header className="bg-white/80 dark:bg-[#0b1224] backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Link
                href={`/courses/${course.slug || course.id}`}
                className="group inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Back to course</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <div className="border-l border-slate-300 dark:border-slate-700 pl-3 min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-500 truncate">
                  {course.title}
                </p>
                <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {current + 1}. {active?.title || "Lesson"}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile lesson menu button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-semibold"
                aria-label="Open lesson menu"
              >
                <Menu className="h-4 w-4" />
                <span className="hidden sm:inline">Lessons</span>
              </button>

              <div className="hidden md:flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                <div className="flex items-center gap-3">
                  <div className="relative h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden w-48 shadow-inner">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                      style={{ width: `${progressPct}%` }}
                    >
                      <div className="absolute inset-0 bg-white/30 animate-pulse" />
                    </div>
                  </div>
                  <span className="w-12 text-right font-semibold text-purple-600 dark:text-purple-400">{progressPct}%</span>
                </div>
              </div>
              <Link
                href="/courses"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium"
              >
                Exit
              </Link>
            </div>
          </div>
          <div className="md:hidden mt-3">
            <div className="flex items-center gap-2 text-xs">
              <div className="relative h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex-1">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="font-semibold text-purple-600 dark:text-purple-400 w-10 text-right">{progressPct}%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 bg-white/50 dark:bg-[#0d162d] backdrop-blur-sm border-r border-slate-200/50 dark:border-slate-800 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-500 font-bold tracking-wider uppercase">Course Progress</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                  {completed.size}/{lessons.length}
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {progressPct}%
              </div>
            </div>
            <div className="space-y-2">
              {lessons.map((lesson, idx) => {
                const activeLesson = idx === current;
                const isDone = completed.has(idx);
                return (
                  <button
                    key={lesson.title + idx}
                    onClick={() => setCurrent(idx)}
                    className={`group w-full text-left px-4 py-3.5 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                      activeLesson
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-200 border-2 border-purple-400/50 dark:border-purple-500/50 shadow-md scale-[1.02]"
                        : isDone
                        ? "text-slate-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/20 border-2 border-transparent hover:border-green-200 dark:hover:border-green-800"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isDone
                          ? "border-green-500 bg-green-500 text-white shadow-md shadow-green-500/50"
                          : activeLesson
                          ? "border-purple-500 bg-purple-500 text-white shadow-md shadow-purple-500/50"
                          : "border-slate-300 dark:border-slate-600 group-hover:border-purple-400 dark:group-hover:border-purple-500"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-semibold block truncate ${activeLesson ? "text-purple-700 dark:text-purple-300" : ""}`}>
                        {lesson.title}
                      </span>
                      {activeLesson && <span className="text-xs text-purple-600 dark:text-purple-400">Currently learning</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            {/* Drawer */}
            <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-5 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Course Lessons</h3>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold tracking-wider uppercase">Progress</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                      {completed.size}/{lessons.length}
                    </p>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {progressPct}%
                  </div>
                </div>
                <div className="space-y-2">
                  {lessons.map((lesson, idx) => {
                    const activeLesson = idx === current;
                    const isDone = completed.has(idx);
                    return (
                      <button
                        key={lesson.title + idx}
                        onClick={() => {
                          setCurrent(idx);
                          setMobileSidebarOpen(false);
                        }}
                        className={`group w-full text-left px-4 py-4 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                          activeLesson
                            ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-200 border-2 border-purple-400/50 dark:border-purple-500/50 shadow-md"
                            : isDone
                            ? "text-slate-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/20 border-2 border-transparent hover:border-green-200 dark:hover:border-green-800"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                        }`}
                      >
                        <div
                          className={`h-10 w-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                            isDone
                              ? "border-green-500 bg-green-500 text-white shadow-md shadow-green-500/50"
                              : activeLesson
                              ? "border-purple-500 bg-purple-500 text-white shadow-md shadow-purple-500/50"
                              : "border-slate-300 dark:border-slate-600 group-hover:border-purple-400 dark:group-hover:border-purple-500"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-bold">{idx + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-base font-semibold block truncate ${activeLesson ? "text-purple-700 dark:text-purple-300" : ""}`}>
                            {lesson.title}
                          </span>
                          {activeLesson && <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Currently learning</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {active && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-1.5 shadow-lg shadow-purple-500/30">
                      Lesson {current + 1} of {lessons.length}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="font-semibold">{(active as any).xp || (active as any).xpReward || 50} XP</span>
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">{active.title}</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">{active.description}</p>
                </div>

                <Card className="lesson-overview relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/30 dark:via-[#0c1326] dark:to-pink-950/30 border-2 border-purple-200/50 dark:border-purple-800/50 shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
                  <CardContent className="relative p-8 space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300">Lesson Overview</h3>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                      Learn why this lesson matters and practice with the example and "Your Turn" editor below. Complete the lesson to earn XP and level up your coding skills!
                    </p>
                    <div className="grid sm:grid-cols-3 gap-4 pt-2">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-slate-800/40 border border-purple-200/30 dark:border-purple-700/30">
                        <div className="h-8 w-8 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-lg font-bold">1</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Learn the concept with examples</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-slate-800/40 border border-purple-200/30 dark:border-purple-700/30">
                        <div className="h-8 w-8 rounded-lg bg-pink-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-lg font-bold">2</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Practice in the code editor</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-slate-800/40 border border-purple-200/30 dark:border-purple-700/30">
                        <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-lg font-bold">3</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Mark complete and earn XP</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-8">
                  <div className="group">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                          <Code2 className="h-5 w-5 text-white" />
                        </div>
                        Example Code
                      </h3>
                      <Badge variant="outline" className="text-xs">Read-only</Badge>
                    </div>
                    <Card className="relative overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-2">
                        <div className="flex gap-1.5">
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          <div className="h-3 w-3 rounded-full bg-amber-500" />
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-mono ml-2">example.{course.language}</span>
                      </div>
                      <CardContent className="pt-12 p-0">
                        <CodeEditor
                          key={`example-${course.id}-${current}`}
                          initialCode={exampleCode}
                          language={course.language}
                          showPreview={course.language !== "python"}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl opacity-20 blur group-hover:opacity-30 transition-opacity" />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-pulse">
                            <Star className="h-5 w-5 text-white fill-white" />
                          </div>
                          Your Turn!
                        </h3>
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">Interactive</Badge>
                      </div>
                      <Card className="relative overflow-hidden border-2 border-purple-300 dark:border-purple-700 shadow-2xl bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 dark:from-purple-950/20 dark:via-[#0c1326] dark:to-pink-950/20">
                        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 dark:from-purple-900/40 dark:via-pink-900/30 dark:to-orange-900/20 border-b-2 border-purple-200 dark:border-purple-800">
                          <div className="flex items-center justify-between px-4 h-full">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-500 shadow-sm" />
                                <div className="h-3 w-3 rounded-full bg-amber-500 shadow-sm" />
                                <div className="h-3 w-3 rounded-full bg-green-500 shadow-sm" />
                              </div>
                              <span className="text-xs text-purple-700 dark:text-purple-300 font-mono ml-2 font-semibold">your-code.{course.language}</span>
                            </div>
                            <Play className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                        <CardContent className="pt-20 pb-6 px-6">
                          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-purple-100/80 to-pink-100/80 dark:from-purple-900/40 dark:to-pink-900/40 border border-purple-200 dark:border-purple-800">
                            <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                              {(active as any).exercise_instructions || 'Try it yourself below and hit "Run" to see your code in action!'}
                            </p>
                          </div>
                          <CodeEditor
                            key={`exercise-${course.id}-${current}`}
                            initialCode={(active as any).exercise_starter_code || "// Write your code here\n"}
                            language={course.language}
                            showPreview={course.language !== "python"}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Star className="h-5 w-5 text-white fill-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Quiz Time!</h3>
                    </div>
                    {quizLoading ? (
                      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700">
                        <CardContent className="p-8 text-center">
                          <div className="inline-flex items-center gap-3 text-slate-600 dark:text-slate-400">
                            <div className="h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                            <span className="font-medium">Loading quiz...</span>
                          </div>
                        </CardContent>
                      </Card>
                    ) : quizQuestions.length > 0 ? (
                      <div className="space-y-4">
                        {quizQuestions.map((quiz: any, idx: number) => (
                          <QuizCard
                            key={quiz.id || idx}
                            quiz={{
                              question: quiz.question,
                              options: Array.isArray(quiz.options) ? quiz.options : quiz.options ? Object.values(quiz.options) : [],
                              correct_answer: quiz.correctAnswer,
                              xp_reward: quiz.xpReward || 10,
                              explanation: quiz.explanation,
                            }}
                            onAnswer={(correct) => {
                              if (correct) {
                                toastSuccess(`Correct! +${quiz.xpReward || 10} XP`);
                              }
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700">
                        <CardContent className="p-10 text-center">
                          <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                          <p className="text-slate-600 dark:text-slate-400 font-medium">{quizError || "No quiz for this lesson yet!"}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent dark:from-[#0b1224] dark:via-[#0b1224] dark:to-transparent pt-8 pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 shadow-xl backdrop-blur-sm">
                    <button
                      onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm"
                      disabled={current === 0}
                    >
                      <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                      <span>Previous Lesson</span>
                    </button>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleMarkComplete}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-sm shadow-lg shadow-green-500/30 hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        disabled={completed.has(current) || !isExactCourse || !active || isSaving}
                      >
                        {isSaving ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : completed.has(current) ? (
                          <>
                            <CheckCircle2 className="h-5 w-5" />
                            Completed!
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-5 w-5" />
                            Mark Complete
                          </>
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => setCurrent((c) => Math.min(lessons.length - 1, c + 1))}
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                      disabled={current === lessons.length - 1}
                    >
                      <span>Next Lesson</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </main>
  );
}
