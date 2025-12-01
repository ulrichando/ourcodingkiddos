'use server'

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';

/**
 * Server Action to toggle course publish status
 *
 * This is a more robust, production-ready alternative to client-side API calls.
 * Server Actions automatically handle:
 * - Cache revalidation
 * - Server-side execution
 * - Type safety
 * - Progressive enhancement
 *
 * Usage in component:
 * ```tsx
 * import { toggleCoursePublishStatus } from './actions';
 *
 * const result = await toggleCoursePublishStatus(courseId, !isPublished);
 * if (result.success) {
 *   alert('Course updated!');
 * }
 * ```
 */
export async function toggleCoursePublishStatus(
  courseId: string,
  isPublished: boolean
): Promise<{ success: boolean; course?: any; error?: string }> {
  try {
    console.log("=== SERVER ACTION: toggleCoursePublishStatus ===");
    console.log("Course ID:", courseId);
    console.log("New isPublished value:", isPublished);

    // 1. Verify authentication and authorization
    const session = await getServerSession(authOptions);
    const role = typeof (session?.user as any)?.role === "string"
      ? ((session?.user as any).role as string).toUpperCase()
      : null;

    console.log("Session user:", session?.user?.email);
    console.log("User role:", role);

    if (!session?.user || (role !== "ADMIN" && role !== "INSTRUCTOR")) {
      console.error("✗ Unauthorized access attempt");
      return {
        success: false,
        error: "Unauthorized. Only admins and instructors can modify courses."
      };
    }

    // 2. Validate input
    if (!courseId || typeof courseId !== 'string') {
      console.error("✗ Invalid course ID");
      return {
        success: false,
        error: "Invalid course ID provided."
      };
    }

    if (typeof isPublished !== 'boolean') {
      console.error("✗ Invalid isPublished value");
      return {
        success: false,
        error: "Invalid publish status value."
      };
    }

    // 3. Update database
    console.log("Updating course in database...");
    const course = await prisma.course.update({
      where: { id: courseId },
      data: { isPublished },
      include: {
        lessons: {
          select: { id: true, title: true, slug: true, orderIndex: true }
        }
      }
    });

    console.log("✓ Course updated successfully");
    console.log("New course state:", {
      id: course.id,
      title: course.title,
      isPublished: course.isPublished,
      updatedAt: course.updatedAt
    });

    // 4. Verify the update
    const verifiedCourse = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, isPublished: true }
    });

    console.log("✓ Verified course state:", verifiedCourse);

    if (verifiedCourse?.isPublished !== isPublished) {
      console.error("⚠️  WARNING: Verified state doesn't match!");
      console.error("Expected:", isPublished);
      console.error("Got:", verifiedCourse?.isPublished);
      return {
        success: false,
        error: "Database update verification failed."
      };
    }

    // 5. Revalidate all relevant paths
    // This tells Next.js to refresh cached data for these pages
    console.log("Revalidating paths...");
    revalidatePath('/dashboard/admin/courses');
    revalidatePath('/api/courses');
    revalidatePath('/courses');
    console.log("✓ Paths revalidated");

    console.log("=== SERVER ACTION COMPLETED SUCCESSFULLY ===\n");

    return {
      success: true,
      course: {
        ...course,
        _count: {
          lessons: course.lessons?.length || 0
        }
      }
    };

  } catch (error: any) {
    console.error("=== SERVER ACTION ERROR ===");
    console.error("Error type:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("=== END SERVER ACTION ERROR ===\n");

    return {
      success: false,
      error: error.message || "Failed to update course. Please try again."
    };
  }
}

/**
 * Server Action to delete a course
 *
 * Handles complete course deletion with proper authorization and revalidation.
 */
export async function deleteCourse(
  courseId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("=== SERVER ACTION: deleteCourse ===");
    console.log("Course ID:", courseId);

    // 1. Verify authentication
    const session = await getServerSession(authOptions);
    const role = typeof (session?.user as any)?.role === "string"
      ? ((session?.user as any).role as string).toUpperCase()
      : null;

    if (!session?.user || role !== "ADMIN") {
      console.error("✗ Unauthorized: Only admins can delete courses");
      return {
        success: false,
        error: "Unauthorized. Only administrators can delete courses."
      };
    }

    // 2. Validate input
    if (!courseId || typeof courseId !== 'string') {
      return {
        success: false,
        error: "Invalid course ID provided."
      };
    }

    // 3. Delete course (Prisma will handle cascading deletes based on schema)
    await prisma.course.delete({
      where: { id: courseId }
    });

    console.log("✓ Course deleted successfully");

    // 4. Revalidate paths
    revalidatePath('/dashboard/admin/courses');
    revalidatePath('/api/courses');
    revalidatePath('/courses');

    console.log("=== SERVER ACTION COMPLETED ===\n");

    return { success: true };

  } catch (error: any) {
    console.error("=== SERVER ACTION ERROR ===");
    console.error(error);
    console.error("=== END SERVER ACTION ERROR ===\n");

    return {
      success: false,
      error: error.message || "Failed to delete course. Please try again."
    };
  }
}

/**
 * Server Action to create a new course
 *
 * Creates a course with all required fields and proper validation.
 */
export async function createCourse(formData: {
  title: string;
  description: string;
  language: string;
  level: string;
  ageGroup: string;
  thumbnailUrl?: string;
  totalXp?: number;
  estimatedHours?: number;
}): Promise<{ success: boolean; course?: any; error?: string }> {
  try {
    console.log("=== SERVER ACTION: createCourse ===");

    // 1. Verify authentication
    const session = await getServerSession(authOptions);
    const role = typeof (session?.user as any)?.role === "string"
      ? ((session?.user as any).role as string).toUpperCase()
      : null;

    if (!session?.user || (role !== "ADMIN" && role !== "INSTRUCTOR")) {
      return {
        success: false,
        error: "Unauthorized. Only admins and instructors can create courses."
      };
    }

    // 2. Generate slug from title
    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // 3. Create course
    const course = await prisma.course.create({
      data: {
        ...formData,
        slug,
        language: formData.language.toUpperCase() as any,
        level: formData.level.toUpperCase() as any,
        ageGroup: formData.ageGroup.toUpperCase() as any,
        isPublished: false,
      }
    });

    console.log("✓ Course created:", course.id);

    // 4. Revalidate paths
    revalidatePath('/dashboard/admin/courses');
    revalidatePath('/api/courses');

    console.log("=== SERVER ACTION COMPLETED ===\n");

    return {
      success: true,
      course
    };

  } catch (error: any) {
    console.error("=== SERVER ACTION ERROR ===");
    console.error(error);
    console.error("=== END SERVER ACTION ERROR ===\n");

    return {
      success: false,
      error: error.message || "Failed to create course. Please try again."
    };
  }
}
