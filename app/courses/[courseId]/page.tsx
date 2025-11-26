"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import BubbleCard from "../../../components/ui/BubbleCard";
import ProgressBar from "../../../components/ui/ProgressBar";
import Section from "../../../components/ui/Section";

const dummyCourse = {
  title: "JavaScript Quests",
  level: "Beginner",
  description: "Solve playful puzzles and build mini-games while learning JS basics.",
  lessons: [
    { id: "intro", title: "Welcome & Variables", duration: "10m", status: "done" },
    { id: "loops", title: "Loops & Treasure Hunts", duration: "15m", status: "in-progress" },
    { id: "dom", title: "DOM Magic Tricks", duration: "12m", status: "locked" },
  ],
  progress: 42,
};

export default function CoursePage() {
  const params = useParams();
  const courseId = Array.isArray(params?.courseId) ? params.courseId[0] : params?.courseId;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <header className="space-y-1">
          <p className="text-sm text-sky-600 font-semibold uppercase tracking-[0.2em]">Course</p>
          <h1 className="text-3xl font-black">{dummyCourse.title}</h1>
          <p className="text-slate-600">{dummyCourse.description}</p>
          <div className="text-sm text-slate-500 flex gap-3">
            <span>Level: {dummyCourse.level}</span>
            <span>Course ID: {courseId}</span>
          </div>
        </header>

        <Section title="Progress" color="mint">
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <ProgressBar value={dummyCourse.progress} label="Course progress" />
            <BubbleCard title="XP Boost" emoji="💎">
              Finish the next lesson for +50 XP and the Loop Legend badge.
            </BubbleCard>
          </div>
        </Section>

        <Section title="Lessons" subtitle="Short, colorful missions" color="sun">
          <div className="grid gap-3">
            {dummyCourse.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between bg-white border border-amber-100 rounded-xl p-3 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-slate-800">{lesson.title}</p>
                  <p className="text-xs text-slate-500">{lesson.duration} • {lesson.status}</p>
                </div>
                <Link
                  href={`/lessons/${lesson.id}`}
                  className="px-3 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600"
                >
                  Start →
                </Link>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
