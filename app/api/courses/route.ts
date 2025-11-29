import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import prisma from "../../../lib/prisma";
import { authOptions } from "../../../lib/auth";
import { CourseLevel, Language, AgeGroup } from "@prisma/client";

const createCourseSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/i),
  description: z.string().min(10),
  language: z.nativeEnum(Language),
  ageGroup: z.nativeEnum(AgeGroup),
  level: z.nativeEnum(CourseLevel),
  isPublished: z.boolean().optional().default(false),
  thumbnailUrl: z.string().url().optional(),
  totalXp: z.number().optional(),
  estimatedHours: z.number().optional(),
});

// GET /api/courses - list courses with optional filters
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level") ?? undefined;
  const language = searchParams.get("language") ?? undefined;
  const ageGroup = searchParams.get("ageGroup") ?? undefined;
  const published = searchParams.get("published");

  try {
    const courses = await prisma.course.findMany({
      where: {
        level: level ? (level as any) : undefined,
        language: language ? (language as any) : undefined,
        ageGroup: ageGroup ? (ageGroup as any) : undefined,
        isPublished: published === null ? undefined : published === "true",
      },
      orderBy: { createdAt: "desc" },
      include: { lessons: { select: { id: true, title: true, slug: true, orderIndex: true } } },
    });
    return NextResponse.json({ status: "ok", data: courses });
  } catch (error) {
    console.error("GET /api/courses error", error);
    return NextResponse.json({ status: "error", message: "Failed to fetch courses" }, { status: 500 });
  }
}

// POST /api/courses - create a new course (admin/instructor only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes((session.user as any).role)) {
    return NextResponse.json({ status: "forbidden" }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parse = createCourseSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ status: "error", errors: parse.error.flatten() }, { status: 400 });
  }

  try {
    const course = await prisma.course.create({
      data: {
        ...parse.data,
        slug: parse.data.slug.toLowerCase(),
      },
    });
    return NextResponse.json({ status: "ok", data: course }, { status: 201 });
  } catch (error) {
    console.error("POST /api/courses error", error);
    return NextResponse.json({ status: "error", message: "Failed to create course" }, { status: 500 });
  }
}
