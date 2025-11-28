import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { courses as fallbackCourses } from "../../../../data/courses";
function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const role = typeof (session?.user as any)?.role === "string" ? ((session?.user as any).role as string).toUpperCase() : null;
  if (!session?.user || (role !== "ADMIN" && role !== "INSTRUCTOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  if (!courseId) return NextResponse.json({ lessons: [] });

  try {
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: [{ orderIndex: "asc" }, { id: "asc" }],
      select: {
        id: true,
        title: true,
        description: true,
        xpReward: true,
        orderIndex: true,
      },
    });
    return NextResponse.json({ lessons });
  } catch (e: any) {
    const message = e?.message || "Failed to load lessons";
    return NextResponse.json({ error: message, lessons: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = typeof (session?.user as any)?.role === "string" ? ((session?.user as any).role as string).toUpperCase() : null;
  if (!session?.user || (role !== "ADMIN" && role !== "INSTRUCTOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bodyText = await req.text();
  let body: any = {};
  try {
    body = bodyText ? JSON.parse(bodyText) : {};
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const courseId = body?.courseId || body?.course_id;
  const title = (body?.title || "").trim();
  if (!courseId || !title) {
    return NextResponse.json({ error: "Course and title are required" }, { status: 400 });
  }

  const description = (body?.description || "").trim();
  const content = body?.content || "";
  const videoUrl = body?.videoUrl || body?.video_url || null;
  const exampleCode = body?.exampleCode || body?.example_code || null;
  const exerciseInstructions = body?.exerciseInstructions || body?.exercise_instructions || null;
  const exerciseStarterCode = body?.exerciseStarterCode || body?.exercise_starter_code || null;
  const exerciseSolution = body?.exerciseSolution || body?.exercise_solution || null;
  const xpReward =
    typeof body?.xpReward === "number"
      ? body.xpReward
      : typeof body?.xp_reward === "number"
        ? body.xp_reward
        : 0;
  const orderIndexInput =
    typeof body?.orderIndex === "number"
      ? body.orderIndex
      : typeof body?.order_index === "number"
        ? body.order_index
        : undefined;
  const isPublished =
    typeof body?.isPublished === "boolean"
      ? body.isPublished
      : typeof body?.is_published === "boolean"
        ? body.is_published
        : undefined;

  const baseSlug = slugify(title) || `lesson-${Date.now()}`;
  let slug = baseSlug;

  const courseExists = await prisma.course.findUnique({ where: { id: courseId } });
  if (!courseExists) {
    return NextResponse.json({ error: "Course not found. Please select a valid course." }, { status: 404 });
  }

  let counter = 1;
  while (true) {
    const exists = await prisma.lesson.findFirst({ where: { courseId, slug } });
    if (!exists) break;
    slug = `${baseSlug}-${counter++}`;
  }

  const existingCount = await prisma.lesson.count({ where: { courseId } });
  const orderIndex = typeof orderIndexInput === "number" ? orderIndexInput : existingCount;

  const lesson = await prisma.lesson.create({
    data: {
      courseId,
      title,
      slug,
      description,
      content,
      videoUrl,
      exampleCode,
      exerciseInstructions,
      exerciseStarterCode,
      exerciseSolution,
      xpReward,
      orderIndex,
      isPublished: typeof isPublished === "boolean" ? isPublished : true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      xpReward: true,
      orderIndex: true,
    },
  });

  return NextResponse.json({ lesson });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const role = typeof (session?.user as any)?.role === "string" ? ((session?.user as any).role as string).toUpperCase() : null;
  if (!session?.user || (role !== "ADMIN" && role !== "INSTRUCTOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await req.text();
  let body: any = {};
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const id = body?.id as string | undefined;
  if (!id) return NextResponse.json({ error: "Lesson id is required" }, { status: 400 });

  const updateData: any = {};
  if (typeof body.title === "string" && body.title.trim()) updateData.title = body.title.trim();
  if (typeof body.description === "string") updateData.description = body.description;
  if (typeof body.content === "string") updateData.content = body.content;
  if (typeof body.videoUrl === "string") updateData.videoUrl = body.videoUrl;
  if (typeof body.video_url === "string") updateData.videoUrl = body.video_url;
  if (typeof body.exampleCode === "string") updateData.exampleCode = body.exampleCode;
  if (typeof body.example_code === "string") updateData.exampleCode = body.example_code;
  if (typeof body.exerciseInstructions === "string") updateData.exerciseInstructions = body.exerciseInstructions;
  if (typeof body.exercise_instructions === "string") updateData.exerciseInstructions = body.exercise_instructions;
  if (typeof body.exerciseStarterCode === "string") updateData.exerciseStarterCode = body.exerciseStarterCode;
  if (typeof body.exercise_starter_code === "string") updateData.exerciseStarterCode = body.exercise_starter_code;
  if (typeof body.exerciseSolution === "string") updateData.exerciseSolution = body.exerciseSolution;
  if (typeof body.exercise_solution === "string") updateData.exerciseSolution = body.exercise_solution;
  if (typeof body.xpReward === "number") updateData.xpReward = body.xpReward;
  if (typeof body.xp_reward === "number") updateData.xpReward = body.xp_reward;
  if (typeof body.orderIndex === "number") updateData.orderIndex = body.orderIndex;
  if (typeof body.order_index === "number") updateData.orderIndex = body.order_index;
  if (typeof body.isPublished === "boolean") updateData.isPublished = body.isPublished;
  if (typeof body.is_published === "boolean") updateData.isPublished = body.is_published;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const lesson = await prisma.lesson.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      title: true,
      description: true,
      xpReward: true,
      orderIndex: true,
      content: true,
      videoUrl: true,
      exampleCode: true,
      exerciseInstructions: true,
      isPublished: true,
      courseId: true,
    },
  });

  return NextResponse.json({ lesson });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const role = typeof (session?.user as any)?.role === "string" ? ((session?.user as any).role as string).toUpperCase() : null;
  if (!session?.user || (role !== "ADMIN" && role !== "INSTRUCTOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bodyText = await req.text();
  let body: any = {};
  try {
    body = bodyText ? JSON.parse(bodyText) : {};
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const lessonId = body?.lessonId;
  if (!lessonId) return NextResponse.json({ error: "Lesson id is required" }, { status: 400 });

  await prisma.lesson.delete({ where: { id: lessonId } });
  return NextResponse.json({ success: true });
}
