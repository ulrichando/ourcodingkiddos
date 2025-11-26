import Link from "next/link";
import BubbleCard from "../components/ui/BubbleCard";
import Section from "../components/ui/Section";

const featureCards = [
  { title: "HTML & CSS Adventures", emoji: "🎨", text: "Build colorful pages and playful layouts." },
  { title: "JavaScript Journeys", emoji: "🧠", text: "Make buttons dance and games come alive." },
  { title: "Python Puzzles", emoji: "🐍", text: "Solve friendly challenges and mini quests." },
  { title: "Roblox Studios", emoji: "🕹️", text: "Create worlds to explore with friends." },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        <header className="flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1 space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-600 font-semibold">Our Coding Kiddos</p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              A fun coding playground for kids <span className="text-sky-500">7–18</span>
            </h1>
            <p className="text-lg text-slate-700">
              Safe, guided courses with friendly instructors, XP, badges, and projects parents can be proud of.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/auth/register"
                className="bg-sky-500 text-white px-5 py-3 rounded-full font-semibold shadow hover:bg-sky-600"
              >
                Start a Parent Account
              </Link>
              <Link
                href="/courses/intro"
                className="bg-white border border-sky-200 text-sky-700 px-5 py-3 rounded-full font-semibold hover:bg-sky-50"
              >
                Browse Courses
              </Link>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">🏆</span>
              <p>Trusted by parents — progress dashboards, certificates, and playful learning.</p>
            </div>
          </div>
          <div className="flex-1">
            <Section title="Today’s Wins" subtitle="Kids are shipping projects right now!" color="sky">
              <ul className="space-y-2 text-sm">
                <li>🌟 Maya published a Roblox obby level.</li>
                <li>🧠 Alex solved 3 JavaScript puzzles.</li>
                <li>🎨 Sam styled a rainbow landing page.</li>
                <li>🏅 Priya earned the “Bug Squasher” badge.</li>
              </ul>
            </Section>
          </div>
        </header>

        <Section title="Courses that feel like adventures" subtitle="Short lessons, quick wins, lots of color." color="sun">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featureCards.map((card) => (
              <BubbleCard key={card.title} title={card.title} emoji={card.emoji}>
                <p>{card.text}</p>
                <p className="text-xs text-slate-500">+ XP, badges, and certificates</p>
              </BubbleCard>
            ))}
          </div>
        </Section>

        <Section title="Why parents love us" color="mint">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <BubbleCard title="Parent Dashboard" emoji="📊">
              Track progress, bookings, and billing in one place.
            </BubbleCard>
            <BubbleCard title="Safe & Guided" emoji="🛡️">
              Vetted instructors, gentle guardrails, and live support.
            </BubbleCard>
            <BubbleCard title="Future-Ready Skills" emoji="🚀">
              From web basics to game dev — kids build a real portfolio.
            </BubbleCard>
          </div>
        </Section>

        <Section title="Ready to play with code?" color="grape">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-bold">Pick a course, book a slot, and watch the magic.</h3>
              <p className="text-slate-700">
                Start free with the first lesson. Keep going with monthly plans parents control.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/schedule"
                className="bg-emerald-500 text-white px-5 py-3 rounded-full font-semibold shadow hover:bg-emerald-600"
              >
                Book a Class
              </Link>
              <Link
                href="/auth/login"
                className="bg-white border border-emerald-200 text-emerald-700 px-5 py-3 rounded-full font-semibold hover:bg-emerald-50"
              >
                Parent Login
              </Link>
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
