import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import prisma from "../../../lib/prisma";
import { authOptions } from "../../../lib/auth";

const updateSchema = z.object({
  enrollmentId: z.string(),
  lessonId: z.string(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]).optional(),
  score: z.number().int().min(0).max(100).optional(),
});

// GET /api/progress - fetch progress (by enrollmentId or user/course)
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ status: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const enrollmentId = searchParams.get("enrollmentId") ?? undefined;
  const courseId = searchParams.get("courseId") ?? undefined;
  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  const userEmail = session.user.email;

  // Check subscription for students and parents
  if (role === "STUDENT" || role === "PARENT") {
    let checkEmail = userEmail;

    if (role === "STUDENT") {
      const studentProfile = await prisma.studentProfile.findFirst({
        where: { userId },
        select: { parentEmail: true },
      });
      checkEmail = studentProfile?.parentEmail || userEmail;
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        user: { email: checkEmail },
        status: { in: ["ACTIVE", "TRIALING"] },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { status: "error", message: "Active subscription required to access course progress." },
        { status: 403 }
      );
    }
  }

  const where: any = {};
  if (enrollmentId) where.enrollmentId = enrollmentId;
  if (courseId) where.lesson = { courseId };
  if (role !== "ADMIN" && role !== "INSTRUCTOR") {
    // limit to student-owned enrollments
    where.enrollment = { userId };
  }

  try {
    const progress = await prisma.progress.findMany({
      where,
      include: { lesson: true, enrollment: true },
      orderBy: { lessonId: "asc" },
    });
    return NextResponse.json({ status: "ok", data: progress });
  } catch (error) {
    console.error("GET /api/progress error", error);
    return NextResponse.json({ status: "error", message: "Failed to fetch progress" }, { status: 500 });
  }
}

// PATCH /api/progress - update lesson progress (status/score)
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ status: "unauthorized" }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ status: "error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  const userEmail = session.user.email;

  // Check subscription for students and parents
  if (role === "STUDENT" || role === "PARENT") {
    let checkEmail = userEmail;

    if (role === "STUDENT") {
      const studentProfile = await prisma.studentProfile.findFirst({
        where: { userId },
        select: { parentEmail: true },
      });
      checkEmail = studentProfile?.parentEmail || userEmail;
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        user: { email: checkEmail },
        status: { in: ["ACTIVE", "TRIALING"] },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { status: "error", message: "Active subscription required to update course progress." },
        { status: 403 }
      );
    }
  }

  const payload = parsed.data;
  try {
    const enrollment = await prisma.enrollment.findUnique({ where: { id: payload.enrollmentId } });
    if (!enrollment) return NextResponse.json({ status: "not-found" }, { status: 404 });

    const userId = (session.user as any).id;
    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "INSTRUCTOR" && enrollment.userId !== userId) {
      return NextResponse.json({ status: "forbidden" }, { status: 403 });
    }

    const progress = await prisma.progress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: payload.enrollmentId, lessonId: payload.lessonId } },
      update: {
        status: payload.status,
        score: payload.score,
        completedAt: payload.status === "COMPLETED" ? new Date() : undefined,
      },
      create: {
        enrollmentId: payload.enrollmentId,
        lessonId: payload.lessonId,
        status: payload.status ?? "IN_PROGRESS",
        score: payload.score,
        completedAt: payload.status === "COMPLETED" ? new Date() : undefined,
      },
    });

    return NextResponse.json({ status: "ok", data: progress });
  } catch (error) {
    console.error("PATCH /api/progress error", error);
    return NextResponse.json({ status: "error", message: "Failed to update progress" }, { status: 500 });
  }
}
