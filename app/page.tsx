import Link from "next/link";
import { ArrowRight, Play, CheckCircle } from "lucide-react";

const stats = [
  { label: "Happy Students", value: "10,000+" },
  { label: "Courses Completed", value: "500+" },
  { label: "Expert Instructors", value: "50+" },
  { label: "Star Rating", value: "4.9" },
];

const languages = [
  { title: "HTML", description: "Build web page structures", color: "from-orange-400 to-red-400" },
  { title: "CSS", description: "Style beautiful designs", color: "from-sky-400 to-blue-500" },
  { title: "JavaScript", description: "Add interactivity", color: "from-yellow-400 to-amber-500" },
  { title: "Python", description: "Create amazing programs", color: "from-green-400 to-emerald-500" },
  { title: "Roblox", description: "Build your own games", color: "from-pink-400 to-rose-500" },
];

const ageTracks = [
  {
    title: "Young Explorers",
    age: "Ages 7-10",
    copy: "Fun visual coding with games and animations. Big buttons, colorful interface, lots of encouragement!",
    icon: "🎨",
  },
  {
    title: "Junior Developers",
    age: "Ages 11-14",
    copy: "Build real websites and games. Learn HTML, CSS, JavaScript with hands-on projects.",
    icon: "🚀",
  },
  {
    title: "Future Engineers",
    age: "Ages 15-18",
    copy: "Advanced programming, portfolio building, and preparing for tech careers.",
    icon: "💻",
  },
];

const pricing = [
  {
    name: "Free Trial",
    price: "$0",
    period: "/7 days",
    features: ["3 sample lessons", "Code playground access", "Basic support"],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Monthly",
    price: "$29",
    period: "/per month",
    features: ["Unlimited courses", "Live classes included", "Progress tracking", "Certificates", "Priority support"],
    cta: "Get Started",
    highlight: true,
  },
  {
    name: "Family Plan",
    price: "$49",
    period: "/per month",
    features: ["Up to 3 students", "Everything in Monthly", "Family dashboard", "Sibling discounts"],
    cta: "Best Value",
    highlight: false,
  },
];

const testimonials = [
  { quote: "My daughter went from playing games to creating them! The instructors are amazing.", name: "Emma's Mom" },
  { quote: "Best investment in my son's education. He now wants to be a software engineer!", name: "Jake's Dad" },
  { quote: "I built my first website and it's actually live! So cool!", name: "Sophie, age 14" },
];

