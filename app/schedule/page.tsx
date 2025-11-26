import Link from "next/link";
import BubbleCard from "../../components/ui/BubbleCard";
import Section from "../../components/ui/Section";
import ClassCalendar from "../../components/ui/ClassCalendar";

const slots = [
  { id: "mon-4", label: "Mon · 4:00 PM", coach: "Coach Alex", type: "1:1" },
  { id: "tue-5", label: "Tue · 5:00 PM", coach: "Coach Jay", type: "Group" },
  { id: "wed-6", label: "Wed · 6:00 PM", coach: "Coach Sam", type: "1:1" },
];

const upcoming = [
  {
    id: "evt-1",
    day: "Mon, Nov 3",
    time: "4:00–4:30 PM",
    title: "Roblox 101 · Obby Design",
    instructor: "Coach Alex",
    meetLink: "https://meet.google.com/rob-101-join",
  },
  {
    id: "evt-2",
    day: "Tue, Nov 4",
    time: "5:00–5:45 PM",
    title: "JavaScript Quests · Loops Lab",
    instructor: "Coach Jay",
    meetLink: "https://meet.google.com/js-quests",
  },
  {
    id: "evt-3",
    day: "Thu, Nov 6",
    time: "6:00–6:30 PM",
    title: "Python Puzzles · Functions",
    instructor: "Coach Sam",
    meetLink: "https://meet.google.com/py-puzzles",
  },
];

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <header className="space-y-1">
          <p className="text-sm text-sky-600 font-semibold uppercase tracking-[0.2em]">Schedule</p>
          <h1 className="text-3xl font-black">Book a class</h1>
          <p className="text-slate-600">Pick a time that fits your kiddo. Parents confirm the booking.</p>
        </header>

        <Section title="Recommended Slots" color="sun">
          <div className="grid md:grid-cols-2 gap-3">
            {slots.map((slot) => (
              <BubbleCard key={slot.id} title={slot.label} emoji="📅">
                <p className="text-sm text-slate-700">{slot.coach} · {slot.type}</p>
                <button className="mt-2 px-3 py-2 rounded-lg bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600">
                  Reserve
                </button>
              </BubbleCard>
            ))}
          </div>
        </Section>

        <Section title="Your Calendar" subtitle="Join live classes via Google Meet" color="grape">
          <ClassCalendar events={upcoming} />
        </Section>

        <Section title="Need a different time?" color="mint">
          <p className="text-sm text-slate-700">Tell us your preferred days and times. We’ll match an instructor.</p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-3 rounded-xl bg-white border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50">
              Morning slots
            </button>
            <button className="px-4 py-3 rounded-xl bg-white border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50">
              Afternoon slots
            </button>
            <button className="px-4 py-3 rounded-xl bg-white border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50">
              Weekend slots
            </button>
            <Link
              href="/dashboard/parent/bookings"
              className="px-4 py-3 rounded-xl bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600"
            >
              Manage bookings
            </Link>
          </div>
        </Section>
      </div>
    </main>
  );
}
