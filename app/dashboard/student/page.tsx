import Link from "next/link";
import { ArrowRight } from "lucide-react";

const startCourses = [
  { id: "html-fun", title: "HTML Basics for Kids", xp: 500, level: "beginner", age: "Ages 7-10", color: "from-orange-400 to-pink-500" },
  { id: "css-magic", title: "CSS Magic: Style Your Pages", xp: 500, level: "beginner", age: "Ages 7-10", color: "from-sky-400 to-blue-500" },
  { id: "js-quests", title: "JavaScript Adventures", xp: 750, level: "beginner", age: "Ages 11-14", color: "from-amber-400 to-orange-500" },
];

const summary = [
  { label: "Lessons Done", value: 0 },
  { label: "Quizzes Passed", value: 0 },
  { label: "Day Streak", value: 0 },
  { label: "Badges Earned", value: 0 },
];

export default function StudentDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#40136f] via-[#4f1f9b] to-[#3a0f5f] text-white">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80">Hey, Coder!</p>
            <div className="inline-flex items-center gap-2 text-xs bg-white/10 px-3 py-1 rounded-full">
              🔥 <span>0 day streak</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Parent View</p>
            <p className="text-xs text-white/60">0 XP</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl border border-white/10 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Current Level</p>
              <h2 className="text-2xl font-bold">Level 1</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Next Level In</p>
              <p className="text-lg font-bold">500 XP</p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-white/60" style={{ width: "0%" }} />
          </div>
          <div className="flex justify-between text-xs text-white/70">
            <span>0 XP</span>
            <span>500 XP</span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">My Badges</h3>
            <Link href="/dashboard/student" className="text-xs flex items-center gap-1 text-white/80">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="text-sm text-white/70 text-center py-6 border border-dashed border-white/20 rounded-xl">
            No badges yet. Complete lessons and quizzes to earn badges!
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">⚡ Start Something New</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {startCourses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="rounded-2xl overflow-hidden shadow-lg border border-white/10"
              >
                <div className={`h-24 bg-gradient-to-r ${course.color}`} />
                <div className="bg-white text-slate-900 p-3 space-y-2">
                  <h4 className="font-semibold text-sm">{course.title}</h4>
                  <div className="flex gap-2 text-[11px] text-slate-600">
                    <span className="px-2 py-1 rounded-full bg-slate-100">{course.level}</span>
                    <span className="px-2 py-1 rounded-full bg-slate-100">{course.age}</span>
                  </div>
                  <p className="text-xs text-amber-500 font-semibold">★ {course.xp} XP</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-3">
          {summary.map((item) => (
            <div key={item.label} className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{item.value}</div>
              <div className="text-xs text-white/80">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
