import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Please sign in to comment" }, { status: 401 });
    }

    const body = await request.json();
    const { blogPostId, studentProjectId, parentCommentId, content } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    if (!blogPostId && !studentProjectId) {
      return NextResponse.json({ error: "Must specify a blog post or project to comment on" }, { status: 400 });
    }

    const userRole = (session.user as any)?.role || "PARENT";

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorEmail: session.user.email,
        authorName: session.user.name,
        authorRole: userRole,
        blogPostId,
        studentProjectId,
        parentCommentId,
      },
      include: {
        replies: true,
        _count: { select: { likes: true } },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    logger.api.error("Failed to create comment", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

// GET /api/comments - Get comments for a specific post or project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogPostId = searchParams.get("blogPostId");
    const studentProjectId = searchParams.get("studentProjectId");

    if (!blogPostId && !studentProjectId) {
      return NextResponse.json({ error: "Must specify blogPostId or studentProjectId" }, { status: 400 });
    }

    const where: any = {
      isApproved: true,
      parentCommentId: null, // Only get top-level comments
    };

    if (blogPostId) {
      where.blogPostId = blogPostId;
    }
    if (studentProjectId) {
      where.studentProjectId = studentProjectId;
    }

    const comments = await prisma.comment.findMany({
      where,
      include: {
        replies: {
          where: { isApproved: true },
          include: {
            _count: { select: { likes: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    logger.api.error("Failed to fetch comments", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}
