import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/auth";
import { CourseLevel } from "../../../../generated/prisma-client";
import { logUpdate, logDelete } from "../../../../lib/audit";

function normalizeSlug(text: string | null | undefined) {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const updateSchema = z
  .object({
    title: z.string().min(3).optional(),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/i).optional(),
    description: z.string().min(10).optional(),
    level: z.nativeEnum(CourseLevel).optional(),
    published: z.boolean().optional(),
    thumbnail: z.string().url().optional(),
  })
  .strict();

// GET /api/courses/:id - fetch a single course (by id or slug)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const normalized = normalizeSlug(id);
  try {
    const course = await prisma.course.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
          { slug: id.toLowerCase() },
          { slug: normalized },
          { slug: { equals: id, mode: "insensitive" } },
          { slug: { contains: normalized, mode: "insensitive" } },
        ],
      },
      include: {
        lessons: {
          orderBy: [{ orderIndex: "asc" }, { id: "asc" }],
        },
      },
    });
    if (!course) return NextResponse.json({ status: "not-found" }, { status: 404 });
    return NextResponse.json({ status: "ok", data: course });
  } catch (error) {
    console.error("GET /api/courses/:id error", error);
    return NextResponse.json({ status: "error", message: "Failed to fetch course" }, { status: 500 });
  }
}

// PATCH /api/courses/:id - partial update
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes((session.user as any).role)) {
    return NextResponse.json({ status: "forbidden" }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ status: "error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  try {
    const course = await prisma.course.update({
      where: { id },
      data: parsed.data,
    });

    // Log course update
    const userEmail = session.user.email || "unknown";
    const userId = (session.user as any).id;
    logUpdate(userEmail, "Course", course.id, `Updated course: ${course.title}`, userId, {
      changes: Object.keys(parsed.data),
    }).catch(() => {});

    return NextResponse.json({ status: "ok", data: course });
  } catch (error) {
    console.error("PATCH /api/courses/:id error", error);
    return NextResponse.json({ status: "error", message: "Failed to update course" }, { status: 500 });
  }
}

// DELETE /api/courses/:id
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes((session.user as any).role)) {
    return NextResponse.json({ status: "forbidden" }, { status: 403 });
  }
  const { id } = await params;
  try {
    // Get course info before deletion for logging
    const course = await prisma.course.findUnique({ where: { id }, select: { title: true } });

    await prisma.course.delete({ where: { id } });

    // Log course deletion
    const userEmail = session.user.email || "unknown";
    const userId = (session.user as any).id;
    logDelete(userEmail, "Course", id, `Deleted course: ${course?.title || id}`, userId).catch(() => {});

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("DELETE /api/courses/:id error", error);
    return NextResponse.json({ status: "error", message: "Failed to delete course" }, { status: 500 });
  }
}
