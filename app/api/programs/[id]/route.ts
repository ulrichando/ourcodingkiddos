import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/programs/[id] - Get a single program by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const isAdmin = userRole === "ADMIN";

    // Try to find by ID first, then by slug
    let program = await prisma.program.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            course: {
              include: {
                lessons: {
                  where: { isPublished: true },
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                    orderIndex: true,
                  },
                  orderBy: { orderIndex: "asc" },
                },
              },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!program) {
      program = await prisma.program.findUnique({
        where: { slug: id },
        include: {
          courses: {
            include: {
              course: {
                include: {
                  lessons: {
                    where: { isPublished: true },
                    select: {
                      id: true,
                      title: true,
                      slug: true,
                      orderIndex: true,
                    },
                    orderBy: { orderIndex: "asc" },
                  },
                },
              },
            },
            orderBy: { orderIndex: "asc" },
          },
          _count: {
            select: { enrollments: true },
          },
        },
      });
    }

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Only show published programs to non-admins
    if (!isAdmin && !program.isPublished) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({ program });
  } catch (error) {
    console.error("Error fetching program:", error);
    return NextResponse.json({ error: "Failed to fetch program" }, { status: 500 });
  }
}

// PUT /api/programs/[id] - Update a program (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      startDate,
      endDate,
      isFeatured,
      isPublished,
      courseIds,
    } = body;

    // Check if program exists
    const existing = await prisma.program.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Check if new slug conflicts with another program
    if (slug && slug !== existing.slug) {
      const slugConflict = await prisma.program.findUnique({
        where: { slug },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: "A program with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update program and manage course associations
    const program = await prisma.$transaction(async (tx) => {
      // If courseIds provided, update associations
      if (courseIds !== undefined) {
        // Delete existing associations
        await tx.programCourse.deleteMany({
          where: { programId: id },
        });

        // Create new associations
        if (courseIds.length > 0) {
          await tx.programCourse.createMany({
            data: courseIds.map((courseId: string, index: number) => ({
              programId: id,
              courseId,
              orderIndex: index,
            })),
          });
        }
      }

      // Update the program
      return tx.program.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(slug !== undefined && { slug }),
          ...(description !== undefined && { description }),
          ...(shortDescription !== undefined && { shortDescription }),
          ...(thumbnailUrl !== undefined && { thumbnailUrl }),
          ...(language !== undefined && { language }),
          ...(ageGroup !== undefined && { ageGroup }),
          ...(level !== undefined && { level }),
          ...(sessionCount !== undefined && { sessionCount }),
          ...(sessionDuration !== undefined && { sessionDuration }),
          ...(priceCents !== undefined && { priceCents }),
          ...(originalPriceCents !== undefined && { originalPriceCents }),
          ...(features !== undefined && { features }),
          ...(curriculum !== undefined && { curriculum }),
          ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
          ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
          ...(isFeatured !== undefined && { isFeatured }),
          ...(isPublished !== undefined && { isPublished }),
        },
        include: {
          courses: {
            include: {
              course: true,
            },
            orderBy: { orderIndex: "asc" },
          },
        },
      });
    });

    return NextResponse.json({ program });
  } catch (error) {
    console.error("Error updating program:", error);
    return NextResponse.json({ error: "Failed to update program" }, { status: 500 });
  }
}

// DELETE /api/programs/[id] - Delete a program (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if program has active enrollments
    const enrollmentCount = await prisma.programEnrollment.count({
      where: {
        programId: id,
        status: { in: ["ACTIVE", "PENDING_PAYMENT"] },
      },
    });

    if (enrollmentCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete program with active enrollments" },
        { status: 400 }
      );
    }

    await prisma.program.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting program:", error);
    return NextResponse.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
