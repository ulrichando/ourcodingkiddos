"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, BookOpen, ChevronRight, GripVertical, Edit, Trash2 } from "lucide-react";

type Course = {
  id: string;
  title: string;
  description: string;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  age: string;
  xp: number;
  live: boolean;
  lessons: { id: string; title: string; xp: number; type: "Video" | "Text" }[];
};

const courses: Course[] = [
  {
    id: "html-basics",
    title: "HTML Basics for Kids",
    description: "Learn to build your first web page! Discover tags, headings, paragraphs, images, and links.",
    language: "html",
    level: "beginner",
    age: "Ages 7-10",
    xp: 500,
    live: true,
    lessons: [
      { id: "l1", title: "What is HTML?", xp: 50, type: "Text" },
      { id: "l2", title: "Headings and Paragraphs", xp: 50, type: "Text" },
      { id: "l3", title: "Adding Images", xp: 75, type: "Text" },
    ],
  },
  {
    id: "css-magic",
    title: "CSS Magic: Style Your Pages",
    description: "Make your websites beautiful with colors, fonts, and layouts.",
    language: "css",
    level: "beginner",
    age: "Ages 7-10",
    xp: 500,
    live: true,
    lessons: [
      { id: "l1", title: "Color and Backgrounds", xp: 60, type: "Text" },
      { id: "l2", title: "Flexbox Fun", xp: 80, type: "Video" },
    ],
  },
  {
    id: "js-quests",
    title: "JavaScript Adventures",
    description: "Add interactivity to your websites! Make buttons click, create animations, and build mini-games.",
    language: "javascript",
    level: "beginner",
    age: "Ages 11-14",
    xp: 750,
    live: false,
    lessons: [
      { id: "l1", title: "Variables & Strings", xp: 70, type: "Text" },
      { id: "l2", title: "Functions", xp: 90, type: "Video" },
    ],
  },
];

const languageBadge = (lang: string) => {
  const map: Record<string, string> = {
    html: "bg-orange-100 text-orange-700",
    css: "bg-blue-100 text-blue-700",
    javascript: "bg-amber-100 text-amber-700",
    python: "bg-green-100 text-green-700",
    roblox: "bg-pink-100 text-pink-700",
  };
  return map[lang] ?? "bg-slate-100 text-slate-700";
};

export default function ContentManagerPage() {
  const [selectedId, setSelectedId] = useState<string>(courses[0]?.id ?? "");
  const selected = courses.find((c) => c.id === selectedId) ?? courses[0];

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Content Manager</h1>
            <p className="text-slate-600">Create and manage courses and lessons</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="#"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-md font-semibold shadow"
            >
              <Plus className="h-4 w-4" /> New Course
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="p-5 border-b">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <BookOpen className="h-5 w-5" /> Courses ({courses.length})
                </div>
              </div>
              <div className="p-3 space-y-2">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedId(course.id)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition ${
                      selectedId === course.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-transparent bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${languageBadge(course.language)}`}>
                        <span className="text-xs font-bold uppercase">{course.language.slice(0, 2)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{course.title}</p>
                        <div className="flex gap-2 mt-1 items-center text-xs text-slate-600">
                          <span className="px-2 py-1 rounded-full border border-slate-200 capitalize">{course.level}</span>
                          <span className={`px-2 py-1 rounded-full ${course.live ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                            {course.live ? "Live" : "Draft"}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${languageBadge(selected.language)}`}>
                      <span className="text-sm font-bold uppercase">{selected.language.slice(0, 2)}</span>
                    </div>
                    <div>
                      <div className="text-xl font-semibold">{selected.title}</div>
                      <p className="text-sm text-slate-600 mt-1">{selected.description}</p>
                      <div className="flex gap-2 mt-2 text-xs">
                        <span className="px-2 py-1 rounded-full border border-slate-200 capitalize">{selected.level}</span>
                        <span className="px-2 py-1 rounded-full border border-slate-200">{selected.age}</span>
                        <span className="px-2 py-1 rounded-full border border-slate-200">{selected.xp} XP</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 flex items-center gap-1 text-sm">
                      <Edit className="h-4 w-4" /> Edit
                    </button>
                    <button className="px-3 py-2 rounded-lg border border-slate-200 text-red-600 flex items-center gap-1 text-sm">
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Lessons ({selected.lessons.length})</h3>
                    <button className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded-md text-sm font-semibold">
                      <Plus className="h-4 w-4" /> Add Lesson
                    </button>
                  </div>

                  {selected.lessons.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                      <p className="text-slate-500 text-sm">No lessons yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selected.lessons.map((lesson, idx) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100"
                        >
                          <GripVertical className="h-4 w-4 text-slate-400" />
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold text-sm">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{lesson.title}</p>
                            <p className="text-xs text-slate-500">{lesson.xp} XP</p>
                          </div>
                          <span className="px-2 py-1 rounded-full border border-slate-200 text-xs">{lesson.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-10 text-center text-slate-500">Select a course to manage lessons.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
