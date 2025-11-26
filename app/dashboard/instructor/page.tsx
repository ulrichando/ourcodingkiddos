import Link from "next/link";
import BubbleCard from "../../../components/ui/BubbleCard";
import Section from "../../../components/ui/Section";

const classes = [
  { id: "roblox-101", title: "Roblox 101", students: 12, nextSession: "Thu · 4pm" },
  { id: "js-quests", title: "JavaScript Quests", students: 9, nextSession: "Fri · 3pm" },
];

const inbox = [
  { kid: "Maya", topic: "Project feedback", time: "1h ago" },
  { kid: "Alex", topic: "Reschedule request", time: "3h ago" },
];

export default function InstructorDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-sky-50 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header className="space-y-2">
          <p className="text-sm text-purple-600 font-semibold uppercase tracking-[0.2em]">Instructor Dashboard</p>
          <h1 className="text-3xl font-black">Hello, Coach!</h1>
          <p className="text-slate-600">Manage your classes, sessions, and student progress.</p>
        </header>

        <Section title="Your Classes" color="grape">
          <div className="grid md:grid-cols-2 gap-4">
            {classes.map((c) => (
              <BubbleCard key={c.id} title={c.title} emoji="📘">
                <p className="text-sm text-slate-700">Students: {c.students}</p>
                <p className="text-sm text-slate-700">Next: {c.nextSession}</p>
                <Link href={`/dashboard/instructor/courses/${c.id}`} className="text-purple-700 font-semibold text-sm">
                  Manage lessons →
                </Link>
              </BubbleCard>
            ))}
          </div>
        </Section>

        <Section title="Inbox" subtitle="Questions & feedback requests" color="sun">
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {inbox.map((item) => (
              <BubbleCard key={item.kid + item.topic} title={item.kid} emoji="💌">
                <p>{item.topic}</p>
                <p className="text-slate-500">{item.time}</p>
              </BubbleCard>
            ))}
          </div>
        </Section>

        <Section title="Upcoming Sessions" color="sky">
          <div className="flex flex-wrap gap-3 text-sm items-center">
            <BubbleCard title="Today · 4pm" emoji="⏰">
              Roblox 101 · Group
            </BubbleCard>
            <BubbleCard title="Tomorrow · 3pm" emoji="🎯">
              JavaScript Quests · 1:1
            </BubbleCard>
            <Link
              href="/schedule"
              className="px-4 py-3 rounded-xl bg-sky-500 text-white font-semibold shadow hover:bg-sky-600"
            >
              Adjust schedule
            </Link>
          </div>
        </Section>
      </div>
    </main>
  );
}
