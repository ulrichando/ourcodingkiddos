import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

// GET - Fetch approved reviews (public) or all reviews (admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured") === "true";
    const all = searchParams.get("all") === "true";

    // Check if admin wants all reviews
    if (all) {
      const session = await getServerSession(authOptions);
      if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const reviews = await prisma.parentReview.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ reviews });
    }

    // Public: only approved reviews
    const reviews = await prisma.parentReview.findMany({
      where: {
        isApproved: true,
        ...(featured && { isFeatured: true }),
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: featured ? 6 : 50,
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    logger.api.error("Failed to fetch reviews", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST - Submit a new review (parents or admins)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Please sign in to submit a review" }, { status: 401 });
    }

    const body = await request.json();
    const { rating, title, content, childName, childAge, authorPhoto, authorName, authorEmail, isApproved, isFeatured } = body;

    // Admin can create reviews on behalf of others
    const isAdmin = session.user.role === "ADMIN";

    if (!isAdmin && session.user.role !== "PARENT") {
      return NextResponse.json({ error: "Only parents can submit reviews" }, { status: 403 });
    }

    if (!content || content.trim().length < 20) {
      return NextResponse.json({ error: "Review must be at least 20 characters" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // For non-admins, check if user already has a review
    if (!isAdmin) {
      const existingReview = await prisma.parentReview.findFirst({
        where: { authorEmail: session.user.email },
      });

      if (existingReview) {
        return NextResponse.json(
          { error: "You have already submitted a review. Contact us if you'd like to update it." },
          { status: 400 }
        );
      }
    }

    const review = await prisma.parentReview.create({
      data: {
        authorEmail: isAdmin && authorEmail ? authorEmail : session.user.email,
        authorName: isAdmin && authorName ? authorName : (session.user.name || "Anonymous Parent"),
        authorPhoto: authorPhoto || session.user.image,
        rating: Math.min(5, Math.max(1, rating)),
        title: title?.trim() || null,
        content: content.trim(),
        childName: childName?.trim() || null,
        childAge: childAge ? parseInt(childAge) : null,
        isApproved: isAdmin ? (isApproved ?? true) : false, // Admin reviews auto-approved
        isFeatured: isAdmin ? (isFeatured ?? false) : false,
      },
    });

    return NextResponse.json({
      status: "ok",
      message: isAdmin
        ? "Review created successfully."
        : "Thank you for your review! It will be visible once approved by our team.",
      review,
    });
  } catch (error) {
    logger.api.error("Failed to submit review", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
