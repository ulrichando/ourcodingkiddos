import type { Metadata } from "next";
import { Suspense } from "react";
import CourseCatalogClient, { CatalogCourse } from "../../components/courses/CourseCatalogClient";
import prisma from "../../lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Coding Courses for Kids - HTML, CSS, JavaScript, Python & Roblox",
  description: "Browse our comprehensive catalog of coding courses designed for kids ages 7-18. Learn programming through interactive lessons in HTML, CSS, JavaScript, Python, and Roblox game development.",
  keywords: ["coding courses", "programming courses for kids", "HTML course", "CSS course", "JavaScript course", "Python course", "Roblox course", "kids coding classes"],
  openGraph: {
    title: "Coding Courses for Kids - Learn Programming the Fun Way",
    description: "Comprehensive coding courses for ages 7-18. Interactive lessons in HTML, CSS, JavaScript, Python, and Roblox.",
    url: "https://ourcodingkiddos.com/courses",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coding Courses for Kids",
    description: "Learn programming through interactive lessons designed for ages 7-18.",
  },
};

export default async function CoursesPage() {
  // Allow browsing courses without authentication
  // Users will need to login when they try to access lessons
  let coursesDb: any[] = [];
  try {
    coursesDb = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { title: "asc" },
      include: {
        lessons: { select: { id: true } },
      },
    });
  } catch (e) {
    coursesDb = [];
  }

  const courses: CatalogCourse[] = coursesDb.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    level: c.level.toLowerCase(),
    age: c.ageGroup ? c.ageGroup.replace("AGES_", "Ages ").replace("_", "-") : "Ages 7-10",
    xp: c.totalXp ?? 0,
    hours: c.estimatedHours ?? 0,
    description: c.description,
    language: c.language.toLowerCase(),
    lessonsCount: c.lessons.length,
  }));

  return (
    <Suspense fallback={<CoursesSkeleton />}>
      <CourseCatalogClient courses={courses} />
    </Suspense>
  );
}

function CoursesSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <section className="pt-12 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="h-6 w-24 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
            <div className="h-10 w-64 mx-auto bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-5 w-80 mx-auto bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 p-3">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                <div className="h-32 bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                    <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                  </div>
                  <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
