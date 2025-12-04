"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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
  Gamepad2,
  GraduationCap,
  Calendar,
  LogIn,
  UserPlus,
  Monitor,
  BookOpen,
  BadgeCheck,
  Target,
  MousePointerClick,
  X,
} from "lucide-react";
import UpcomingClassesSection from "../components/home/UpcomingClassesSection";

// Age groups for course selector
const ageGroups = [
  { id: "young", label: "Ages 5-8", icon: "🎨", color: "from-pink-500 to-rose-500" },
  { id: "kids", label: "Ages 9-12", icon: "🎮", color: "from-violet-500 to-purple-600" },
  { id: "teens", label: "Ages 13-16", icon: "💻", color: "from-blue-500 to-cyan-600" },
  { id: "advanced", label: "Ages 16+", icon: "🚀", color: "from-emerald-500 to-green-600" },
];

// Gamification levels
const levels = [
  { level: 1, name: "Explorer", xp: "0-500", badge: "🌟", color: "bg-emerald-500" },
  { level: 2, name: "Builder", xp: "500-2K", badge: "⚡", color: "bg-blue-500" },
  { level: 3, name: "Creator", xp: "2K-5K", badge: "🔥", color: "bg-violet-500" },
  { level: 4, name: "Innovator", xp: "5K-10K", badge: "💎", color: "bg-pink-500" },
  { level: 5, name: "Master", xp: "10K+", badge: "👑", color: "bg-amber-500" },
];

const features = [
  {
    icon: Gamepad2,
    title: "Learn by Playing",
    description: "Every lesson feels like a game with points, badges, and rewards.",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=300&fit=crop",
  },
  {
    icon: Users,
    title: "Live 1:1 Mentors",
    description: "Real instructors who know each student by name.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop",
  },
  {
    icon: Rocket,
    title: "Build Real Projects",
    description: "Create games, websites, and apps that actually work.",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&h=300&fit=crop",
  },
  {
    icon: Shield,
    title: "Safe Environment",
    description: "Kid-friendly platform with parent dashboards.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
  },
];

const programs = [
  {
    name: "Game Creator",
    icon: Gamepad2,
    ages: "Ages 7-12",
    description: "Build your own video games using Scratch and Python",
    color: "from-violet-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400&h=250&fit=crop",
  },
  {
    name: "Web Developer",
    icon: Globe,
    ages: "Ages 10-16",
    description: "Create real websites with HTML, CSS, and JavaScript",
    color: "from-blue-500 to-cyan-600",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=250&fit=crop",
  },
  {
    name: "App Inventor",
    icon: Smartphone,
    ages: "Ages 12-18",
    description: "Design and launch mobile applications",
    color: "from-emerald-500 to-green-600",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
  },
  {
    name: "AI Explorer",
    icon: Brain,
    ages: "Ages 14-18",
    description: "Discover artificial intelligence and machine learning",
    color: "from-pink-500 to-rose-600",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
  },
];

