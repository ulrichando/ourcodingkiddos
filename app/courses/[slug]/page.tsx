import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Play, Clock, Star, BookOpen, CheckCircle2 } from "lucide-react";
import LanguageIcon from "../../../components/ui/LanguageIcon";
import Badge from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import prisma from "../../../lib/prisma";

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

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const slugParam = params?.slug || "";
  if (!slugParam) return notFound();

  const normalized = slugParam.toLowerCase();
  const normalizedSlug = normalizeSlug(slugParam);

  let course = null;
  try {
    course = await prisma.course.findFirst({
      where: {
        OR: [
          { slug: slugParam },
          { slug: normalized },
          { slug: normalizedSlug },
          { slug: { equals: slugParam, mode: "insensitive" } },
          { slug: { contains: normalizedSlug, mode: "insensitive" } },
          { id: slugParam },
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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-10 items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <LanguageIcon language={languageKey} size="lg" />
              <div className="flex gap-2 flex-wrap">
                <Badge className={levelColor[level] || levelColor.BEGINNER}>{level.toLowerCase()}</Badge>
                <Badge variant="outline">{age}</Badge>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">{title}</h1>
            {description && <p className="text-lg text-slate-600 max-w-3xl">{description}</p>}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="inline-flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{hours || 0} hours</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>
                  {lessonsCount} {lessonsCount === 1 ? "lesson" : "lessons"}
                </span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>{totalXp || 0} XP</span>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="text-3xl font-bold text-slate-900">Ready to Start?</div>
              <p className="text-slate-500">Continue your coding journey</p>
              <Link href="/auth/login" className="inline-block w-full">
                <div className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 hover:brightness-105">
                  <Play className="w-4 h-4" />
                  Start Learning
                </div>
              </Link>
              <div className="space-y-2 text-sm text-slate-600">
                <Feature>Full course access</Feature>
                <Feature>Code playground</Feature>
                <Feature>Quizzes & exercises</Feature>
                <Feature>Earn badges & XP</Feature>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Course Content</h2>
            {sortedLessons.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">Lessons coming soon!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedLessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{lesson.title}</h3>
                      {lesson.description && <p className="text-sm text-slate-500">{lesson.description}</p>}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Badge variant="outline">{lesson.xpReward ?? 50} XP</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-green-500" />
      {children}
    </div>
  );
}
