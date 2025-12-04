import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Clock, Users, BookOpen, Star, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Learning Programs - Structured Coding Courses for Kids",
  description: "Explore our structured learning programs designed for kids ages 7-18. One-time payment, expert instructors, live sessions. Python, Web Development, Roblox, and more.",
  keywords: ["coding programs for kids", "structured coding courses", "kids programming", "learn to code", "coding bootcamp for kids"],
  openGraph: {
    title: "Learning Programs - Our Coding Kiddos",
    description: "Structured learning programs with live instruction. One-time payment, no subscriptions.",
    url: "https://ourcodingkiddos.com/programs",
    type: "website",
  },
};

const ageGroupLabels: Record<string, string> = {
  AGES_7_10: "Ages 7-10",
  AGES_11_14: "Ages 11-14",
  AGES_15_18: "Ages 15-18",
};

const languageLabels: Record<string, string> = {
  HTML: "HTML & CSS",
  CSS: "CSS",
  JAVASCRIPT: "JavaScript",
  PYTHON: "Python",
  ROBLOX: "Roblox Studio",
  AI_ML: "AI & Machine Learning",
  GAME_DEVELOPMENT: "Game Development",
  WEB_DEVELOPMENT: "Web Development",
  MOBILE_DEVELOPMENT: "Mobile Apps",
  ROBOTICS: "Robotics",
  ENGINEERING: "Engineering",
  CAREER_PREP: "Career Prep",
};

const languageColors: Record<string, string> = {
  HTML: "from-orange-500 to-red-500",
  CSS: "from-blue-400 to-blue-600",
  JAVASCRIPT: "from-yellow-400 to-orange-500",
  PYTHON: "from-blue-500 to-green-500",
  ROBLOX: "from-red-500 to-red-700",
  AI_ML: "from-purple-500 to-indigo-600",
  GAME_DEVELOPMENT: "from-green-500 to-teal-500",
  WEB_DEVELOPMENT: "from-cyan-500 to-blue-500",
  MOBILE_DEVELOPMENT: "from-pink-500 to-rose-500",
  ROBOTICS: "from-gray-500 to-slate-600",
  ENGINEERING: "from-amber-500 to-orange-600",
  CAREER_PREP: "from-violet-500 to-purple-600",
};

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

async function getPrograms() {
  const programs = await prisma.program.findMany({
    where: { isPublished: true },
    include: {
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: [{ isFeatured: "desc" }, { orderIndex: "asc" }, { createdAt: "desc" }],
  });
  return programs;
}

export default async function ProgramsPage() {
  const programs = await getPrograms();

  const featuredPrograms = programs.filter((p) => p.isFeatured);
  const regularPrograms = programs.filter((p) => !p.isFeatured);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 text-center bg-gradient-to-b from-purple-50 via-white to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-900">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            Structured Learning Programs
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">
            Learn to Code with{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Expert Guidance
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Choose from our structured programs designed for kids and teens. Each program includes
            live instruction, hands-on projects, and a clear learning path. One-time payment, no subscriptions.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Live Instruction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>One-Time Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Certificate on Completion</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      {featuredPrograms.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Featured Programs
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Programs */}
      <section className="py-12 px-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">All Programs</h2>
          {programs.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                Programs are coming soon! Check back later.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Session Options Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Flexible Program Lengths</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-10">
            Choose the program length that fits your child&apos;s goals and schedule.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { sessions: 6, description: "Quick Start", ideal: "Intro to coding basics" },
              { sessions: 12, description: "Foundation", ideal: "Build real projects" },
              { sessions: 18, description: "Intermediate", ideal: "Advanced concepts" },
              { sessions: 24, description: "Mastery", ideal: "Complete curriculum" },
            ].map((option) => (
              <div
                key={option.sessions}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {option.sessions}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">Sessions</div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {option.description}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{option.ideal}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Child&apos;s Coding Journey?</h2>
          <p className="text-lg text-white/80 mb-8">
            Choose a program above, or contact us for a personalized recommendation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-slate-100 transition"
          >
            Get Personalized Advice
          </Link>
        </div>
      </section>
    </main>
  );
}

interface ProgramCardProps {
  program: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string | null;
    description: string;
    thumbnailUrl: string | null;
    language: string;
    ageGroup: string;
    level: string;
    sessionCount: number;
    sessionDuration: number;
    priceCents: number;
    originalPriceCents: number | null;
    features: any;
    _count: { enrollments: number };
  };
  featured?: boolean;
}

function ProgramCard({ program, featured }: ProgramCardProps) {
  const discount = program.originalPriceCents
    ? Math.round(((program.originalPriceCents - program.priceCents) / program.originalPriceCents) * 100)
    : 0;

  return (
    <Link
      href={`/programs/${program.slug}`}
      className={`group block overflow-hidden rounded-2xl border bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 ${
        featured
          ? "border-purple-300 dark:border-purple-700 ring-2 ring-purple-500/20"
          : "border-slate-200 dark:border-slate-700"
      }`}
    >
      {/* Thumbnail */}
      <div
        className={`relative h-40 bg-gradient-to-br ${
          languageColors[program.language] || "from-slate-400 to-slate-600"
        }`}
      >
        {program.thumbnailUrl ? (
          <img
            src={program.thumbnailUrl}
            alt={program.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-white/50" />
          </div>
        )}
        {featured && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            Featured
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {languageLabels[program.language] || program.language}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {ageGroupLabels[program.ageGroup] || program.ageGroup}
          </span>
        </div>

        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {program.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {program.shortDescription || program.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {program.sessionCount} sessions
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {program._count.enrollments} enrolled
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatPrice(program.priceCents)}
            </span>
            {program.originalPriceCents && (
              <span className="text-sm text-slate-400 line-through ml-2">
                {formatPrice(program.originalPriceCents)}
              </span>
            )}
          </div>
          <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
            Learn More &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
