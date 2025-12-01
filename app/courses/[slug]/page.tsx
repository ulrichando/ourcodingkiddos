import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Play, Clock, Star, BookOpen, CheckCircle2, Code2, LogIn, UserPlus } from "lucide-react";
import LanguageIcon from "../../../components/ui/LanguageIcon";
import Badge from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import prisma from "../../../lib/prisma";
import { courses as mockCourses } from "../../../data/courses";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export const dynamic = "force-dynamic";

const levelColor: Record<string, string> = {
  BEGINNER: "bg-emerald-100 text-emerald-700",
  INTERMEDIATE: "bg-blue-100 text-blue-700",
  ADVANCED: "bg-purple-100 text-purple-700",
};

const ageLabel: Record<string, string> = {
  AGES_7_10: "Ages 7-10",
  AGES_11_14: "Ages 11-14",
  AGES_15_18: "Ages 15-18",
};

function normalizeAge(age?: string | null) {
  if (!age) return "Ages 7-10";
  if (ageLabel[age]) return ageLabel[age];
  if (age.toLowerCase().startsWith("ages")) return age;
  return `Ages ${age}`;
}

function normalizeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const demoCourses = [
  {
    slug: "html-basics-for-kids",
    title: "HTML Basics for Kids",
    description: "Learn to build your first web page! Discover tags, headings, paragraphs, images, and links in this fun beginner course.",
    level: "BEGINNER",
    ageGroup: "AGES_7_10",
    language: "HTML",
    estimatedHours: 5,
    totalXp: 500,
    lessons: [
      { id: "l1", title: "What is HTML?", description: "Learn what HTML is and why it's important for building websites", xpReward: 50, orderIndex: 1 },
      { id: "l2", title: "Headings and Paragraphs", description: "Learn to use headings (h1-h6) and paragraph tags", xpReward: 50, orderIndex: 2 },
      { id: "l3", title: "Adding Images", description: "Learn to add pictures to your webpage", xpReward: 75, orderIndex: 3 },
    ],
  },
  {
    slug: "css-magic-style-your-pages",
    title: "CSS Magic: Style Your Pages",
    description: "Make your websites beautiful with colors, fonts, and layouts. Learn how to make things look awesome!",
    level: "BEGINNER",
    ageGroup: "AGES_7_10",
    language: "CSS",
    estimatedHours: 5,
    totalXp: 500,
    lessons: [
      { id: "c1", title: "Color & Typography", description: "Change colors, fonts, and sizes", xpReward: 50, orderIndex: 1 },
      { id: "c2", title: "Layouts", description: "Use flexbox and grid to position elements", xpReward: 50, orderIndex: 2 },
      { id: "c3", title: "Buttons & Cards", description: "Style interactive elements with hover effects", xpReward: 75, orderIndex: 3 },
    ],
  },
];

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Allow browsing course details, but require login to start lessons
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;

  // Gate: parents can browse but not start lessons (for kids). If role === PARENT, redirect to their dashboard.
  const role = (session as any)?.user?.role;
  if (isAuthenticated && role === "PARENT") {
    redirect("/dashboard/parent");
  }

  const resolved = await params;
  const slugParam = resolved?.slug || "";
  if (!slugParam) return notFound();

  const normalized = slugParam.toLowerCase();
  const normalizedSlug = normalizeSlug(slugParam);
  const looseMatch = normalizedSlug.replace(/-+/g, " ").trim();

  let course = null;
  try {
    course = await prisma.course.findFirst({
      where: {
        OR: [
          { slug: slugParam },
          { slug: normalized },
          { slug: normalizedSlug },
          { slug: { equals: slugParam, mode: "insensitive" } },
          { slug: { equals: normalizedSlug, mode: "insensitive" } },
          { slug: { contains: normalizedSlug, mode: "insensitive" } },
          { id: slugParam },
          { title: { contains: looseMatch, mode: "insensitive" } },
        ],
      },
      include: {
        lessons: {
          select: { id: true, title: true, description: true, xpReward: true, orderIndex: true },
          orderBy: [{ orderIndex: "asc" }, { id: "asc" }],
        },
      },
    });
  } catch (e) {
    course = null;
  }

  const allowDemo = role === "ADMIN" && process.env.NEXT_PUBLIC_USE_DEMO_DATA !== "false";

  if (!course && allowDemo) {
    const demo = demoCourses.find(
      (d) =>
        d.slug === slugParam ||
        d.slug === normalizedSlug ||
        d.slug === normalized ||
        normalizeSlug(d.title) === normalizedSlug
    );
    if (demo) {
      course = demo as any;
    }
  }

  // Only allow mock course fallback for admin demo mode
  if (!course && allowDemo && mockCourses.length) {
    const mock = mockCourses.find((c: any) => {
      const mockSlug = (c as any).slug ?? normalizeSlug(c.title);
      return c.id === slugParam || mockSlug === slugParam || normalizeSlug(c.title) === normalizedSlug || c.id === normalizedSlug;
    });
    if (mock) {
      course = {
        ...mock,
        lessons: mock.lessons.map((l, idx) => ({
          id: `${mock.id}-${idx}`,
          title: l.title,
          description: l.description,
          xpReward: l.xp,
          orderIndex: idx + 1,
        })),
        totalXp: mock.xp,
        estimatedHours: mock.hours,
        ageGroup: mock.age?.toUpperCase().replace("AGES ", "AGES_").replace("-", "_"),
        language: mock.language.toUpperCase(),
        level: mock.level.toUpperCase(),
      } as any;
    }
  }

  if (!course) return notFound();

  const title = course.title;
  const description = course.description;
  const level = course.level.toString().toUpperCase();
  const age = normalizeAge(course.ageGroup);
  const languageKey = course.language.toString().toLowerCase();
  const lessons = course.lessons || [];

  const lessonsCount = lessons.length;
  const totalXp = course.totalXp ?? 0;
  const hours = course.estimatedHours ?? 0;
  const sortedLessons = [...lessons].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-950/20 dark:to-pink-950/20 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-10">
        <Link
          href="/courses"
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Courses
        </Link>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-6 lg:gap-8 items-start">
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-1 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-2xl" />
              <div className="relative bg-white dark:bg-slate-900 rounded-[1.125rem] sm:rounded-[1.375rem] p-5 sm:p-8 lg:p-10">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50" />
                    <div className="relative">
                      <LanguageIcon language={languageKey} size="lg" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`${levelColor[level] || levelColor.BEGINNER} font-bold px-3 sm:px-4 py-1.5 shadow-sm`}>
                      {level.toLowerCase()}
                    </Badge>
                    <Badge variant="outline" className="font-semibold px-3 sm:px-4 py-1.5 border-2">
                      {age}
                    </Badge>
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 leading-tight mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                {description && (
                  <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed mb-4 sm:mb-6">{description}</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t-2 border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 col-span-1">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{hours || 0}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">hours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 col-span-1">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{lessonsCount}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">lessons</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 col-span-2 sm:col-span-1">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{totalXp || 0}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">XP</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 space-y-4 sm:space-y-6">
            <Card className="relative overflow-hidden border-2 border-purple-200 dark:border-purple-800 shadow-2xl bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-slate-800 dark:via-purple-950/20 dark:to-pink-950/20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
              <CardContent className="relative p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold mb-4 shadow-lg shadow-green-500/30">
                    <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    Free Course
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">
                    {isAuthenticated ? "Ready to Start?" : "Start Learning Today!"}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
                    {isAuthenticated ? "Begin your coding journey" : "Sign up free to start this course"}
                  </p>
                </div>

                {isAuthenticated ? (
                  <Link
                    href={`/lessons/${
                      (course as any)?.id ||
                      (course as any)?.slug ||
                      normalizeSlug((course as any)?.title || slugParam) ||
                      slugParam
                    }`}
                    className="block group"
                  >
                    <div className="relative w-full inline-flex items-center justify-center gap-2 sm:gap-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold py-3.5 sm:py-4 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
                      <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-lg">Start Learning</span>
                    </div>
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/auth/register"
                      className="block group"
                    >
                      <div className="relative w-full inline-flex items-center justify-center gap-2 sm:gap-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold py-3.5 sm:py-4 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
                        <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-lg">Sign Up Free</span>
                      </div>
                    </Link>
                    <Link
                      href={`/auth/login?callbackUrl=/courses/${slugParam}`}
                      className="block"
                    >
                      <div className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-700 border-2 border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 font-semibold py-3 hover:bg-purple-50 dark:hover:bg-slate-600 transition-all duration-300">
                        <LogIn className="w-4 h-4" />
                        <span>Already have an account?</span>
                      </div>
                    </Link>
                  </div>
                )}
                <div className="space-y-3 pt-4 border-t-2 border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase tracking-wider">What's Included</p>
                  <Feature icon={<CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />}>
                    Full lifetime access
                  </Feature>
                  <Feature icon={<CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />}>
                    Interactive code editor
                  </Feature>
                  <Feature icon={<CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />}>
                    Quizzes & challenges
                  </Feature>
                  <Feature icon={<CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />}>
                    Earn XP & achievements
                  </Feature>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">Perfect for beginners</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">No prior experience needed</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  This course is designed specifically for kids to learn coding in a fun and interactive way!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">Course Content</h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                {sortedLessons.length} {sortedLessons.length === 1 ? "lesson" : "lessons"} to master {languageKey.toUpperCase()}
              </p>
            </div>
            {sortedLessons.length > 0 && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-bold shadow-lg shadow-purple-500/30 self-start sm:self-auto">
                {totalXp} Total XP
              </Badge>
            )}
          </div>

          {sortedLessons.length === 0 ? (
            <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
              <CardContent className="p-16 text-center">
                <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Lessons Coming Soon!</h3>
                <p className="text-slate-500 dark:text-slate-400">We're working on creating amazing content for this course.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {sortedLessons.map((lesson, index) => (
                <Card
                  key={lesson.id}
                  className="group relative overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white dark:bg-slate-800 hover:scale-[1.01]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="relative p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-5">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity" />
                          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-black text-white text-lg sm:text-xl shadow-lg group-hover:scale-110 transition-transform">
                            {index + 1}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2">
                          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {lesson.title}
                          </h3>
                          <Badge className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-2 sm:px-3 py-1 shadow-md text-xs">
                            <Star className="h-3 w-3 inline mr-1 fill-current" />
                            {lesson.xpReward ?? 50}
                          </Badge>
                        </div>
                        {lesson.description && (
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2 sm:mb-3">{lesson.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-500 dark:text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="font-medium">Interactive</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Code2 className="h-3 w-3" />
                            <span className="font-medium hidden sm:inline">Hands-on coding</span>
                            <span className="font-medium sm:hidden">Code</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="font-medium">Quiz</span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                          <Play className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Feature({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
      {icon || <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />}
      <span>{children}</span>
    </div>
  );
}
