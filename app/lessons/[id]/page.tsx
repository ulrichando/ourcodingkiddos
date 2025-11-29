"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Code2, Play, Star } from "lucide-react";
import CodeEditor from "@/components/playground/CodeEditor";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { courses as mockCourses } from "@/data/courses";
import QuizCard from "@/components/quiz/QuizCard";
import { useSearchParams } from "next/navigation";

type CourseType = (typeof mockCourses)[number];
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
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isExactCourse =
    !!course &&
    !!courseId &&
    (course.id === courseId ||
      (course as any).slug === courseId ||
      normalizeSlug((course as any).title || "") === normalizeSlug(courseId));

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`, { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const data = json.data;
        if (!data) return;
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
        if (!cancelled) setCourse(mapped);
      } catch {
        // ignore
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

  if (!course) {
    return (
      <main className="min-h-screen bg-[#0b1224] text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">Course not found</p>
          <Link href="/courses" className="text-purple-300 underline">
            Back to courses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="lesson-page min-h-screen bg-[#0b1224] text-white">
      <header className="bg-[#0b1224] border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/courses/${course.slug || course.id}`} className="text-slate-300 hover:text-white inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to course
            </Link>
            <div>
              <p className="text-xs text-slate-400">
                {course.title} — Lesson {current + 1} of {lessons.length}
              </p>
              <h1 className="text-sm font-semibold text-white">{active?.title || "Lesson"}</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-slate-300 text-sm">
            <div className="flex items-center gap-2 w-56">
              <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="w-10 text-right">{progressPct}%</span>
            </div>
            <Link href="/courses" className="hover:text-white">
              Exit
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden lg:block w-72 bg-[#0d162d] border-r border-slate-800 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="p-4 space-y-3">
            <p className="text-xs text-slate-500 font-semibold">LESSONS</p>
            <div className="space-y-1">
              {lessons.map((lesson, idx) => {
                const activeLesson = idx === current;
                const isDone = completed.has(idx);
                return (
                  <button
                    key={lesson.title + idx}
                    onClick={() => setCurrent(idx)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                      activeLesson ? "bg-purple-500/20 text-purple-200 border border-purple-400/40" : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        isDone
                          ? "border-green-300 bg-green-500 text-white"
                          : activeLesson
                          ? "border-purple-300 bg-purple-400"
                          : "border-slate-600"
                      }`}
                    >
                      {isDone && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                    <span className="text-sm truncate">{lesson.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="flex-1 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            {active && (
              <>
                <div className="space-y-2">
              <Badge className="bg-purple-500/20 text-purple-200 border-0">Lesson {current + 1}</Badge>
              <h2 className="text-3xl font-bold text-white">{active.title}</h2>
              <p className="text-slate-200">{active.description}</p>
            </div>

                <Card className="lesson-overview bg-white text-slate-900 dark:bg-[#0c1326] dark:text-slate-100 border-[#243155] shadow-[0_10px_40px_rgba(0,0,0,0.35)] lesson-shell">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-100 mb-1">Overview</h3>
                    <p className="text-slate-700 dark:text-slate-100">
                      Learn why this lesson matters and practice with the example and “Your Turn” editor below. Complete the lesson to earn XP.
                    </p>
                    <ul className="text-slate-800 dark:text-slate-100 text-sm space-y-1 list-disc list-inside">
                      <li>Welcome to the topic with a quick primer.</li>
                      <li>Follow the example code, then try it yourself.</li>
                      <li>Mark complete to fill the progress bar.</li>
                    </ul>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-white mb-3">
                      <Code2 className="h-5 w-5" /> Example Code
                    </h3>
                    <Card className="bg-[#0f1528] border-[#1b2744]">
                      <CardContent className="p-4">
                        <CodeEditor
                          key={`example-${course.id}-${current}`}
                          initialCode={exampleCode}
                          language={course.language}
                          showPreview={course.language !== "python"}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-white mb-3">
                      <Star className="h-5 w-5 text-amber-400" /> Your Turn!
                    </h3>
                    <Card className="bg-gradient-to-br from-purple-900/50 to-indigo-900/60 border-purple-700/40">
                      <CardContent className="p-4">
                        <p className="text-slate-200 mb-3">
                          {(active as any).exercise_instructions || "Try it yourself below and hit “Run”."}
                        </p>
                        <CodeEditor
                          key={`exercise-${course.id}-${current}`}
                          initialCode={(active as any).exercise_starter_code || "// Write your code here\n"}
                          language={course.language}
                          showPreview={course.language !== "python"}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-amber-300 font-semibold">
                      <Star className="h-5 w-5 text-amber-300" />
                      <span>Quiz Time!</span>
                    </div>
                    {quizLoading ? (
                      <Card className="bg-slate-800 border-slate-700">
                        <CardContent className="p-6 text-center text-slate-400">Loading quiz...</CardContent>
                      </Card>
                    ) : quizQuestions.length > 0 ? (
                      quizQuestions.map((quiz: any, idx: number) => (
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
                      ))
                    ) : (
                      <Card className="bg-slate-800 border-slate-700">
                        <CardContent className="p-8 text-center">
                          <p className="text-slate-400">{quizError || "No quiz for this lesson yet!"}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                  <button
                    onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                    className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white disabled:opacity-40"
                    disabled={current === 0}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={handleMarkComplete}
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded-lg disabled:opacity-50"
                      disabled={completed.has(current) || !isExactCourse || !active || isSaving}
                    >
                      <CheckCircle2 className="h-4 w-4" /> {isSaving ? "Saving..." : "Mark Complete"}
                    </button>
                  </div>
                  <button
                    onClick={() => setCurrent((c) => Math.min(lessons.length - 1, c + 1))}
                    className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white disabled:opacity-40"
                    disabled={current === lessons.length - 1}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </main>
  );
}
