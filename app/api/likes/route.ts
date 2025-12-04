import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/likes - Like a blog post, project, or comment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Please sign in to like" }, { status: 401 });
    }

    const body = await request.json();
    const { blogPostId, studentProjectId, commentId } = body;

    if (!blogPostId && !studentProjectId && !commentId) {
      return NextResponse.json({ error: "Must specify what to like" }, { status: 400 });
    }

    // Check if already liked
    const existingLike = await prisma.like.findFirst({
      where: {
        userEmail: session.user.email,
        ...(blogPostId && { blogPostId }),
        ...(studentProjectId && { studentProjectId }),
        ...(commentId && { commentId }),
      },
    });

    if (existingLike) {
      return NextResponse.json({ error: "Already liked" }, { status: 400 });
    }

    const like = await prisma.like.create({
      data: {
        userEmail: session.user.email,
        blogPostId,
        studentProjectId,
        commentId,
      },
    });

    return NextResponse.json({ like }, { status: 201 });
  } catch (error) {
    console.error("Error creating like:", error);
    return NextResponse.json({ error: "Failed to like" }, { status: 500 });
  }
}

// DELETE /api/likes - Unlike a blog post, project, or comment
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 });
    }

    const body = await request.json();
    const { blogPostId, studentProjectId, commentId } = body;

    if (!blogPostId && !studentProjectId && !commentId) {
      return NextResponse.json({ error: "Must specify what to unlike" }, { status: 400 });
    }

    // Find and delete the like
    const like = await prisma.like.findFirst({
      where: {
        userEmail: session.user.email,
        ...(blogPostId && { blogPostId }),
        ...(studentProjectId && { studentProjectId }),
        ...(commentId && { commentId }),
      },
    });

    if (!like) {
      return NextResponse.json({ error: "Like not found" }, { status: 404 });
    }

    await prisma.like.delete({
      where: { id: like.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing like:", error);
    return NextResponse.json({ error: "Failed to unlike" }, { status: 500 });
  }
}
