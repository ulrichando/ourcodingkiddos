import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

// Force dynamic rendering - disable all caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = typeof (session?.user as any)?.role === "string" ? ((session?.user as any).role as string).toUpperCase() : null;
  if (!session?.user || (role !== "ADMIN" && role !== "INSTRUCTOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const title = (body?.title || "").trim();
  const description = (body?.description || "").trim();
  const language = (body?.language || "HTML").toUpperCase();
  const level = (body?.level || "BEGINNER").toUpperCase();
  const ageGroup = (body?.ageGroup || "AGES_7_10").toUpperCase();
  const totalXp = typeof body?.totalXp === "number" ? body.totalXp : 0;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const baseSlug = slugify(title) || `course-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const exists = await prisma.course.findUnique({ where: { slug } });
    if (!exists) break;
    slug = `${baseSlug}-${counter++}`;
  }

  const course = await prisma.course.create({
    data: {
      title,
      slug,
      description: description || title,
      language: language as any,
      level: level as any,
      ageGroup: ageGroup as any,
      isPublished: true,
      totalXp: totalXp || 0,
    },
  });

  return NextResponse.json({ course });
}

export async function PATCH(req: Request) {
  console.log("=== PATCH /api/admin/courses ===");

  const session = await getServerSession(authOptions);
  const role = typeof (session?.user as any)?.role === "string" ? ((session?.user as any).role as string).toUpperCase() : null;

  console.log("Session user:", session?.user?.email);
  console.log("User role:", role);

  if (!session?.user || (role !== "ADMIN" && role !== "INSTRUCTOR")) {
    console.log("✗ Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bodyText = await req.text();
  console.log("Request body text:", bodyText);

  let body: any = {};
  try {
    body = bodyText ? JSON.parse(bodyText) : {};
    console.log("Parsed body:", JSON.stringify(body, null, 2));
  } catch (e) {
    console.error("✗ Failed to parse JSON:", e);
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const id = body?.id;
  console.log("Course ID:", id);

  if (!id) {
    console.log("✗ No course ID provided");
    return NextResponse.json({ error: "Course id is required" }, { status: 400 });
  }

  const updateData: any = {};
  if (typeof body.title === "string" && body.title.trim()) updateData.title = body.title.trim();
  if (typeof body.description === "string") updateData.description = body.description.trim();
  if (typeof body.language === "string") updateData.language = body.language.toUpperCase();
  if (typeof body.level === "string") updateData.level = body.level.toUpperCase();
  if (typeof body.ageGroup === "string") updateData.ageGroup = body.ageGroup.toUpperCase();
  if (typeof body.totalXp === "number") updateData.totalXp = body.totalXp;
  if (typeof body.isPublished === "boolean") {
    updateData.isPublished = body.isPublished;
    console.log("Setting isPublished to:", body.isPublished);
  }

  console.log("Update data:", JSON.stringify(updateData, null, 2));

  if (Object.keys(updateData).length === 0) {
    console.log("✗ No valid fields to update");
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  try {
    console.log("Updating course in database...");
    const course = await prisma.course.update({
      where: { id },
      data: updateData,
    });
    console.log("✓ Course updated successfully:", JSON.stringify(course, null, 2));
    console.log("Updated course isPublished value:", course.isPublished);

    // Verify the update by reading it back
    console.log("Verifying update by reading from database...");
    const verifiedCourse = await prisma.course.findUnique({
      where: { id }
    });
    console.log("✓ Verified course isPublished value:", verifiedCourse?.isPublished);

    if (verifiedCourse?.isPublished !== updateData.isPublished) {
      console.error("⚠️  WARNING: Database value doesn't match update!");
      console.error("Expected:", updateData.isPublished);
      console.error("Got:", verifiedCourse?.isPublished);
    }

    console.log("=== END PATCH ===\n");

    return NextResponse.json({
      course,
      _debug: {
        updatedAt: new Date().toISOString(),
        verified: verifiedCourse?.isPublished === updateData.isPublished
      }
    });
  } catch (error) {
    console.error("✗ Database update failed:", error);
    return NextResponse.json({ error: "Database update failed" }, { status: 500 });
  }
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

  const courseId = body?.courseId;
  if (!courseId) return NextResponse.json({ error: "Course id is required" }, { status: 400 });

  // Clean up lessons first to avoid FK constraint issues
  await prisma.lesson.deleteMany({ where: { courseId } });
  await prisma.course.delete({ where: { id: courseId } });

  return NextResponse.json({ success: true });
}
