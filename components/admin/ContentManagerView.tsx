"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Plus, CircleCheck, X, ChevronRight, FileText, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Badge from "../ui/badge";
import Button from "../ui/button";
import Input from "../ui/input";
import LanguageIcon from "../ui/LanguageIcon";

export type ContentCourse = {
  id: string;
  title: string;
  description?: string | null;
  language: string;
  level: string;
  ageGroup: string;
  isPublished: boolean;
  totalXp?: number | null;
};

type LessonItem = {
  id: string;
  title: string;
  description?: string | null;
  xpReward?: number | null;
  orderIndex?: number | null;
};

type Props = {
  courses: ContentCourse[];
  homePath: string;
  dbError?: boolean;
};

export default function ContentManagerView({ courses, homePath, dbError = false }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(courses[0]?.id ?? null);
  const [courseList, setCourseList] = useState<ContentCourse[]>(courses);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [courseMessage, setCourseMessage] = useState<string | null>(null);

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    language: "HTML",
    level: "BEGINNER",
    ageGroup: "AGES_7_10",
    totalXp: 500,
  });
  const [courseError, setCourseError] = useState<string | null>(null);

  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    content: "",
    videoUrl: "",
    exampleCode: "",
    exerciseInstructions: "",
    xpReward: 50,
  });

  const selected = useMemo(() => courseList.find((c) => c.id === selectedId) || null, [courseList, selectedId]);

  const safeJson = async (res: Response) => {
    const text = await res.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
  };

  // keep local course state in sync with server data (e.g., after reload)
  useEffect(() => {
    setCourseList(courses);
    if (!courses.find((c) => c.id === selectedId)) {
      setSelectedId(courses[0]?.id ?? null);
    }
    // intentionally do not include selectedId in deps to avoid overwriting local additions
    // when selection changes; we only resync when the incoming courses prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses]);

  useEffect(() => {
    // Clear lesson errors when switching courses to avoid stale messaging
    setLessonError(null);
  }, [selectedId]);

  const resetCourseForm = () => {
    setCourseForm({
      title: "",
      description: "",
      language: "HTML",
      level: "BEGINNER",
      ageGroup: "AGES_7_10",
      totalXp: 500,
    });
    setEditingCourseId(null);
    setCourseError(null);
    setCourseMessage(null);
  };

  const resetLessonForm = () => {
    setLessonForm({
      title: "",
      description: "",
      content: "",
      videoUrl: "",
      exampleCode: "",
      exerciseInstructions: "",
      xpReward: 50,
    });
    setEditingLessonId(null);
  };

  const loadLessons = useCallback(async () => {
    if (!selectedId) {
      setLessons([]);
      return;
    }
    setLessonsLoading(true);
    setLessonError(null);
    try {
      const res = await fetch(`/api/admin/lessons?courseId=${selectedId}`);
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.error || "Failed to load lessons");
      setLessons((data.lessons || []).sort((a: LessonItem, b: LessonItem) => (a.orderIndex || 0) - (b.orderIndex || 0)));
    } catch (e: any) {
      setLessonError(e.message || "Failed to load lessons");
      setLessons([]);
    } finally {
      setLessonsLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  const handleSaveCourse = async () => {
    if (!courseForm.title.trim()) {
      setCourseError("Title is required");
      return;
    }
    setCourseError(null);
    setCourseMessage(null);
    setSaving(true);
    try {
      const method = editingCourseId ? "PATCH" : "POST";
      const body = editingCourseId ? { id: editingCourseId, ...courseForm } : courseForm;
      const res = await fetch("/api/admin/courses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.error || "Failed to save course");
      const updated: ContentCourse = data.course;
      setCourseList((prev) => {
        if (editingCourseId) {
          return prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c));
        }
        return [updated, ...prev];
      });
      setSelectedId(updated.id);
      setCourseMessage(editingCourseId ? "Course updated." : "Course created.");
      resetCourseForm();
      setCourseModalOpen(false);
    } catch (e: any) {
      setCourseError(e.message || "Failed to save course");
      setCourseMessage(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!courseId) return;
    if (!confirm("Delete this course and its lessons?")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.error || "Failed to delete course");
      setCourseList((prev) => {
        const filtered = prev.filter((c) => c.id !== courseId);
        // update selection based on new list
        if (selectedId === courseId) {
          setSelectedId(filtered[0]?.id ?? null);
          setLessons([]);
        }
        return filtered;
      });
      // reload lessons if a new course is auto-selected
      if (selectedId !== courseId && selectedId) {
        loadLessons();
      }
    } catch (e: any) {
      setCourseError(e.message || "Failed to delete course");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLesson = async () => {
    if (!selectedId) return;
    if (!lessonForm.title.trim()) {
      setLessonError("Lesson title is required");
      return;
    }
    setLessonError(null);
    setSaving(true);
    try {
      const method = editingLessonId ? "PATCH" : "POST";
      const payload = editingLessonId ? { id: editingLessonId, ...lessonForm, courseId: selectedId } : { ...lessonForm, courseId: selectedId };
      const res = await fetch("/api/admin/lessons", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.error || "Failed to save lesson");
      const saved: LessonItem = data.lesson;
      setLessons((prev) => {
        if (editingLessonId) {
          return prev
            .map((l) => (l.id === editingLessonId ? { ...l, ...saved } : l))
            .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        }
        return [...prev, saved].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      });
      setLessonError(null);
      resetLessonForm();
      setLessonModalOpen(false);
      setEditingLessonId(null);
      // refresh from server to keep ordering consistent
      loadLessons();
    } catch (e: any) {
      setLessonError(e.message || "Failed to save lesson");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {dbError && (
          <div className="w-full rounded-xl border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 text-sm">
            Database unavailable. Start the database to load and edit courses/lessons.
          </div>
        )}
        {(courseError || lessonError || courseMessage) && (
          <div
            className={`w-full rounded-xl border px-4 py-3 text-sm ${
              courseError || lessonError
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {courseError || lessonError || courseMessage}
          </div>
        )}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Content Manager</h1>
            <p className="text-slate-600 text-sm">Create and manage courses and lessons</p>
          </div>
          <Button
            type="button"
            className="bg-gradient-to-r from-purple-500 to-pink-500"
            onClick={() => {
              resetCourseForm();
              setCourseModalOpen(true);
            }}
            disabled={dbError}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Course
          </Button>
        </div>

        <div className="grid lg:grid-cols-[380px,1fr] gap-6">
          {/* Courses list */}
          <Card className="border border-slate-100 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Courses ({courseList.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {courseList.map((course) => {
                const active = course.id === selectedId;
                const langKey = (course.language || "html").toLowerCase();
                const levelLabel = (course.level || "BEGINNER").toLowerCase();
                return (
                  <button
                    key={course.id}
                    onClick={() => setSelectedId(course.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all border ${
                      active ? "bg-purple-50 border-purple-400 shadow" : "bg-white hover:bg-slate-50 border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LanguageIcon language={langKey} size="sm" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{course.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <Badge variant="outline">{levelLabel}</Badge>
                          {course.isPublished ? (
                            <Badge className="bg-green-100 text-green-700 text-xs">Live</Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-600 text-xs">Draft</Badge>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>
                );
              })}
              {courseList.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No courses yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details and lessons */}
          <Card className="border border-slate-100 shadow-sm bg-white min-h-[420px]">
            {selected ? (
              <>
                <div className="flex flex-col gap-4 border-b border-slate-100 p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3">
                      <LanguageIcon language={(selected.language || "html").toLowerCase()} size="lg" />
                      <div>
                        <div className="text-xl font-bold text-slate-900">{selected.title}</div>
                        {selected.description && <p className="text-sm text-slate-600 mt-1">{selected.description}</p>}
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <Badge variant="outline">{(selected.level || "BEGINNER").toLowerCase()}</Badge>
                          <Badge variant="outline">
                            Ages {selected.ageGroup ? selected.ageGroup.replace("AGES_", "").replace("_", "-") : "7-10"}
                          </Badge>
                          {selected.totalXp ? <Badge variant="outline">{selected.totalXp} XP</Badge> : null}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={dbError}
                        onClick={() => {
                          setCourseForm({
                            title: selected.title,
                            description: selected.description || "",
                            language: (selected.language || "HTML").toUpperCase(),
                            level: (selected.level || "BEGINNER").toUpperCase(),
                            ageGroup: (selected.ageGroup || "AGES_7_10").toUpperCase(),
                            totalXp: selected.totalXp || 0,
                          });
                          setEditingCourseId(selected.id);
                          setCourseModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        disabled={dbError}
                        onClick={() => handleDeleteCourse(selected.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <Badge className="bg-purple-100 text-purple-700">
                      {(selected.level || "BEGINNER").toLowerCase()}
                    </Badge>
                    <Badge className="bg-slate-100 text-slate-700">
                      {selected.ageGroup ? selected.ageGroup.replace("AGES_", "").replace("_", "-") : "7-10"}
                    </Badge>
                    {selected.totalXp ? <Badge className="bg-slate-100 text-slate-700">{selected.totalXp} XP</Badge> : null}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                    <span>Lessons ({lessons.length})</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        resetLessonForm();
                        setLessonModalOpen(true);
                      }}
                      disabled={dbError}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Lesson
                    </Button>
                  </div>

                  {lessonError ? (
                    <div className="text-sm text-red-600">{lessonError}</div>
                  ) : lessonsLoading ? (
                    <div className="text-sm text-slate-500">Loading lessons...</div>
                  ) : lessons.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-500">No lessons yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {lessons
                        .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                        .map((lesson, index) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
                          >
                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-slate-900">{lesson.title}</h4>
                              {lesson.description && <p className="text-xs text-slate-500">{lesson.description}</p>}
                              <p className="text-xs text-slate-500">{lesson.xpReward ?? 50} XP</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {lesson.videoUrl || (lesson as any).video_url ? "Video" : "Text"}
                              </Badge>
                              <button
                                className="text-xs text-purple-600 hover:text-purple-800"
                                onClick={() => {
                                  setLessonForm({
                                    title: lesson.title || "",
                                    description: lesson.description || "",
                                    content: (lesson as any).content || "",
                                    videoUrl: (lesson as any).videoUrl || (lesson as any).video_url || "",
                                    exampleCode: (lesson as any).exampleCode || (lesson as any).example_code || "",
                                    exerciseInstructions:
                                      (lesson as any).exerciseInstructions || (lesson as any).exercise_instructions || "",
                                    xpReward: lesson.xpReward ?? (lesson as any).xp_reward ?? 50,
                                  });
                                  setEditingLessonId(lesson.id);
                                  setLessonModalOpen(true);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="text-xs text-red-500 hover:text-red-700"
                                onClick={async () => {
                                  if (!confirm("Delete this lesson?")) return;
                                  try {
                                    const res = await fetch("/api/admin/lessons", {
                                      method: "DELETE",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ lessonId: lesson.id }),
                                    });
                                    if (!res.ok) throw new Error("Failed to delete lesson");
                                    setLessons((prev) => prev.filter((l) => l.id !== lesson.id));
                                    // ensure latest ordering from source
                                    loadLessons();
                                  } catch (err: any) {
                                    setLessonError(err.message || "Failed to delete lesson");
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Select a Course</h3>
                <p className="text-slate-500">Choose a course from the list to view and manage its lessons</p>
              </CardContent>
            )}
          </Card>
        </div>
      </main>
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl relative">
            <button className="absolute top-3 right-3 text-slate-500 hover:text-slate-700" onClick={() => setCourseModalOpen(false)} type="button">
              <X className="w-5 h-5" />
            </button>
            <form
              className="px-6 py-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveCourse();
              }}
            >
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingCourseId ? "Edit Course" : "Create New Course"}
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <Input
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    placeholder="e.g., HTML Basics for Kids"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    placeholder="What will students learn?"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-300"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Language</label>
                    <select
                      value={courseForm.language}
                      onChange={(e) => setCourseForm({ ...courseForm, language: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                      <option value="HTML">HTML</option>
                      <option value="CSS">CSS</option>
                      <option value="JAVASCRIPT">JavaScript</option>
                      <option value="PYTHON">Python</option>
                      <option value="ROBLOX">Roblox</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Level</label>
                    <select
                      value={courseForm.level}
                      onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Age Group</label>
                    <select
                      value={courseForm.ageGroup}
                      onChange={(e) => setCourseForm({ ...courseForm, ageGroup: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                      <option value="AGES_7_10">7-10 years</option>
                      <option value="AGES_11_14">11-14 years</option>
                      <option value="AGES_15_18">15-18 years</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Total XP</label>
                    <Input
                      type="number"
                      value={courseForm.totalXp}
                      onChange={(e) => setCourseForm({ ...courseForm, totalXp: parseInt(e.target.value || "0", 10) })}
                      className="mt-1"
                    />
                  </div>
                </div>
                {courseError && <p className="text-sm text-red-600">{courseError}</p>}
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setCourseModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {lessonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative">
            <button className="absolute top-3 right-3 text-slate-500 hover:text-slate-700" onClick={() => setLessonModalOpen(false)} type="button">
              <X className="w-5 h-5" />
            </button>
            <form
              className="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveLesson();
              }}
            >
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingLessonId ? "Edit Lesson" : "Add New Lesson"}
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <Input
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    placeholder="e.g., Introduction to HTML Tags"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    value={lessonForm.description}
                    onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                    placeholder="Brief description of this lesson"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-300"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Content (Markdown supported)</label>
                  <textarea
                    value={lessonForm.content}
                    onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                    placeholder="Lesson content..."
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-300"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Video URL (optional)</label>
                  <Input
                    value={lessonForm.videoUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Example Code</label>
                  <textarea
                    value={lessonForm.exampleCode}
                    onChange={(e) => setLessonForm({ ...lessonForm, exampleCode: e.target.value })}
                    placeholder="<h1>Hello World</h1>"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner font-mono focus:outline-none focus:ring-2 focus:ring-purple-300"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Exercise Instructions</label>
                  <textarea
                    value={lessonForm.exerciseInstructions}
                    onChange={(e) => setLessonForm({ ...lessonForm, exerciseInstructions: e.target.value })}
                    placeholder="What should students do?"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-300"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">XP Reward</label>
                  <Input
                    type="number"
                    value={lessonForm.xpReward}
                    onChange={(e) => setLessonForm({ ...lessonForm, xpReward: parseInt(e.target.value || "0", 10) })}
                    className="mt-1"
                  />
                </div>
                {lessonError && <p className="text-sm text-red-600">{lessonError}</p>}
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setLessonModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingLessonId ? "Update Lesson" : "Create Lesson"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
