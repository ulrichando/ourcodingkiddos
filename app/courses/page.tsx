import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import CourseCatalogClient, { CatalogCourse } from "../../components/courses/CourseCatalogClient";
import prisma from "../../lib/prisma";
import { courses as mockCourses } from "../../data/courses";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  // Require authentication to access courses
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login?callbackUrl=/courses");
  }
  const useDemo =
    process.env.NEXT_PUBLIC_USE_DEMO_DATA !== "false" &&
    (!process.env.NODE_ENV || process.env.NODE_ENV === "development");

  let coursesDb: any[] = [];
  if (!useDemo) {
    try {
      coursesDb = await prisma.course.findMany({
        orderBy: { title: "asc" },
        include: {
          lessons: { select: { id: true } },
        },
      });
    } catch (e) {
      coursesDb = [];
    }
  }

  const sourceCourses = coursesDb.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    level: c.level,
    age: c.ageGroup ? c.ageGroup.replace("AGES_", "Ages ").replace("_", "-") : "Ages 7-10",
    xp: c.totalXp ?? 0,
    hours: c.estimatedHours ?? 0,
    description: c.description,
    language: c.language,
    lessonsCount: c.lessons.length,
  }));

  const courses: CatalogCourse[] = sourceCourses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    level: c.level.toLowerCase(),
    age: c.age,
    xp: c.xp,
    hours: c.hours,
    description: c.description,
    language: c.language.toLowerCase(),
    lessonsCount: c.lessonsCount,
  }));

  // Fallback to mock data if DB is empty
  const finalCourses: CatalogCourse[] =
    courses.length > 0
      ? courses
      : mockCourses.map((c) => ({
          id: c.id,
          slug: c.id,
          title: c.title,
          level: c.level,
          age: c.age,
          xp: c.xp,
          hours: c.hours,
          description: c.description,
          language: c.language,
          lessonsCount: c.lessons.length,
        }));

  return <CourseCatalogClient courses={finalCourses} />;
}
