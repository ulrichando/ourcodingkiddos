import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/showcase/[id] - Get a single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const isAdmin = userRole === "ADMIN";

    const project = await prisma.studentProject.findUnique({
      where: { id },
      include: {
        studentProfile: {
          select: {
            id: true,
            name: true,
            avatar: true,
            ageGroup: true,
            currentLevel: true,
          },
        },
        comments: {
          where: { isApproved: true, parentCommentId: null },
          include: {
            replies: {
              where: { isApproved: true },
              orderBy: { createdAt: "asc" },
            },
            _count: { select: { likes: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Only show approved projects to non-admins (unless it's their own)
    const isOwner = session?.user?.email &&
      (await prisma.studentProfile.findFirst({
        where: {
          id: project.studentProfileId,
          user: { email: session.user.email },
        },
      }));

    if (!isAdmin && !isOwner && (!project.isApproved || !project.isPublished)) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Increment view count (fire and forget)
    prisma.studentProject.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    // Check if current user has liked this project
    let userHasLiked = false;
    if (session?.user?.email) {
      const like = await prisma.like.findUnique({
        where: {
          userEmail_studentProjectId: {
            userEmail: session.user.email,
            studentProjectId: project.id,
          },
        },
      });
      userHasLiked = !!like;
    }

    return NextResponse.json({ project, userHasLiked });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

// PUT /api/showcase/[id] - Update a project (owner or admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    const isAdmin = userRole === "ADMIN";

    const existing = await prisma.studentProject.findUnique({
      where: { id },
      include: {
        studentProfile: {
          include: { user: { select: { email: true } } },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check ownership
    const isOwner = existing.studentProfile.user.email === session.user.email;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      githubUrl,
      demoUrl,
      thumbnailUrl,
      videoUrl,
      language,
      tags,
      isPublished,
      isApproved, // Admin only
      isFeatured, // Admin only
    } = body;

    const updateData: any = {};

    // Fields anyone can update
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (demoUrl !== undefined) updateData.demoUrl = demoUrl;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (language !== undefined) updateData.language = language;
    if (tags !== undefined) updateData.tags = tags;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    // Admin-only fields
    if (isAdmin) {
      if (isApproved !== undefined) updateData.isApproved = isApproved;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    }

    const project = await prisma.studentProject.update({
      where: { id },
      data: updateData,
      include: {
        studentProfile: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE /api/showcase/[id] - Delete a project (owner or admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    const isAdmin = userRole === "ADMIN";

    const existing = await prisma.studentProject.findUnique({
      where: { id },
      include: {
        studentProfile: {
          include: { user: { select: { email: true } } },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check ownership
    const isOwner = existing.studentProfile.user.email === session.user.email;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.studentProject.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
