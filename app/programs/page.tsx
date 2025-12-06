import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  Clock,
  Users,
  BookOpen,
  Star,
  ChevronLeft,
  ChevronRight,
  Video,
  CreditCard,
  Award,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

const PROGRAMS_PER_PAGE = 9;

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

async function getPrograms(page: number = 1) {
  const skip = (page - 1) * PROGRAMS_PER_PAGE;

  const [programs, totalCount] = await Promise.all([
    prisma.program.findMany({
      where: { isPublished: true },
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { orderIndex: "asc" }, { createdAt: "desc" }],
      skip,
      take: PROGRAMS_PER_PAGE,
    }),
    prisma.program.count({
      where: { isPublished: true },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PROGRAMS_PER_PAGE);

  return { programs, totalCount, totalPages, currentPage: page };
}

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const { programs, totalCount, totalPages } = await getPrograms(currentPage);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Hero Section with gradient background */}
      <section className="relative pt-16 pb-12 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-slate-50 to-slate-50 dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-200/40 dark:bg-pink-900/20 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto relative text-center space-y-6">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 px-4 py-1.5 rounded-full text-xs font-semibold border border-purple-200 dark:border-purple-800">
              <Sparkles className="w-3.5 h-3.5" />
              Structured Learning
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 animate-fade-in-up">
            Learn to Code with{" "}
            <span className="text-gradient">Expert Guidance</span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Structured programs with live instruction, hands-on projects, and certificates. One-time payment, no subscriptions.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 pt-4 animate-fade-in-up delay-200">
            {[
              { icon: Video, label: "Live Instruction", color: "text-emerald-500" },
              { icon: CreditCard, label: "One-Time Payment", color: "text-blue-500" },
              { icon: Award, label: "Certificate", color: "text-purple-500" },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <div className={`${feature.color}`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Programs */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {programs.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/50 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Coming Soon</h3>
              <p className="text-slate-500 dark:text-slate-400">
                Programs are coming soon! Check back later.
              </p>
            </div>
          ) : (
            <>
              {/* Results count */}
              <div className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {(currentPage - 1) * PROGRAMS_PER_PAGE + 1}-{Math.min(currentPage * PROGRAMS_PER_PAGE, totalCount)}
                </span>{" "}
                of <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{totalCount}</span> programs
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((program, index) => (
                  <ProgramCard key={program.id} program={program} featured={program.isFeatured} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              )}
            </>
          )}
        </div>
      </section>

      {/* Session Options Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-800/50">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800 mb-6">
            <Zap className="w-3.5 h-3.5" />
            Flexible Options
          </span>
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Choose Your Program Length</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Select the program length that fits your child&apos;s goals and schedule. Each session builds on the previous one.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { sessions: 6, description: "Quick Start", ideal: "Intro to coding basics", color: "from-emerald-500 to-teal-500" },
              { sessions: 12, description: "Foundation", ideal: "Build real projects", color: "from-blue-500 to-cyan-500" },
              { sessions: 18, description: "Intermediate", ideal: "Advanced concepts", color: "from-purple-500 to-violet-500" },
              { sessions: 24, description: "Mastery", ideal: "Complete curriculum", color: "from-amber-500 to-orange-500" },
            ].map((option, index) => (
              <div
                key={option.sessions}
                className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/80 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl font-bold text-white tabular-nums">{option.sessions}</span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Sessions</div>
                <div className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">
                  {option.description}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{option.ideal}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Start Your Child&apos;s Coding Journey?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Choose a program above, or contact us for a personalized recommendation tailored to your child&apos;s interests.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-purple-600 font-semibold px-8 py-4 rounded-xl hover:bg-slate-100 transition-all duration-200 shadow-lg shadow-purple-900/30 hover:shadow-xl hover:shadow-purple-900/40 active:scale-95 group"
          >
            Get Personalized Advice
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
  index?: number;
}

function ProgramCard({ program, featured, index = 0 }: ProgramCardProps) {
  const discount = program.originalPriceCents
    ? Math.round(((program.originalPriceCents - program.priceCents) / program.originalPriceCents) * 100)
    : 0;

  return (
    <Link
      href={`/programs/${program.slug}`}
      className={`group block overflow-hidden rounded-2xl border bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1 animate-fade-in-up ${
        featured
          ? "border-purple-300 dark:border-purple-700 ring-2 ring-purple-500/20"
          : "border-slate-200 dark:border-slate-700/50 hover:border-purple-300 dark:hover:border-purple-600"
      }`}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      {/* Thumbnail */}
      <div
        className={`relative h-44 bg-gradient-to-br ${
          languageColors[program.language] || "from-slate-400 to-slate-600"
        } overflow-hidden`}
      >
        {program.thumbnailUrl ? (
          <img
            src={program.thumbnailUrl}
            alt={program.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-white/30" />
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {featured && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
            <Star className="w-3.5 h-3.5 fill-yellow-900" />
            Featured
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
            {languageLabels[program.language] || program.language}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {ageGroupLabels[program.ageGroup] || program.ageGroup}
          </span>
        </div>

        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
          {program.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {program.shortDescription || program.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span className="tabular-nums">{program.sessionCount} sessions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span className="tabular-nums">{program._count.enrollments} enrolled</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {formatPrice(program.priceCents)}
            </span>
            {program.originalPriceCents && (
              <span className="text-sm text-slate-400 line-through ml-2 tabular-nums">
                {formatPrice(program.originalPriceCents)}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold text-sm">
            Learn More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="mt-12 flex items-center justify-center gap-1" aria-label="Pagination">
      {/* Previous Button */}
      <Link
        href={currentPage > 1 ? `/programs?page=${currentPage - 1}` : "#"}
        className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          currentPage > 1
            ? "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
            : "text-slate-300 dark:text-slate-600 pointer-events-none"
        }`}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-slate-400 dark:text-slate-500"
            >
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={`/programs?page=${page}`}
              className={`min-w-[44px] px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 tabular-nums ${
                page === currentPage
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              }`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next Button */}
      <Link
        href={currentPage < totalPages ? `/programs?page=${currentPage + 1}` : "#"}
        className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          currentPage < totalPages
            ? "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
            : "text-slate-300 dark:text-slate-600 pointer-events-none"
        }`}
        aria-disabled={currentPage >= totalPages}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </nav>
  );
}
