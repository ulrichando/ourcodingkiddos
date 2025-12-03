import type { Metadata } from "next";
import Link from "next/link";
import {
  Code2,
  Palette,
  FileCode,
  Terminal,
  Gamepad2,
  Play,
  Star,
  Users,
  Award,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Globe,
  Smartphone,
  Joystick,
  Brain,
  Wrench,
  Bot,
  Briefcase,
  FileText,
  GraduationCap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Learn to Code - Interactive Online Coding Classes for Kids",
  description: "Fun, interactive coding courses for ages 7-18. Web development, mobile apps, game design, AI & machine learning, engineering, and robotics. Live classes with expert instructors. Start your free trial today!",
  keywords: ["coding for kids", "programming classes", "learn to code", "kids coding courses", "online coding school", "HTML for kids", "Python for kids", "JavaScript for kids", "Roblox coding", "AI for kids", "robotics for kids", "game development for kids", "mobile app development for kids"],
  openGraph: {
    title: "Our Coding Kiddos - Turn Your Child Into a Future Coder",
    description: "Fun, interactive coding courses for ages 7-18. From building games in Roblox to creating real websites. Start free trial!",
    url: "https://ourcodingkiddos.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Coding Kiddos - Turn Your Child Into a Future Coder",
    description: "Fun, interactive coding courses for ages 7-18. Start your free trial today!",
  },
};

const categories = [
  { name: "Web Development", icon: Globe, color: "from-indigo-400 to-blue-500", description: "Build websites with HTML, CSS & JavaScript" },
  { name: "Mobile Development", icon: Smartphone, color: "from-pink-400 to-rose-500", description: "Create apps for phones & tablets" },
  { name: "Game Development", icon: Joystick, color: "from-emerald-400 to-green-500", description: "Design and code your own games" },
  { name: "AI & Machine Learning", icon: Brain, color: "from-purple-400 to-violet-500", description: "Explore artificial intelligence" },
  { name: "Engineering", icon: Wrench, color: "from-slate-400 to-gray-500", description: "Learn problem-solving skills" },
  { name: "Robotics", icon: Bot, color: "from-cyan-400 to-teal-500", description: "Program robots and automation" },
];

// Technologies vary based on market demand - these are current in-demand skills
const technologies = [
  { name: "React", icon: Code2, color: "from-cyan-400 to-blue-500", description: "Build modern web apps" },
  { name: "Next.js", icon: Globe, color: "from-slate-600 to-slate-800", description: "Full-stack React framework" },
  { name: "TypeScript", icon: FileCode, color: "from-blue-500 to-indigo-600", description: "Type-safe JavaScript" },
  { name: "Python", icon: Terminal, color: "from-green-400 to-emerald-500", description: "AI & data science" },
  { name: "Node.js", icon: Terminal, color: "from-lime-400 to-green-500", description: "Server-side JavaScript" },
];

const testimonials = [
  { name: "Emma's Mom", text: "My daughter went from playing games to creating them! The instructors are amazing.", rating: 5 },
  { name: "Jake's Dad", text: "Best investment in my son's education. He now wants to be a software engineer!", rating: 5 },
  { name: "Sophie, age 14", text: "I built my first website and it's actually live! So cool!", rating: 5 },
];

