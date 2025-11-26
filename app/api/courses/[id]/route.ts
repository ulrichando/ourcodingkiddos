import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/auth";

const updateSchema = z
  .object({
    title: z.string().min(3).optional(),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/i).optional(),
    description: z.string().min(10).optional(),
    category: z.string().optional(),
    level: z.string().optional(),
    published: z.boolean().optional(),
    thumbnail: z.string().url().optional(),
  })
  .strict();

// GET /api/courses/:id - fetch a single course
export async function GET(_request: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  try {
    const course = await prisma.course.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { lessons: { orderBy: { order: "asc" } } },
    });
    if (!course) return NextResponse.json({ status: "not-found" }, { status: 404 });
    return NextResponse.json({ status: "ok", data: course });
  } catch (error) {
    console.error("GET /api/courses/:id error", error);
    return NextResponse.json({ status: "error", message: "Failed to fetch course" }, { status: 500 });
  }
}

// PATCH /api/courses/:id - partial update
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
    const course = await prisma.course.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ status: "ok", data: course });
  } catch (error) {
    console.error("PATCH /api/courses/:id error", error);
    return NextResponse.json({ status: "error", message: "Failed to update course" }, { status: 500 });
  }
}

// DELETE /api/courses/:id
export async function DELETE(_request: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes((session.user as any).role)) {
    return NextResponse.json({ status: "forbidden" }, { status: 403 });
  }
  const { id } = context.params;
  try {
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("DELETE /api/courses/:id error", error);
    return NextResponse.json({ status: "error", message: "Failed to delete course" }, { status: 500 });
  }
}