const testimonials = [
  {
    quote: "My son went from playing games all day to building his own. The transformation is incredible!",
    name: "Sarah M.",
    role: "Parent of Marcus, 12",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    quote: "I built a website for my mom's bakery! She was so proud. Now I want to make apps too.",
    name: "Emma T.",
    role: "Student, Age 14",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
  },
  {
    quote: "The instructors are patient and make coding fun. My daughter actually looks forward to lessons.",
    name: "David K.",
    role: "Parent of Lily, 9",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
];

const studentProjects = [
  {
    name: "Space Shooter",
    creator: "Alex, Age 11",
    description: "A thrilling arcade game where you defend Earth from alien invaders",
    icon: Rocket,
    color: "from-violet-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=250&fit=crop",
  },
  {
    name: "Weather App",
    creator: "Maya, Age 13",
    description: "Real-time weather forecasts with beautiful animations",
    icon: Globe,
    color: "from-blue-500 to-cyan-600",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=250&fit=crop",
  },
  {
    name: "Pet Care Bot",
    creator: "Sam, Age 10",
    description: "An AI chatbot that helps kids learn how to care for pets",
    icon: Brain,
    color: "from-emerald-500 to-green-600",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=250&fit=crop",
  },
  {
    name: "Music Mixer",
    creator: "Jordan, Age 14",
    description: "Create your own beats and melodies with this interactive app",
    icon: Sparkles,
    color: "from-pink-500 to-rose-600",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=250&fit=crop",
  },
];

const stats = [
  { value: "500+", label: "Active Students", icon: Users },
  { value: "98%", label: "Parent Satisfaction", icon: Heart },
  { value: "4.9", label: "Star Rating", icon: Star },
  { value: "50+", label: "Expert Instructors", icon: GraduationCap },
];

// Trust badges - like Tynker
const trustBadges = [
  { name: "STEM.org Certified", icon: BadgeCheck },
  { name: "Award Winning", icon: Trophy },
  { name: "Live 1:1 Classes", icon: Users },
  { name: "Safe & Secure", icon: Shield },
];

export default function HomePage() {
  const [selectedAge, setSelectedAge] = useState("kids");
  const [showVideo, setShowVideo] = useState(false);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-violet-400 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4 text-violet-400" />
                  <p className="text-lg">Video demo would play here</p>
                  <p className="text-sm text-slate-400 mt-2">Add your YouTube/Vimeo embed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-violet-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-violet-950/30">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-300/30 dark:bg-violet-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/30 dark:bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-200/20 dark:bg-cyan-600/5 rounded-full blur-3xl" />

          {/* Floating elements */}
          <div className="absolute top-32 right-20 w-4 h-4 bg-violet-500 rounded-full animate-bounce" style={{ animationDuration: "3s" }} />
          <div className="absolute top-48 left-32 w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
          <div className="absolute bottom-32 left-20 w-5 h-5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDuration: "3.5s", animationDelay: "1s" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6">
              {/* Live Counter Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-violet-200 dark:border-violet-800 shadow-lg">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <span className="text-emerald-600 dark:text-emerald-400">127 students</span> learning right now
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1]">
                Where Kids Learn to{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Code & Create
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 150 2 298 8" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                        <stop stopColor="#7c3aed" />
                        <stop offset="0.5" stopColor="#a855f7" />
                        <stop offset="1" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl">
                Transform screen time into <span className="text-violet-600 dark:text-violet-400 font-bold">dream time</span>.
                Live 1:1 classes with expert instructors. Your child will go from playing games to{" "}
                <span className="text-pink-600 dark:text-pink-400 font-bold">building them</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link
                  href="/auth/register"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-lg shadow-2xl shadow-violet-500/30 transition-all hover:shadow-violet-500/40 hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <Rocket className="w-5 h-5" />
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/auth/login"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-lg hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-lg transition-all"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </Link>
              </div>

              {/* Trust Badges Row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-4">
                {trustBadges.map((badge) => (
                  <div
                    key={badge.name}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium"
                  >
                    <badge.icon className="w-3.5 h-3.5 text-violet-500" />
                    {badge.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Hero Image with Video */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <Image
                  src="https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=800&h=600&fit=crop"
                  alt="Kids learning to code"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/50 via-transparent to-transparent" />

                {/* Play Video Button */}
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <div className="w-24 h-24 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform ring-4 ring-white/50">
                    <Play className="w-10 h-10 text-violet-600 ml-1" />
                  </div>
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-800/90 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-lg">
                    Watch How It Works
                  </span>
                </button>
              </div>

              {/* Floating Card - Live Students */}
              <div className="absolute -left-4 lg:-left-8 top-8 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 animate-float">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs">👧</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs">👦</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs">👧</div>
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">+47</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">500+ Students</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Learning now
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card - Rating */}
              <div className="absolute -right-4 lg:-right-8 bottom-24 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 animate-float" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">4.9/5</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">From 2,000+ happy parents</div>
              </div>

              {/* Floating Achievement */}
              <div className="absolute -bottom-2 left-8 p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-xl animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2 text-white">
                  <Trophy className="w-5 h-5" />
                  <span className="text-xs font-bold">Achievement Unlocked!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}</style>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="relative group">
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-lg hover:-translate-y-1">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-violet-500" />
                  <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Age-Based Course Selector - Like Tynker */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-violet-50 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-sm font-semibold mb-4">
              <Target className="w-4 h-4" /> Find Your Perfect Course
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              How Old Is Your Child?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              We&apos;ll recommend the perfect learning path
            </p>
          </div>

          {/* Age Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {ageGroups.map((age) => (
              <button
                key={age.id}
                onClick={() => setSelectedAge(age.id)}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  selectedAge === age.id
                    ? `bg-gradient-to-br ${age.color} border-transparent text-white shadow-xl scale-105`
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg"
                }`}
              >
                <div className="text-4xl mb-2">{age.icon}</div>
                <div className={`font-bold ${selectedAge === age.id ? "text-white" : "text-slate-900 dark:text-white"}`}>
                  {age.label}
                </div>
              </button>
            ))}
          </div>

          {/* CTA for selected age */}
          <div className="text-center">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <MousePointerClick className="w-5 h-5" />
              See Recommended Courses
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Placement Exam CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 sm:p-12">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-400/20 rounded-full blur-3xl" />

            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-6">
                  <Brain className="w-4 h-4" />
                  Skill Assessment
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                  Not Sure Where to Start?
                </h2>
                <p className="text-lg text-white/90 mb-6">
                  Take our quick placement exam to discover your child&apos;s coding level.
                  Choose between a fun gamified challenge or a classic multiple-choice test!
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                    <span>5-minute assessment</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                    <span>Get personalized course recommendations</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                    <span>Earn a skill certificate</span>
                  </li>
                </ul>
                <Link
                  href="/placement-exam"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-violet-600 font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <Brain className="w-5 h-5" />
                  Take Placement Exam
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="hidden md:flex justify-center">
                <div className="relative">
                  {/* Floating exam preview cards */}
                  <div className="absolute -top-4 -left-8 p-4 rounded-2xl bg-white shadow-xl animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-lg">
                        🎮
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Gamified Mode</div>
                        <div className="text-xs text-slate-500">Fun challenges</div>
                      </div>
                    </div>
                  </div>

                  <div className="w-64 h-64 rounded-3xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center mx-auto mb-4">
                        <Brain className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-white font-bold text-xl">Find Your Level</div>
                      <div className="text-white/70 text-sm mt-1">Beginner → Advanced</div>
                    </div>
                  </div>

                  <div className="absolute -bottom-4 -right-8 p-4 rounded-2xl bg-white shadow-xl animate-float" style={{ animationDelay: "0.5s" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-lg">
                        📝
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Quiz Mode</div>
                        <div className="text-xs text-slate-500">Multiple choice</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Preview - Like CodeMonkey */}
      <section className="py-16 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-4">
              <Trophy className="w-4 h-4" /> Level Up System
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Learning Feels Like a Game
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Earn XP, unlock badges, and level up as you master new coding skills
            </p>
          </div>

          {/* Level Progress Bar */}
          <div className="relative mb-8">
            <div className="flex justify-between items-center">
              {levels.map((level, idx) => (
                <div key={level.level} className="flex flex-col items-center relative z-10">
                  <div className={`w-14 h-14 rounded-full ${level.color} flex items-center justify-center text-2xl shadow-lg border-4 border-white dark:border-slate-900`}>
                    {level.badge}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Lvl {level.level}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{level.name}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Progress line */}
            <div className="absolute top-7 left-7 right-7 h-1 bg-slate-200 dark:bg-slate-700 -z-0">
              <div className="h-full w-1/3 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 rounded-full" />
            </div>
          </div>

          {/* Sample Badges */}
          <div className="flex flex-wrap justify-center gap-4">
            {["First Code 🎯", "Bug Hunter 🐛", "Game Master 🎮", "Web Wizard 🌐", "Speed Coder ⚡"].map((badge) => (
              <div
                key={badge}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Type Selection */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-sm font-semibold mb-4">
              <Rocket className="w-4 h-4" /> Get Started
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Choose Your Path
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Parent Card */}
            <Link href="/auth/register" className="group">
              <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 p-1 hover:shadow-2xl hover:shadow-violet-500/25 transition-all hover:-translate-y-2">
                <div className="h-full rounded-[22px] bg-white dark:bg-slate-900 p-6">
                  <div className="relative h-40 mb-6 rounded-2xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1591035897819-f4bdf739f446?w=400&h=200&fit=crop"
                      alt="Parent helping child code"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-violet-900/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">I&apos;m a Parent</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Register your child and watch them thrive</p>
                  <span className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold group-hover:gap-3 transition-all">
                    Register Now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Student Card */}
            <Link href="/auth/student-login" className="group">
              <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 p-1 hover:shadow-2xl hover:shadow-emerald-500/25 transition-all hover:-translate-y-2">
                <div className="h-full rounded-[22px] bg-white dark:bg-slate-900 p-6">
                  <div className="relative h-40 mb-6 rounded-2xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop"
                      alt="Student coding"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">I&apos;m a Student</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Continue your coding journey</p>
                  <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold group-hover:gap-3 transition-all">
                    Student Login <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Instructor Card */}
            <Link href="/auth/login" className="group">
              <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 p-1 hover:shadow-2xl hover:shadow-blue-500/25 transition-all hover:-translate-y-2">
                <div className="h-full rounded-[22px] bg-white dark:bg-slate-900 p-6">
                  <div className="relative h-40 mb-6 rounded-2xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop"
                      alt="Instructor teaching"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">I&apos;m an Instructor</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Manage classes and inspire coders</p>
                  <span className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all">
                    Instructor Portal <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" /> Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Not Just Lessons. <span className="text-violet-600 dark:text-violet-400">Adventures.</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We built something different - a place where kids actually want to learn.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Classes */}
      <UpcomingClassesSection />

      {/* Programs */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-sm font-semibold mb-4">
              <Code2 className="w-4 h-4" /> Learning Paths
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Choose Your Adventure
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Every path leads to real-world skills. Pick what excites you most.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program) => (
              <Link key={program.name} href="/programs" className="group">
                <div className="h-full overflow-hidden rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:-translate-y-2">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={program.image} alt={program.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${program.color} opacity-60`} />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {program.ages}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center shadow-lg`}>
                        <program.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{program.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{program.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-semibold hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
            >
              View All Programs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Student Projects Showcase */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-sm font-semibold mb-4">
              <Trophy className="w-4 h-4" /> Student Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Built by Kids Like You
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Check out these amazing projects created by our talented students
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentProjects.map((project) => (
              <div
                key={project.name}
                className="group h-full overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-pink-700 transition-all hover:shadow-xl hover:-translate-y-2"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image src={project.image} alt={project.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-60`} />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {project.creator}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg`}>
                      <project.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{project.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{project.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/showcase"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-semibold hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-4">
              <Heart className="w-4 h-4" /> Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Loved by Families
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all"
              >
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-serif">
                  &ldquo;
                </div>
                <div className="flex gap-1 mb-4 pt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-violet-200 dark:border-violet-800">
                    <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-violet-100 dark:from-slate-900 dark:to-violet-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-1">
            <div className="relative rounded-[2.25rem] bg-white dark:bg-slate-900 p-8 sm:p-12 lg:p-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-200/50 to-pink-200/50 dark:from-violet-900/30 dark:to-pink-900/30 rounded-full blur-3xl" />

              <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-sm font-semibold mb-6">
                    <Sparkles className="w-4 h-4" />
                    Now Enrolling for 2025
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                    Start Learning Today!
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                    Join 500+ kids already building games, websites, and apps. Your child&apos;s coding adventure starts here.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link
                      href="/auth/register"
                      className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-lg shadow-xl shadow-violet-500/30 transition-all hover:shadow-2xl hover:-translate-y-1"
                    >
                      <Rocket className="w-5 h-5" />
                      Enroll Now
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/schedule"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Calendar className="w-5 h-5" />
                      Book a Tour
                    </Link>
                  </div>
                </div>

                <div className="relative hidden lg:block">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop"
                      alt="Kids celebrating"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -left-4 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">Achievement Unlocked!</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">First Line of Code</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