const stats = [
  { value: "100+", label: "Happy Students" },
  { value: "500+", label: "Courses Completed" },
  { value: "50+", label: "Expert Instructors" },
  { value: "4.9", label: "Star Rating" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Hero */}
      <section className="pt-20 md:pt-24 pb-14 px-4 overflow-hidden">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-semibold mb-5">
                <Sparkles className="w-3 h-3" /> #1 Online Coding School for Kids
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight mb-5">
                Turn Your Child Into a{" "}
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                  Future Coder
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Fun, interactive coding courses for ages 7-18. From building games in Roblox to creating real websites
                with HTML, CSS & JavaScript.
              </p>
              <div className="flex flex-wrap gap-4 mb-6 justify-center lg:justify-start">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 shadow-lg"
                >
                  Start Free Trial <Play className="w-5 h-5" />
                </Link>
                <Link
                  href="/playground"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-6 py-3 text-slate-800 dark:text-slate-200 font-semibold hover:border-purple-200 dark:hover:border-purple-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Try Playground
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-sm text-slate-600 dark:text-slate-400 justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" /> No credit card required
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Cancel anytime
                </span>
              </div>
            </div>
            <div className="relative max-w-md w-full mx-auto lg:mx-0">
              <div className="absolute -z-10 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <div className="relative bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <pre className="text-xs sm:text-sm font-mono leading-7 text-white">
{`function sayHello() {
  console.log("Hello, Coder! 🚀");
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">
        <div className="max-w-6xl lg:max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-white/85">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="courses" className="py-16 px-4">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="text-center mb-12 px-2">
            <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              What We Teach
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Explore Our Course Categories</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">From web development to robotics - discover your passion in tech</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
            {categories.map((cat) => (
              <Link key={cat.name} href="/courses">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-slate-100 dark:border-slate-700">
                  <div className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}
                    >
                      <cat.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">{cat.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{cat.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* In-Demand Technologies */}
          <div className="text-center mb-10 px-2">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              In-Demand Technologies
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Learn What the Market Demands</h2>
            <p className="text-slate-600 dark:text-slate-400">Stay ahead with the most sought-after programming skills in the industry</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {technologies.map((tech) => (
              <Link key={tech.name} href="/courses">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-slate-100 dark:border-slate-700">
                  <div className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${tech.color} flex items-center justify-center`}
                    >
                      <tech.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">{tech.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{tech.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Age Groups */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="text-center mb-12 px-2">
            <span className="inline-block bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              For Every Age
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Courses Designed for Your Child</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { age: "7-10", title: "Young Explorers", desc: "Fun visual coding with games and animations. Big buttons, colorful interface, lots of encouragement!", emoji: "🎨" },
              { age: "11-14", title: "Junior Developers", desc: "Build real websites and games. Learn HTML, CSS, JavaScript with hands-on projects.", emoji: "🚀" },
              { age: "15-18", title: "Future Engineers", desc: "Advanced programming, portfolio building, and preparing for tech careers.", emoji: "💻" },
            ].map((group) => (
              <div key={group.title} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition border border-slate-100 dark:border-slate-700">
                <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400" />
                <div className="p-8 space-y-3">
                  <div className="text-5xl">{group.emoji}</div>
                  <span className="inline-block text-xs font-semibold border border-slate-200 dark:border-slate-600 rounded-full px-3 py-1 text-slate-700 dark:text-slate-300">
                    Ages {group.age}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{group.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{group.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl lg:max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              Why Choose Us
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">The Best Way for Kids to Learn Coding</h2>
            <div className="space-y-5">
              {[
                { icon: Zap, title: "Interactive Lessons", desc: "Learn by doing with our in-browser code editor" },
                { icon: Award, title: "Gamified Experience", desc: "Earn XP, badges, and level up as you learn" },
                { icon: Users, title: "Expert Instructors", desc: "Live classes with passionate teachers" },
                { icon: Shield, title: "Safe Environment", desc: "Kid-friendly platform with parental controls" },
                { icon: Clock, title: "Flexible Learning", desc: "Self-paced courses + scheduled live classes" },
              ].map((feat) => (
                <div key={feat.title} className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    <feat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{feat.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800"
              alt="Kids coding"
              className="rounded-2xl shadow-2xl w-full object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400" />
              </div>
              <div>
                <div className="font-bold text-lg text-slate-900 dark:text-slate-100">4.9/5 Rating</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">From 2,000+ parents</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Prep */}
      <section className="py-16 px-4 bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="text-center mb-12 px-2">
            <span className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              Career Ready
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Prepare for Your Future</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">We don't just teach coding - we prepare students for real careers in tech</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/courses">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-slate-100 dark:border-slate-700 h-full">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">Resume Building</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Learn to write professional tech resumes that get noticed by recruiters</p>
                </div>
              </div>
            </Link>
            <Link href="/courses">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-slate-100 dark:border-slate-700 h-full">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">Portfolio Development</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Build an impressive portfolio to showcase your coding projects</p>
                </div>
              </div>
            </Link>
            <Link href="/courses">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-slate-100 dark:border-slate-700 h-full">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">Interview Skills</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Practice technical interviews and prepare for your first tech role</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="text-center mb-12 px-2">
            <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              Simple Pricing
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Invest in Your Child's Future</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Start with a free trial, upgrade when you're ready</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Free Trial",
                price: "$0",
                period: "/7 days",
                features: ["3 sample lessons", "Code playground access", "Basic support"],
                cta: "Start Free",
                popular: false,
              },
              {
                name: "Monthly",
                price: "$29",
                period: "/per month",
                features: ["Unlimited courses", "Live classes included", "Progress tracking", "Certificates", "Priority support"],
                cta: "Get Started",
                popular: true,
              },
              {
                name: "Family Plan",
                price: "$49",
                period: "/per month",
                features: ["Up to 3 students", "Everything in Monthly", "Family dashboard", "Sibling discounts"],
                cta: "Best Value",
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-2xl shadow-lg border ${
                  plan.popular ? "border-purple-500 shadow-purple-100 dark:shadow-purple-900/20 scale-[1.02]" : "border-slate-200 dark:border-slate-700"
                } bg-white dark:bg-slate-800`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-7 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">{plan.price}</span>
                      <span className="text-slate-500 dark:text-slate-400">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/auth/login"
                    className={`w-full inline-flex justify-center items-center rounded-md px-3 py-2 text-sm font-semibold ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                        : "border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              Happy Families
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">What Parents & Kids Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6 space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="h-5 w-5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 italic">"{t.text}"</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-12 text-white shadow-2xl space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">Ready to Start Your Child's Coding Journey?</h2>
            <p className="text-white/90 text-lg">Join thousands of happy families. No credit card required.</p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 bg-white text-purple-600 hover:bg-slate-100 font-semibold px-6 py-3 rounded-full"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
