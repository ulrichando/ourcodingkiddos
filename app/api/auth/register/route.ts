import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Role } from "../../../../generated/prisma-client";
import prisma from "../../../../lib/prisma";
import { createNotification } from "../../notifications/route";
import { logCreate } from "../../../../lib/audit";
import { sendVerificationEmail } from "../../../../lib/email";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = body?.name?.trim();
  const email = body?.email?.toLowerCase().trim();
  const password = body?.password;
  const roleInput = String(body?.role || "").toUpperCase();

  // Only parents can self-register. Instructors must be created by an admin.
  if (roleInput === "INSTRUCTOR" || roleInput === "ADMIN") {
    return NextResponse.json(
      { status: "error", message: "Only parents can register. Instructors are added by administrators." },
      { status: 403 }
    );
  }
  const role: Role = "PARENT";

  if (!name || !email || !password || password.length < 8) {
    return NextResponse.json({ status: "error", message: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ status: "error", message: "Email already registered" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      role,
      ...(role === "PARENT"
        ? {
            parentProfile: {
              create: {
                phone: null,
              },
            },
          }
        : {}),
    },
  });

  // Log user registration
  logCreate(email, "User", user.id, `New ${role.toLowerCase()} registered: ${name}`, user.id, { role }).catch(() => {});

  // Send welcome notification to new parent
  createNotification(
    email,
    `Welcome to Coding Kiddos, ${name}!`,
    "Get started by adding your first student and exploring our interactive coding courses!",
    "welcome",
    "/dashboard/parent/add-student",
    { userName: name, userRole: role }
  );

  // Generate email verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Save verification token
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: verificationToken,
      expires: tokenExpires,
    },
  });

  // Send verification email
  const baseUrl = process.env.NEXTAUTH_URL || "https://ourcodingkiddos.com";
  const verifyUrl = `${baseUrl}/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
  sendVerificationEmail(email, name, verifyUrl).catch((err) => {
    console.error("[register] Failed to send verification email:", err);
  });

  return NextResponse.json({
    status: "ok",
    user: { id: user.id, email: user.email },
    message: "Account created! Please check your email to verify your address."
  }, { status: 201 });
}