export default function LandingPage() {
  return (
    <main className="bg-white text-slate-800">
      <section className="bg-gradient-to-r from-[#b155f7] via-[#f973c5] to-[#f97316] px-4">
        <div className="max-w-6xl mx-auto py-12 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-white">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-sm">
              <span className="text-purple-100">#1 Online Coding School for Kids</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              Turn Your Child Into a <span className="text-orange-200">Future Coder</span>
            </h1>
            <p className="text-lg text-white/90">
              Fun, interactive coding courses for ages 7–18. From building games in Roblox to creating real websites
              with HTML, CSS & JavaScript.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-full bg-white text-[#b155f7] font-semibold px-5 py-3 shadow-lg"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/playground"
                className="inline-flex items-center gap-2 rounded-full bg-white/20 text-white font-semibold px-5 py-3 border border-white/30"
              >
                <Play className="w-4 h-4 fill-white" />
                Try Playground
              </Link>
            </div>
            <div className="flex gap-4 text-sm text-white/90">
              <div className="inline-flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> No credit card required
              </div>
              <div className="inline-flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Cancel anytime
              </div>
            </div>
          </div>
          <div className="bg-slate-900 text-slate-100 rounded-3xl shadow-2xl p-6 rotate-[-3deg]">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <pre className="text-sm leading-7 font-mono">
{`function sayHello() {
  console.log("Hello, Coder! 🚀");
}`}
            </pre>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="text-2xl font-black">{stat.value}</div>
              <div className="text-sm text-white/90">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <div className="text-center space-y-2">
          <span className="inline-block text-sm font-semibold text-purple-600 bg-purple-100 rounded-full px-3 py-1">
            What We Teach
          </span>
          <h2 className="text-3xl font-black text-slate-900">Learn Real Programming Languages</h2>
          <p className="text-slate-600">
            Age-appropriate courses designed to make coding fun and engaging.
          </p>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          {languages.map((lang) => (
            <div
              key={lang.title}
              className="bg-white rounded-2xl shadow-md p-5 text-center space-y-2 border border-slate-100"
            >
              <div className={`mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br ${lang.color} flex items-center justify-center text-white text-xl`}>
                {lang.title.slice(0, 1)}
              </div>
              <h3 className="font-semibold text-slate-900">{lang.title}</h3>
              <p className="text-sm text-slate-600">{lang.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
          <div className="grid md:grid-cols-3 gap-4">
            {ageTracks.map((track) => (
              <div key={track.title} className="bg-white rounded-2xl shadow-md p-6 space-y-3 border border-slate-100">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-orange-400" />
                <div className="inline-flex text-xs font-semibold bg-slate-100 rounded-full px-3 py-1">{track.age}</div>
                <h3 className="text-xl font-bold text-slate-900">
                  {track.icon} {track.title}
                </h3>
                <p className="text-sm text-slate-600">{track.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-3">
          <span className="inline-block text-xs font-semibold text-amber-700 bg-amber-100 rounded-full px-3 py-1">
            Why Choose Us
          </span>
          <h2 className="text-3xl font-black text-slate-900">The Best Way for Kids to Learn Coding</h2>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-3"><span className="text-purple-500">⚡</span> Interactive Lessons with hands-on coding</li>
            <li className="flex gap-3"><span className="text-purple-500">🎮</span> Gamified Experience with XP, badges, and certificates</li>
            <li className="flex gap-3"><span className="text-purple-500">🧑‍🏫</span> Expert Instructors guiding every step</li>
            <li className="flex gap-3"><span className="text-purple-500">🛡️</span> Safe, kid-friendly environment</li>
          </ul>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <div className="text-lg font-semibold text-slate-900">4.9/5 Rating</div>
          <p className="text-sm text-slate-600 mb-4">From 2,000+ parents</p>
          <div className="h-40 rounded-2xl bg-gradient-to-r from-purple-200 via-pink-100 to-orange-100"></div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full px-3 py-1">
              Simple Pricing
            </span>
            <h2 className="text-3xl font-black text-slate-900">Invest in Your Child's Future</h2>
            <p className="text-slate-600">Start with a free trial, upgrade when you're ready</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl shadow-md border ${
                  plan.highlight ? "border-purple-400 shadow-purple-100" : "border-slate-100"
                } p-6 space-y-4`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  {plan.highlight && (
                    <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {plan.price} <span className="text-base font-medium text-slate-600">{plan.period}</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="text-emerald-500">✔</span> {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full rounded-full font-semibold py-2 ${
                    plan.highlight
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-white border border-slate-200 text-slate-800"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-block text-xs font-semibold text-amber-700 bg-amber-100 rounded-full px-3 py-1">
            Happy Families
          </span>
          <h2 className="text-3xl font-black text-slate-900">What Parents & Kids Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl shadow-md p-5 space-y-3 border border-slate-100">
              <div className="text-amber-400 text-lg">★★★★★</div>
              <p className="text-slate-700 italic">"{t.quote}"</p>
              <div className="font-semibold text-slate-900">{t.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 text-center space-y-4">
          <h2 className="text-3xl font-black">Ready to Start Your Child's Coding Journey?</h2>
          <p className="text-white/90">Join thousands of happy families. No credit card required.</p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-full bg-white text-purple-600 font-semibold px-6 py-3 shadow-lg"
          >
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
