"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Code2,
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
  Brain,
  Rocket,
  Heart,
  Trophy,
  Target,
  Lightbulb,
  Gamepad2,
  Palette,
  GraduationCap,
  BookOpen,
  Calendar,
} from "lucide-react";
import UpcomingClassesSection from "../components/home/UpcomingClassesSection";

const journeySteps = [
  { level: 1, title: "Explorer", xp: "0-500 XP", desc: "First lines of code", icon: Rocket, color: "from-emerald-400 to-green-500" },
  { level: 2, title: "Builder", xp: "500-2K XP", desc: "Creating projects", icon: Target, color: "from-blue-400 to-cyan-500" },
  { level: 3, title: "Innovator", xp: "2K-5K XP", desc: "Solving problems", icon: Lightbulb, color: "from-violet-400 to-purple-500" },
  { level: 4, title: "Creator", xp: "5K-10K XP", desc: "Building apps", icon: Palette, color: "from-pink-400 to-rose-500" },
  { level: 5, title: "Master", xp: "10K+ XP", desc: "Teaching others", icon: Trophy, color: "from-amber-400 to-orange-500" },
];

const projectShowcase = [
  { title: "Space Shooter", type: "Game", tech: "Python", student: "Alex, 12", color: "from-violet-500 to-purple-600", emoji: "🚀" },
  { title: "Weather App", type: "Web App", tech: "JavaScript", student: "Emma, 14", color: "from-cyan-500 to-blue-600", emoji: "🌤️" },
  { title: "Pet Care Bot", type: "AI Project", tech: "Python", student: "Mia, 11", color: "from-pink-500 to-rose-600", emoji: "🤖" },
  { title: "Music Mixer", type: "Creative", tech: "Scratch", student: "Jake, 9", color: "from-amber-500 to-orange-600", emoji: "🎵" },
];

const learningPaths = [
  {
    name: "Game Creator",
    icon: Gamepad2,
    color: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50",
    skills: ["Scratch", "Python", "Unity"],
    outcome: "Build your own video games",
    duration: "6 months"
  },
  {
    name: "Web Developer",
    icon: Globe,
    color: "from-blue-500 to-cyan-600",
    bgLight: "bg-blue-50",
    skills: ["HTML", "CSS", "JavaScript"],
    outcome: "Create real websites",
    duration: "4 months"
  },
  {
    name: "App Inventor",
    icon: Smartphone,
    color: "from-emerald-500 to-green-600",
    bgLight: "bg-emerald-50",
    skills: ["React Native", "Firebase"],
    outcome: "Launch mobile apps",
    duration: "5 months"
  },
  {
    name: "AI Explorer",
    icon: Brain,
    color: "from-pink-500 to-rose-600",
    bgLight: "bg-pink-50",
    skills: ["Python", "ML Basics", "ChatGPT"],
    outcome: "Build smart projects",
    duration: "6 months"
  },
];

const stats = [
  { value: "2,500+", label: "Lines of Code Written Daily", icon: Code2 },
  { value: "847", label: "Projects Completed", icon: Rocket },
  { value: "98%", label: "Parent Satisfaction", icon: Heart },
  { value: "4.9", label: "Star Rating", icon: Star },
];

