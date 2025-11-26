import Link from "next/link";
import BubbleCard from "../../../components/ui/BubbleCard";
import ProgressBar from "../../../components/ui/ProgressBar";
import Section from "../../../components/ui/Section";

const kids = [
  { id: "maya", name: "Maya", course: "Roblox Studios", progress: 72, nextLesson: "Design an Obby" },
  { id: "alex", name: "Alex", course: "JavaScript Quests", progress: 45, nextLesson: "Loops & Puzzles" },
];

const billing = { plan: "Family Plan", renewal: "Oct 20", amount: "$39/mo" };

export default function ParentDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header className="space-y-2">
          <p className="text-sm text-emerald-600 font-semibold uppercase tracking-[0.2em]">Parent Dashboard</p>
          <h1 className="text-3xl font-black">Great job keeping the learning vibes high!</h1>
          <p className="text-slate-600">Track progress, book sessions, and manage billing.</p>
        </header>

        <Section title="Kid Progress" subtitle="Peek at today’s wins" color="mint">
          <div className="grid md:grid-cols-2 gap-4">
            {kids.map((kid) => (
              <BubbleCard key={kid.id} title={`${kid.name} · ${kid.course}`} emoji="🌈">
                <ProgressBar value={kid.progress} />
                <p className="text-sm text-slate-700">Next up: {kid.nextLesson}</p>
                <Link href={`/dashboard/parent/children/${kid.id}`} className="text-emerald-700 text-sm font-semibold">
                  View details →
                </Link>
              </BubbleCard>
            ))}
          </div>
        </Section>

        <Section title="Billing & Plan" color="sun">
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <BubbleCard title="Current Plan" emoji="📦">
              <p>{billing.plan}</p>
              <p className="text-slate-500">{billing.amount}</p>
            </BubbleCard>
            <BubbleCard title="Next Renewal" emoji="⏰">
              <p>Renews on {billing.renewal}</p>
              <Link href="/billing" className="text-amber-700 font-semibold">Manage billing →</Link>
            </BubbleCard>
            <BubbleCard title="Support" emoji="🧑‍💻">
              <p>Need changes? Message support for schedule swaps.</p>
            </BubbleCard>
          </div>
        </Section>

        <Section title="Bookings" color="sky">
          <div className="flex flex-wrap gap-3 text-sm">
            <BubbleCard title="Maya · Wed 4pm" emoji="📅">
              Roblox feedback with Coach Jay.
            </BubbleCard>
            <BubbleCard title="Alex · Thu 5pm" emoji="📚">
              JS puzzles review with Coach Sam.
            </BubbleCard>
            <Link
              href="/schedule"
              className="px-4 py-3 rounded-xl bg-sky-500 text-white font-semibold shadow hover:bg-sky-600"
            >
              Book another session
            </Link>
          </div>
        </Section>
      </div>
    </main>
  );
}
