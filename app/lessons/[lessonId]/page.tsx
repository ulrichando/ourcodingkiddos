"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import BubbleCard from "../../../components/ui/BubbleCard";
import Section from "../../../components/ui/Section";

const lessonData = {
  title: "Loops & Treasure Hunts",
  goal: "Use for-loops to collect treasure in a mini-game.",
  content: [
    "A loop repeats a set of steps.",
    "Use for (let i = 0; i < 5; i++) to repeat 5 times.",
    "Keep score with a variable and celebrate wins!",
  ],
  tasks: [
    "Add a for-loop that runs 5 times.",
    "Collect 3 treasures and log the score.",
    "Bonus: Add a sound effect when treasure is found.",
  ],
};

export default function LessonPage() {
  const params = useParams();
  const lessonId = Array.isArray(params?.lessonId) ? params.lessonId[0] : params?.lessonId;

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-purple-50 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <header className="space-y-1">
          <p className="text-sm text-amber-600 font-semibold uppercase tracking-[0.2em]">Lesson</p>
          <h1 className="text-3xl font-black">{lessonData.title}</h1>
          <p className="text-slate-600">{lessonData.goal}</p>
          <p className="text-xs text-slate-500">Lesson ID: {lessonId}</p>
        </header>

        <Section title="Story" color="sun">
          <div className="space-y-2 text-sm">
            {lessonData.content.map((line, idx) => (
              <p key={idx}>• {line}</p>
            ))}
          </div>
        </Section>

        <Section title="Your Tasks" color="sky">
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
            {lessonData.tasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ol>
        </Section>

        <Section title="Quick Actions" color="mint">
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <BubbleCard title="Open Sandbox" emoji="🧪">
              Jump into the code sandbox to try loops.
            </BubbleCard>
            <BubbleCard title="Take Quiz" emoji="🎯">
              Check your understanding with 5 quick questions.
            </BubbleCard>
            <BubbleCard title="Ask for Help" emoji="🤝">
              Ping your instructor or drop a message in chat.
            </BubbleCard>
          </div>
          <div className="flex gap-3">
            <Link
              href="/schedule"
              className="px-4 py-3 rounded-xl bg-purple-500 text-white font-semibold shadow hover:bg-purple-600"
            >
              Book a 1:1
            </Link>
            <Link
              href="/courses/js-quests"
              className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Back to course
            </Link>
          </div>
        </Section>
      </div>
    </main>
  );
}
