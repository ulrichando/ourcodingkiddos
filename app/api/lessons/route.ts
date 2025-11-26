import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import prisma from "../../../lib/prisma";
import { authOptions } from "../../../lib/auth";

const createLessonSchema = z.object({
  courseId: z.string(),
  title: z.string().min(3),
  slug: z.string().min(3),
  order: z.number().int().min(0),
  content: z.any(),
  resources: z.any().optional(),
  durationMin: z.number().int().positive().optional(),
});

// GET /api/lessons - list lessons (optionally by courseId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId") ?? undefined;

  try {
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ status: "ok", data: lessons });
  } catch (error) {
    console.error("GET /api/lessons error", error);
    return NextResponse.json({ status: "error", message: "Failed to fetch lessons" }, { status: 500 });
  }
}

// POST /api/lessons - create a lesson (instructor/admin)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes((session.user as any).role)) {
    return NextResponse.json({ status: "forbidden" }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parsed = createLessonSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ status: "error", errors: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const lesson = await prisma.lesson.create({ data: parsed.data });
    return NextResponse.json({ status: "ok", data: lesson }, { status: 201 });
  } catch (error) {
    console.error("POST /api/lessons error", error);
    return NextResponse.json({ status: "error", message: "Failed to create lesson" }, { status: 500 });
  }
}
