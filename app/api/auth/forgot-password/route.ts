import { NextResponse } from "next/server";
import { prismaBase } from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prismaBase.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, you will receive a password reset link.",
      });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Delete any existing tokens for this email
    await prismaBase.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Create new token
    await prismaBase.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Build reset URL
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // Send email using Resend
    const result = await sendPasswordResetEmail(email, user.name, resetUrl);

    if (!result.success) {
      console.error("[forgot-password] Email send failed:", result.error);
      // Still return success to prevent email enumeration
      // But log for debugging
      if (process.env.NODE_ENV === "development") {
        console.log("[Password Reset] Reset URL:", resetUrl);
      }
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset link.",
      // Only include reset URL in development if email failed
      ...(process.env.NODE_ENV === "development" && !result.success && { resetUrl }),
    });
  } catch (error) {
    console.error("[forgot-password] Error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}
