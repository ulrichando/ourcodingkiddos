import type { Metadata } from "next";
import Link from "next/link";
import {
  Code2,
  FileCode,
  Terminal,
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
  BookOpen,
  Calendar,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Learn to Code - Interactive Online Coding Classes for Kids",
  description: "Fun, interactive coding courses for ages 7-18. Web development, mobile apps, game design, AI & machine learning, engineering, and robotics. Live classes with expert instructors. Get started for free!",
  keywords: ["coding for kids", "programming classes", "learn to code", "kids coding courses", "online coding school", "HTML for kids", "Python for kids", "JavaScript for kids", "Roblox coding", "AI for kids", "robotics for kids", "game development for kids", "mobile app development for kids"],
  openGraph: {
    title: "Our Coding Kiddos - Turn Your Child Into a Future Coder",
    description: "Fun, interactive coding courses for ages 7-18. From building games in Roblox to creating real websites. Get started for free!",
    url: "https://ourcodingkiddos.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Coding Kiddos - Turn Your Child Into a Future Coder",
    description: "Fun, interactive coding courses for ages 7-18. Get started for free!",
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
                  href="/auth/register"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 shadow-lg"
                >
                  Get Started Free <Play className="w-5 h-5" />
                </Link>
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-6 py-3 text-slate-800 dark:text-slate-200 font-semibold hover:border-purple-200 dark:hover:border-purple-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Browse Programs
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-sm text-slate-600 dark:text-slate-400 justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Free account access
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Pay per program
                </span>
              </div>
            </div>
            <div className="relative max-w-lg w-full mx-auto lg:mx-0">
              <div className="absolute -z-10 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              {/* Kid coding image with code overlay */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop"
                  alt="Kids learning to code"
                  className="rounded-2xl shadow-2xl w-full object-cover"
                />
                {/* Floating code card */}
                <div className="absolute -bottom-4 -left-4 bg-slate-900 rounded-xl p-4 shadow-xl transform hover:scale-105 transition duration-300">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                  </div>
                  <pre className="text-xs font-mono text-green-400">
{`function sayHello() {
  console.log("Hi! 🚀");
}`}
                  </pre>
                </div>
                {/* Fun badge */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform rotate-12">
                  Fun! 🎮
                </div>
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
            {/* Main image - kid with laptop */}
            <img
              src="https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=600&h=450&fit=crop"
              alt="Happy child learning to code on laptop"
              className="rounded-2xl shadow-2xl w-full object-cover"
            />
            {/* Rating card */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400" />
              </div>
              <div>
                <div className="font-bold text-lg text-slate-900 dark:text-slate-100">4.9/5 Rating</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">From 2,000+ parents</div>
              </div>
            </div>
            {/* Fun sticker */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transform -rotate-6">
              100% Fun! ✨
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

      {/* How It Works - Programs */}
      <section id="how-it-works" className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="text-center mb-12 px-2">
            <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              How It Works
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Simple & Flexible</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Create a free account and pay only for the programs you want</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
              <div className="p-7 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Users className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">1. Create Free Account</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Sign up for free and get access to your parent dashboard. Add your students and explore our courses.</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl shadow-lg border border-purple-500 shadow-purple-100 dark:shadow-purple-900/20 bg-white dark:bg-slate-800">
              <div className="h-2 bg-gradient-to-r from-pink-500 to-orange-500" />
              <div className="p-7 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">2. Choose a Program</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Browse our structured programs (6, 12, 18, or 24 sessions). Each program includes live classes and project-based learning.</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
              <div className="p-7 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">3. Start Learning</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Schedule classes, track progress, and watch your child build real coding skills with expert instructors.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 shadow-lg"
            >
              View All Programs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* One-on-One Classes */}
      <section className="py-16 px-4">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  Personalized Learning
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">1-on-1 Private Classes</h2>
                <p className="text-white/90 text-lg mb-6">
                  Want personalized attention for your child? Book private sessions with our expert instructors for customized learning at your own pace.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Customized curriculum based on your child's interests",
                    "Flexible scheduling to fit your family's routine",
                    "Direct feedback and mentorship from instructors",
                    "Accelerated learning with undivided attention",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                      <span className="text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard/parent/class-requests"
                  className="inline-flex items-center gap-2 bg-white text-purple-600 hover:bg-slate-100 font-semibold px-6 py-3 rounded-full"
                >
                  Request 1-on-1 Class <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="w-64 h-64 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center">
                    <Users className="w-24 h-24 text-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kids Love Coding Gallery */}
      <section className="py-16 px-4 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="text-center mb-12 px-2">
            <span className="inline-block bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              Kids Love It! 💖
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Watch Them Code & Create</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Our students building amazing projects every day</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop", alt: "Kids coding together", label: "Teamwork!" },
              { src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop", alt: "Child excited about coding", label: "I did it!" },
              { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop", alt: "Student learning programming", label: "Learning" },
              { src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop", alt: "Young coder at computer", label: "Creating" },
            ].map((img, i) => (
              <div key={i} className="relative group overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-800/90 px-3 py-1 rounded-full text-sm font-semibold text-slate-800 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {img.label} ✨
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
                <p className="text-slate-600 dark:text-slate-400 italic">&quot;{t.text}&quot;</p>
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
            <p className="text-white/90 text-lg">Join thousands of happy families. Create your free account today!</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-white text-purple-600 hover:bg-slate-100 font-semibold px-6 py-3 rounded-full"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-full border border-white/30"
              >
                Browse Programs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
