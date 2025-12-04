import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import { logCreate } from "../../../../../lib/audit";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role =
    typeof (session?.user as any)?.role === "string"
      ? ((session?.user as any).role as string).toUpperCase()
      : null;

  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { courseId, userIds } = await req.json();

    if (!courseId || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // Verify course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const results = {
      enrolled: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const identifier of userIds) {
      try {
        // Find user by ID or email
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { id: identifier },
              { email: identifier },
            ],
          },
        });

        if (!user) {
          results.failed++;
          results.errors.push(`User not found: ${identifier}`);
          continue;
        }

        // Check if already enrolled
        const existingEnrollment = await prisma.enrollment.findFirst({
          where: {
            userId: user.id,
            courseId: courseId,
          },
        });

        if (existingEnrollment) {
          results.failed++;
          results.errors.push(`Already enrolled: ${user.email}`);
          continue;
        }

        // Create enrollment
        const enrollment = await prisma.enrollment.create({
          data: {
            userId: user.id,
            courseId: courseId,
          },
        });

        results.enrolled++;

        // Log the enrollment
        await logCreate(
          session.user.email || "unknown",
          "Enrollment",
          enrollment.id,
          `Bulk enrolled ${user.email} in course: ${course.title}`,
          (session.user as any).id,
          { courseId, userId: user.id, bulkEnroll: true }
        );
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Error enrolling ${identifier}: ${error.message || "Unknown error"}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("[BulkEnroll] Error:", error);
    return NextResponse.json(
      { error: "Failed to process enrollments", enrolled: 0, failed: 0, errors: [] },
      { status: 500 }
    );
  }
}
