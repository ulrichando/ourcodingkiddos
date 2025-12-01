import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';
import { redirect } from 'next/navigation';
import CoursesClient from './CoursesClient';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Server Component: Fetches courses data directly from database
 *
 * Benefits:
 * - No API route needed
 * - Direct database access (faster)
 * - Zero caching issues
 * - Fresh data on every request
 * - Smaller JavaScript bundle
 */
export default async function CoursesList() {
  console.log("=== SERVER COMPONENT: CoursesList ===");
  console.log("Fetching courses from database...");

  try {
    // 1. Authentication check (server-side)
    const session = await getServerSession(authOptions);
    const role = typeof (session?.user as any)?.role === "string"
      ? ((session?.user as any).role as string).toUpperCase()
      : null;

    console.log("User:", session?.user?.email);
    console.log("Role:", role);

    // Redirect if unauthorized
    if (!session?.user || (role !== 'ADMIN' && role !== 'INSTRUCTOR')) {
      console.log("✗ Unauthorized - redirecting to signin");
      redirect('/auth/signin');
    }

    // 2. Fetch courses directly from database (no API call!)
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        lessons: {
          select: { id: true, title: true, slug: true, orderIndex: true }
        }
      }
    });

    console.log(`✓ Fetched ${courses.length} courses from database`);
    courses.forEach(c => console.log(`  - ${c.title}: isPublished=${c.isPublished}`));

    // 3. Transform data to match expected format
    const transformedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      language: course.language,
      level: course.level,
      ageGroup: course.ageGroup,
      isPublished: course.isPublished,
      totalXp: course.totalXp,
      _count: {
        lessons: course.lessons?.length || 0
      }
    }));

    console.log("=== SERVER COMPONENT COMPLETE ===\n");

    // 4. Pass data to client component for interactivity
    return <CoursesClient initialCourses={transformedCourses} />;

  } catch (error) {
    console.error("=== SERVER COMPONENT ERROR ===");
    console.error(error);
    console.error("=== END SERVER COMPONENT ERROR ===\n");

    // Render error state
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-700 dark:text-red-300 font-semibold mb-2">
            Failed to load courses
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          <p className="text-xs text-red-500 dark:text-red-500 mt-2">
            Please refresh the page or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }
}
