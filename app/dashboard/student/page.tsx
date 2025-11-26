import Link from "next/link";
import BubbleCard from "../../../components/ui/BubbleCard";
import ProgressBar from "../../../components/ui/ProgressBar";
import Section from "../../../components/ui/Section";
import ClassCalendar from "../../../components/ui/ClassCalendar";

const courses = [
  { id: "html-fun", title: "HTML Funhouse", progress: 65, badge: "🎨" },
  { id: "js-quests", title: "JavaScript Quests", progress: 30, badge: "🧩" },
  { id: "python-puzzles", title: "Python Puzzles", progress: 10, badge: "🐍" },
];

const badges = ["⭐ Starter", "🐞 Bug Squasher", "🚀 Rocket Ready"];
const upcoming = [
  {
    id: "evt-1",
    day: "Today",
    time: "4:00–4:30 PM",
    title: "Roblox 101 · Obby Design",
    instructor: "Coach Alex",
    meetLink: "https://meet.google.com/rob-101-join",
  },
  {
    id: "evt-2",
    day: "Tomorrow",
    time: "5:00–5:45 PM",
    title: "JavaScript Quests · Loops Lab",
    instructor: "Coach Jay",
    meetLink: "https://meet.google.com/js-quests",
  },
];

export default function StudentDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm text-sky-600 font-semibold uppercase tracking-[0.2em]">Student Dashboard</p>
          <h1 className="text-3xl font-black">Welcome back, Kiddo!</h1>
          <p className="text-slate-600">Keep your streak going. Small steps = big wins.</p>
        </header>

        <Section title="Your Courses" subtitle="Pick up where you left off" color="sky">
          <div className="grid md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <BubbleCard key={course.id} title={course.title} emoji={course.badge}>
                <ProgressBar value={course.progress} />
                <Link href={`/courses/${course.id}`} className="text-sky-700 font-semibold text-sm hover:underline">
                  Open course →
                </Link>
              </BubbleCard>
            ))}
          </div>
        </Section>

        <Section title="Today’s Quick Wins" color="sun">
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <BubbleCard title="Finish Lesson 3" emoji="⏱️">
              Knock out the HTML colors challenge in 10 minutes.
            </BubbleCard>
            <BubbleCard title="Earn XP" emoji="💎">
              Score +50 XP by completing the quiz without hints.
            </BubbleCard>
            <BubbleCard title="Book a Session" emoji="📅">
              Chat with Coach Alex for project feedback.
            </BubbleCard>
          </div>
        </Section>

        <Section title="Badges" color="mint">
          <div className="flex flex-wrap gap-2 text-sm">
            {badges.map((b) => (
              <span
                key={b}
                className="px-3 py-2 rounded-full bg-white border border-emerald-200 text-emerald-700 shadow-sm"
              >
                {b}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Your Calendar" subtitle="Join classes on Google Meet" color="sun">
          <ClassCalendar events={upcoming} />
        </Section>
      </div>
    </main>
  );
}