const features = [
  {
    icon: Gamepad2,
    title: "Learn by Playing",
    desc: "Every lesson feels like a game. Points, badges, and rewards keep kids engaged.",
    color: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-100 dark:bg-violet-900/30"
  },
  {
    icon: Users,
    title: "Real Mentors",
    desc: "Not just videos. Live instructors who know each student by name.",
    color: "from-blue-500 to-cyan-600",
    bgLight: "bg-blue-100 dark:bg-blue-900/30"
  },
  {
    icon: Rocket,
    title: "Build Real Things",
    desc: "Projects that actually work. Share with friends and family.",
    color: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-100 dark:bg-amber-900/30"
  },
  {
    icon: Shield,
    title: "Safe & Supportive",
    desc: "Kid-friendly environment with parent dashboards and progress tracking.",
    color: "from-emerald-500 to-green-600",
    bgLight: "bg-emerald-100 dark:bg-emerald-900/30"
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-violet-950/20 pt-8 pb-20 px-4">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200/40 dark:bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-200/40 dark:bg-pink-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Now Enrolling for 2025</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 dark:text-white">
                Where Kids Learn to{" "}
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Code & Create
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl">
                Transform screen time into <span className="text-violet-600 dark:text-violet-400 font-semibold">dream time</span>.
                Your child will go from playing games to <span className="text-pink-600 dark:text-pink-400 font-semibold">making them</span>.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">500+</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Active Students</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">4.9/5</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Parent Rating</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  href="/auth/register"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30"
                >
                  Start Free Today
                  <Rocket className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Explore Programs
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-4 justify-center lg:justify-start text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Free to start
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  No credit card needed
                </span>
              </div>
            </div>

            {/* Right Side - Hero Image / Illustration */}
            <div className="relative">
              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 z-10 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-slate-900 dark:text-white">Web Dev</div>
                    <div className="text-xs text-slate-500">Popular Course</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 z-10 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                    <Gamepad2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-slate-900 dark:text-white">Game Design</div>
                    <div className="text-xs text-slate-500">Kids Love It!</div>
                  </div>
                </div>
              </div>

              {/* Main Card - Code Preview */}
              <div className="relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">my_first_game.py</span>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Running
                  </div>
                </div>

                {/* Code */}
                <div className="p-6 font-mono text-sm">
                  <div className="space-y-2">
                    <div><span className="text-violet-600 dark:text-violet-400">class</span> <span className="text-amber-600 dark:text-amber-400">SpaceShip</span><span className="text-slate-700 dark:text-slate-300">:</span></div>
                    <div className="pl-4"><span className="text-violet-600 dark:text-violet-400">def</span> <span className="text-blue-600 dark:text-cyan-400">__init__</span><span className="text-slate-700 dark:text-slate-300">(self):</span></div>
                    <div className="pl-8"><span className="text-slate-700 dark:text-slate-300">self.</span><span className="text-orange-600 dark:text-orange-400">speed</span> <span className="text-slate-700 dark:text-slate-300">=</span> <span className="text-emerald-600 dark:text-emerald-400">10</span></div>
                    <div className="pl-8"><span className="text-slate-700 dark:text-slate-300">self.</span><span className="text-orange-600 dark:text-orange-400">power</span> <span className="text-slate-700 dark:text-slate-300">=</span> <span className="text-emerald-600 dark:text-emerald-400">100</span></div>
                    <div className="mt-4"><span className="text-violet-600 dark:text-violet-400">def</span> <span className="text-blue-600 dark:text-cyan-400">launch</span><span className="text-slate-700 dark:text-slate-300">(self):</span></div>
                    <div className="pl-4"><span className="text-blue-600 dark:text-cyan-400">print</span><span className="text-slate-700 dark:text-slate-300">(</span><span className="text-emerald-600 dark:text-emerald-400">&quot;Blast off!&quot;</span><span className="text-slate-700 dark:text-slate-300">)</span></div>
                  </div>

                  {/* Output */}
                  <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-500 mb-2">Output:</div>
                    <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <span>Blast off!</span>
                      <span className="text-2xl">🚀</span>
                    </div>
                  </div>
                </div>

                {/* Student Badge */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/40 border border-violet-200 dark:border-violet-800">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">M</div>
                  <span className="text-xs text-violet-700 dark:text-violet-300">Maya, age 11</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Level 3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Journey Path */}
      <section className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-4">
              <Trophy className="w-4 h-4" /> The Coder&apos;s Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Level Up Your Skills
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Every coder starts at Level 1. Watch your child climb the ranks and unlock new abilities.
            </p>
          </div>

          {/* Journey Steps */}
          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-violet-500 to-amber-500 -translate-y-1/2 rounded-full" />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
              {journeySteps.map((step, idx) => (
                <div key={step.level} className="relative group">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:-translate-y-1">
                    {/* Level Badge */}
                    <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Level {step.level}</div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{step.title}</h3>
                      <div className="text-sm text-violet-600 dark:text-violet-400 font-medium mb-1">{step.xp}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{step.desc}</div>
                    </div>
                    {/* Start Here badge */}
                    {idx === 0 && (
                      <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm">
                        Start Here!
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-sm font-semibold mb-4">
              <Target className="w-4 h-4" /> Choose Your Path
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              What Will You Create?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Every path leads to real-world skills. Pick what excites you most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningPaths.map((path) => (
              <Link key={path.name} href="/programs" className="group">
                <div className={`relative h-full ${path.bgLight} dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-700 transition-all overflow-hidden`}>
                  {/* Icon */}
                  <div className={`w-14 h-14 mb-5 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <path.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{path.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{path.outcome}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {path.skills.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-600 dark:text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    {path.duration}
                  </div>

                  {/* Arrow */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Classes Section */}
      <UpcomingClassesSection />

      {/* Student Showcase */}
      <section className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" /> Student Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Made by Kids Like Yours
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Real projects built by our students. Your child could be next.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectShowcase.map((project) => (
              <div key={project.title} className="group">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-700 transition-all">
                  {/* Project Preview */}
                  <div className={`h-36 bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                    <span className="text-5xl">{project.emoji}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300">{project.type}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300">{project.tech}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{project.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">by {project.student}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/showcase"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why We're Different */}
      <section className="py-20 px-4 bg-gradient-to-br from-violet-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-violet-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-sm font-semibold mb-4">
                <Zap className="w-4 h-4" /> The Difference
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Not Just Lessons.
                <span className="block text-violet-600 dark:text-violet-400">Adventures.</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Traditional coding classes are boring. We built something different -
                a place where kids actually <em>want</em> to learn.
              </p>

              <div className="space-y-5">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-4 items-start group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{feature.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-700 transition-all group">
                  <stat.icon className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-4 group-hover:text-violet-500 transition-colors" />
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-4">
              <Heart className="w-4 h-4" /> Happy Families
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              From Our Community
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "My son went from playing Fortnite all day to building his own games. The transformation is incredible!",
                name: "Sarah M.",
                role: "Parent of Marcus, 12",
                avatar: "S"
              },
              {
                quote: "I built a website for my mom's bakery! She was so proud. Now I want to make apps too.",
                name: "Emma T.",
                role: "Student, Age 14",
                avatar: "E"
              },
              {
                quote: "The instructors are patient and make coding fun. My daughter actually looks forward to her lessons.",
                name: "David K.",
                role: "Parent of Lily, 9",
                avatar: "D"
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-5 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-px">
            <div className="relative bg-white dark:bg-slate-900 rounded-[23px] p-10 lg:p-14 text-center">
              <div className="text-5xl mb-5">🚀</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                Ready to Launch?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
                Your child&apos;s coding journey starts with a single click. Join hundreds of families who made the leap.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-lg shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl"
                >
                  Start Free Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/schedule"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  Book a Tour
                </Link>
              </div>
              <p className="mt-6 text-slate-500 dark:text-slate-400 text-sm">
                Free forever plan available. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
