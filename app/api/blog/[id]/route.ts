import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";

// GET /api/blog/[id] - Get a single blog post by ID or slug
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
    let post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
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

    if (!post) {
      post = await prisma.blogPost.findUnique({
        where: { slug: id },
        include: {
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
    }

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Only show published posts to non-admins
    if (!isAdmin && !post.isPublished) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Increment view count (don't await, fire and forget)
    prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    // Check if current user has liked this post
    let userHasLiked = false;
    if (session?.user?.email) {
      const like = await prisma.like.findUnique({
        where: {
          userEmail_blogPostId: {
            userEmail: session.user.email,
            blogPostId: post.id,
          },
        },
      });
      userHasLiked = !!like;
    }

    return NextResponse.json({ post, userHasLiked });
  } catch (error) {
    logger.db.error("Error fetching blog post", error);
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}

// PUT /api/blog/[id] - Update a blog post (admin only)
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
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      isPublished,
      isFeatured,
    } = body;

    // Check if post exists
    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Check if new slug conflicts
    if (slug && slug !== existing.slug) {
      const slugConflict = await prisma.blogPost.findUnique({
        where: { slug },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: "A blog post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Set publishedAt when first publishing
    const publishedAt =
      isPublished && !existing.isPublished ? new Date() : existing.publishedAt;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(featuredImage !== undefined && { featuredImage }),
        ...(category !== undefined && { category }),
        ...(tags !== undefined && { tags }),
        ...(isPublished !== undefined && { isPublished, publishedAt }),
        ...(isFeatured !== undefined && { isFeatured }),
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    logger.db.error("Error updating blog post", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

// DELETE /api/blog/[id] - Delete a blog post (admin only)
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

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.db.error("Error deleting blog post", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
