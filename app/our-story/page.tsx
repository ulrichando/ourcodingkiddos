"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Lightbulb,
  Target,
  Users,
  Sparkles,
  Code2,
  GraduationCap,
  Rocket,
  Globe,
  Star,
  Quote,
  Building2,
  Calendar,
  Award,
  CheckCircle2,
  Brain,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/button";

const timeline = [
  {
    year: "2019",
    title: "The Spark",
    description: "While working as a software engineer, Ulrich noticed a significant gap in accessible, quality coding education for kids. He began mentoring young learners on weekends.",
    icon: Lightbulb,
  },
  {
    year: "2021",
    title: "The Vision Takes Shape",
    description: "During the pandemic, Ulrich saw how many children lacked access to quality tech education. He started developing curriculum specifically designed for young learners aged 7-18.",
    icon: Target,
  },
  {
    year: "2023",
    title: "Coding Kiddos is Born",
    description: "Ulrich officially launched Coding Kiddos, combining his software engineering expertise with a passion for education. The first students enrolled and the journey began.",
    icon: Rocket,
  },
  {
    year: "2024",
    title: "Growing Community",
    description: "Coding Kiddos grew to serve over 100 students across multiple countries, with a dedicated team of certified instructors delivering personalized coding education.",
    icon: Globe,
  },
  {
    year: "2025",
    title: "The Future",
    description: "Today, we continue to innovate with interactive learning, gamified experiences, and a mission to make every child a creator of technology, not just a consumer.",
    icon: Star,
  },
];

const values = [
  {
    icon: Heart,
    title: "Kids-First Approach",
    description: "Every decision we make starts with one question: Is this best for the children we serve?",
  },
  {
    icon: Brain,
    title: "Learning Through Play",
    description: "We believe coding should be as fun as playing video games. Our gamified lessons keep kids engaged and excited.",
  },
  {
    icon: Users,
    title: "Inclusive Access",
    description: "Quality coding education should be available to every child, regardless of background or location.",
  },
  {
    icon: Zap,
    title: "Real-World Skills",
    description: "We teach more than syntax—we build problem-solvers, critical thinkers, and future innovators.",
  },
];

const stats = [
  { value: "150+", label: "Students Taught" },
  { value: "5+", label: "Countries Reached" },
  { value: "98%", label: "Parent Satisfaction" },
  { value: "4", label: "Expert Instructors" },
];

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/30">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            From Google Engineer to{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Education Pioneer
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
            The inspiring journey of how one software engineer&apos;s vision to democratize
            coding education for children became a movement empowering thousands of young minds worldwide.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image/Visual */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10 overflow-hidden relative">
              {/* Decorative elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Profile placeholder with gradient */}
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                    <span className="text-7xl font-bold text-white">UA</span>
                  </div>
                  {/* Floating badges */}
                  <div className="absolute -top-4 -right-4 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Google</span>
                  </div>
                  <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Founder & CEO</span>
                  </div>
                </div>
              </div>
              {/* Background decorations */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/30 rounded-full blur-xl" />
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/30 rounded-full blur-xl" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm font-semibold">
              <Building2 className="w-4 h-4" />
              Software Engineer at Google
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Meet Ulrich Ando
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                As a software engineer at Google, Ulrich Ando witnessed firsthand how technology
                was transforming every industry. But he also noticed something troubling: the next
                generation wasn&apos;t being prepared to lead this transformation—they were merely
                being taught to consume technology, not create it.
              </p>
              <p>
                &ldquo;I saw kids spending hours on devices, but very few understood how those
                devices actually worked,&rdquo; Ulrich recalls. &ldquo;I knew that coding literacy
                would be as essential as reading and writing in their futures. Yet quality coding
                education was either too expensive or too boring for most families.&rdquo;
              </p>
              <p>
                Drawing from his experience building products used by millions at Google, Ulrich
                set out to create something different: a coding school that makes learning to
                code as fun as playing video games, accessible to families everywhere, and
                effective in building real-world skills.
              </p>
            </div>

            {/* Quote */}
            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800/50">
              <Quote className="absolute top-4 left-4 w-8 h-8 text-purple-300 dark:text-purple-700" />
              <p className="text-lg italic text-slate-700 dark:text-slate-300 pl-8">
                &ldquo;Every child deserves the chance to be a creator, not just a consumer of technology.
                At Coding Kiddos, we&apos;re building the innovators, problem-solvers, and leaders of tomorrow.&rdquo;
              </p>
              <p className="mt-4 font-semibold text-purple-600 dark:text-purple-400 pl-8">
                — Ulrich Ando, Founder & CEO
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Coding Matters Section */}
      <section className="bg-white dark:bg-slate-800/50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Coding Education Matters
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              In 2025, coding is no longer optional—it&apos;s essential. Here&apos;s why Ulrich
              believes every child should learn to code.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800/50">
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Problem Solving</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Coding teaches kids to break complex problems into manageable steps—a skill for life.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-2xl p-6 border border-pink-200 dark:border-pink-800/50">
              <div className="w-12 h-12 rounded-xl bg-pink-500 flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Creativity</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                From games to apps, coding turns imagination into reality through digital creation.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/50">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Future Ready</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Over 3.5 million STEM jobs will need workers with coding skills by 2025.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800/50">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Confidence</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Building projects boosts self-esteem and shows kids they can create anything.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Source: Over 90% of U.S. parents believe coding should be part of school curricula —
              <a href="https://www.idtech.com/blog/5-reasons-your-child-should-learn-to-code" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline ml-1">
                iD Tech Research, 2025
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Our Journey
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            From a weekend volunteer project to a global education platform
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-500 hidden md:block" />

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <div key={item.year} className={`relative flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                {/* Content */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-bold mb-3">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                </div>

                {/* Icon */}
                <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center shadow-lg hidden md:flex">
                  <item.icon className="w-6 h-6 text-white" />
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block md:w-5/12" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gradient-to-br from-purple-600 to-pink-600 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-white/80">
              The principles that guide everything we do at Coding Kiddos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{value.title}</h3>
                <p className="text-sm text-white/80">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join Us on This Mission
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Be part of a community that&apos;s shaping the next generation of creators, innovators, and problem-solvers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 h-12">
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 h-12">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
