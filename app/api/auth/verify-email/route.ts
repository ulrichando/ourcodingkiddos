import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { sendVerificationEmail } from "../../../../lib/email";
import crypto from "crypto";
import { logger } from "../../../../lib/logger";

// POST - Send verification email
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = body?.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { status: "error", message: "Email is required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, emailVerified: true },
    });

    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json({ status: "ok", message: "If an account exists, a verification email has been sent." });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { status: "error", message: "Email is already verified" },
        { status: 400 }
      );
    }

    // Delete any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Generate a new token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send verification email
    const baseUrl = process.env.NEXTAUTH_URL || "https://ourcodingkiddos.com";
    const verifyUrl = `${baseUrl}/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    await sendVerificationEmail(user.email, user.name, verifyUrl);

    return NextResponse.json({
      status: "ok",
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    logger.auth.error("verify-email POST error", error);
    return NextResponse.json(
      { status: "error", message: "Failed to send verification email" },
      { status: 500 }
    );
  }
}

// GET - Verify email with token
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email")?.toLowerCase().trim();

    if (!token || !email) {
      return NextResponse.json(
        { status: "error", message: "Invalid verification link" },
        { status: 400 }
      );
    }

    // Find token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token,
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { status: "error", message: "Invalid or expired verification link" },
        { status: 400 }
      );
    }

    // Check if expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: email,
            token,
          },
        },
      });

      return NextResponse.json(
        { status: "error", message: "Verification link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Update user's emailVerified field
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Delete used token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });

    return NextResponse.json({
      status: "ok",
      message: "Email verified successfully! You can now use all features.",
    });
  } catch (error) {
    logger.auth.error("verify-email GET error", error);
    return NextResponse.json(
      { status: "error", message: "Failed to verify email" },
      { status: 500 }
    );
  }
}
