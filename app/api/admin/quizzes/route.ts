import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lessonId");
  if (!lessonId) return NextResponse.json({ quiz: null });

  const quiz = await prisma.quiz.findUnique({
    where: { lessonId },
    include: {
      questions: true,
    },
  });

  return NextResponse.json({ quiz });
}

export async function POST(req: Request) {
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

  const { lessonId, questions = [] } = body;
  if (!lessonId) return NextResponse.json({ error: "lessonId is required" }, { status: 400 });

  const lessonExists = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lessonExists) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  const created = await prisma.$transaction(async (tx) => {
    // Ensure only one quiz per lesson
    await tx.quiz.deleteMany({ where: { lessonId } });
    const quiz = await tx.quiz.create({
      data: {
        lessonId,
      },
    });

    if (Array.isArray(questions) && questions.length) {
      await tx.question.createMany({
        data: questions.map((q: any, idx: number) => ({
          quizId: quiz.id,
          question: q.question || "",
          questionType: q.questionType || "MULTIPLE_CHOICE",
          options: q.options ?? null,
          correctAnswer: q.correctAnswer || "",
          explanation: q.explanation || null,
          xpReward: typeof q.xpReward === "number" ? q.xpReward : null,
          orderIndex: typeof q.orderIndex === "number" ? q.orderIndex : idx,
        })),
      });
    }

    return await tx.quiz.findUnique({
      where: { id: quiz.id },
      include: { questions: true },
    });
  });

  return NextResponse.json({ quiz: created });
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

  const { lessonId, questions = [] } = body;
  if (!lessonId) return NextResponse.json({ error: "lessonId is required" }, { status: 400 });

  const lessonExists = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lessonExists) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  const updated = await prisma.$transaction(async (tx) => {
    let quiz = await tx.quiz.findUnique({ where: { lessonId } });
    if (!quiz) {
      quiz = await tx.quiz.create({ data: { lessonId } });
    }
    // Replace questions
    await tx.question.deleteMany({ where: { quizId: quiz.id } });
    if (Array.isArray(questions) && questions.length) {
      await tx.question.createMany({
        data: questions.map((q: any, idx: number) => ({
          quizId: quiz!.id,
          question: q.question || "",
          questionType: q.questionType || "MULTIPLE_CHOICE",
          options: q.options ?? null,
          correctAnswer: q.correctAnswer || "",
          explanation: q.explanation || null,
          xpReward: typeof q.xpReward === "number" ? q.xpReward : null,
          orderIndex: typeof q.orderIndex === "number" ? q.orderIndex : idx,
        })),
      });
    }
    return await tx.quiz.findUnique({ where: { id: quiz.id }, include: { questions: true } });
  });

  return NextResponse.json({ quiz: updated });
}

export async function DELETE(req: Request) {
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

  const lessonId = body?.lessonId as string | undefined;
  if (!lessonId) return NextResponse.json({ error: "lessonId is required" }, { status: 400 });

  await prisma.$transaction([
    prisma.question.deleteMany({ where: { quiz: { lessonId } } }),
    prisma.quiz.deleteMany({ where: { lessonId } }),
  ]);

  return NextResponse.json({ success: true });
}
