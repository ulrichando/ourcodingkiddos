import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/auth";

const updateSchema = z
  .object({
    title: z.string().min(3).optional(),
    slug: z.string().min(3).optional(),
    order: z.number().int().min(0).optional(),
    content: z.any().optional(),
    resources: z.any().optional(),
    durationMin: z.number().int().positive().optional(),
  })
  .strict();

// GET /api/lessons/:id - fetch single lesson (includes quiz/project when needed)
export async function GET(_request: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  try {
    const lesson = await prisma.lesson.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        quiz: { include: { questions: { include: { answers: true }, orderBy: { order: "asc" } } } },
        project: true,
      },
    });
    if (!lesson) return NextResponse.json({ status: "not-found" }, { status: 404 });
    return NextResponse.json({ status: "ok", data: lesson });
  } catch (error) {
    console.error("GET /api/lessons/:id error", error);
    return NextResponse.json({ status: "error", message: "Failed to fetch lesson" }, { status: 500 });
  }
}

// PATCH /api/lessons/:id - partial update
export async function PATCH(request: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes((session.user as any).role)) {
    return NextResponse.json({ status: "forbidden" }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ status: "error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = context.params;
  try {
    const lesson = await prisma.lesson.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ status: "ok", data: lesson });
  } catch (error) {
    console.error("PATCH /api/lessons/:id error", error);
    return NextResponse.json({ status: "error", message: "Failed to update lesson" }, { status: 500 });
  }
}

// DELETE /api/lessons/:id
export async function DELETE(_request: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes((session.user as any).role)) {
    return NextResponse.json({ status: "forbidden" }, { status: 403 });
  }
  const { id } = context.params;
  try {
    await prisma.lesson.delete({ where: { id } });
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("DELETE /api/lessons/:id error", error);
    return NextResponse.json({ status: "error", message: "Failed to delete lesson" }, { status: 500 });
  }
}
