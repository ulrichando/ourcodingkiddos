import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// PATCH - Update review (admin only - full edit)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      isApproved,
      isFeatured,
      authorName,
      authorEmail,
      authorPhoto,
      childName,
      childAge,
      rating,
      title,
      content
    } = body;

    const review = await prisma.parentReview.update({
      where: { id },
      data: {
        ...(typeof isApproved === "boolean" && { isApproved }),
        ...(typeof isFeatured === "boolean" && { isFeatured }),
        ...(authorName && { authorName }),
        ...(authorEmail && { authorEmail }),
        ...(authorPhoto !== undefined && { authorPhoto }),
        ...(childName !== undefined && { childName }),
        ...(childAge !== undefined && { childAge: childAge ? parseInt(childAge) : null }),
        ...(rating && { rating: Math.min(5, Math.max(1, rating)) }),
        ...(title !== undefined && { title }),
        ...(content && { content }),
      },
    });

    return NextResponse.json({ status: "ok", review });
  } catch (error) {
    console.error("[reviews] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

// DELETE - Delete review (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.parentReview.delete({ where: { id } });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[reviews] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
