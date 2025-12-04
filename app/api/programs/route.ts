import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/programs - List all published programs (public) or all programs (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const isAdmin = userRole === "ADMIN";

    const { searchParams } = new URL(request.url);
    const ageGroup = searchParams.get("ageGroup");
    const language = searchParams.get("language");
    const sessionCount = searchParams.get("sessionCount");

    const where: any = {};

    // Only show published programs to non-admins
    if (!isAdmin) {
      where.isPublished = true;
    }

    if (ageGroup) {
      where.ageGroup = ageGroup;
    }

    if (language) {
      where.language = language;
    }

    if (sessionCount) {
      where.sessionCount = parseInt(sessionCount);
    }

    const programs = await prisma.program.findMany({
      where,
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                thumbnailUrl: true,
              },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { orderIndex: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ programs });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
  }
}

// POST /api/programs - Create a new program (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      description,
      shortDescription,
      thumbnailUrl,
      language,
      ageGroup,
      level,
      sessionCount,
      sessionDuration,
      priceCents,
      originalPriceCents,
      features,
      curriculum,
      isFeatured,
      isPublished,
      courseIds,
    } = body;

    // Validate required fields
    if (!title || !slug || !description || !language || !ageGroup || !sessionCount || !priceCents) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.program.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A program with this slug already exists" },
        { status: 400 }
      );
    }

    const program = await prisma.program.create({
      data: {
        title,
        slug,
        description,
        shortDescription,
        thumbnailUrl,
        language,
        ageGroup,
        level: level || "BEGINNER",
        sessionCount,
        sessionDuration: sessionDuration || 60,
        priceCents,
        originalPriceCents,
        features: features || [],
        curriculum: curriculum || [],
        isFeatured: isFeatured || false,
        isPublished: isPublished || false,
        courses: courseIds?.length
          ? {
              create: courseIds.map((courseId: string, index: number) => ({
                courseId,
                orderIndex: index,
              })),
            }
          : undefined,
      },
      include: {
        courses: {
          include: {
            course: true,
          },
        },
      },
    });

    return NextResponse.json({ program }, { status: 201 });
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json({ error: "Failed to create program" }, { status: 500 });
  }
}
