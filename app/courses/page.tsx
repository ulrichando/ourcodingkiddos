import type { Metadata } from "next";
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

  return <CourseCatalogClient courses={courses} />;
}
