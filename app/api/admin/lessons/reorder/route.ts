import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = typeof (session?.user as any)?.role === "string" ? ((session?.user as any).role as string).toUpperCase() : null;
  if (!session?.user || (role !== "ADMIN" && role !== "INSTRUCTOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any = {};
  try {
    const raw = await req.text();
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const courseId = body?.courseId as string | undefined;
  const lessonIds = Array.isArray(body?.lessonIds) ? (body.lessonIds as string[]) : [];

  if (!courseId || !lessonIds.length) {
    return NextResponse.json({ error: "courseId and lessonIds are required" }, { status: 400 });
  }

  // Validate that all lessons belong to the course
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    select: { id: true },
  });
  const lessonIdSet = new Set(lessons.map((l) => l.id));
  const allValid = lessonIds.every((id) => lessonIdSet.has(id));
  if (!allValid || lessonIds.length !== lessons.length) {
    return NextResponse.json({ error: "lessonIds must include all lessons for the course" }, { status: 400 });
  }

  await prisma.$transaction(
    lessonIds.map((id, index) =>
      prisma.lesson.update({
        where: { id },
        data: { orderIndex: index },
      })
    )
  );

  return NextResponse.json({ success: true });
}
