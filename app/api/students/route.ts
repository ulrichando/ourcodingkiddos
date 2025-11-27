import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { getToken } from "next-auth/jwt";

// Helper to build a student email from username
function studentEmailFromUsername(username: string) {
  return `${username.toLowerCase()}@students.ourcodingkiddos.com`;
}

export async function POST(request: NextRequest) {
  // Try server session, fall back to JWT token parsing
  let parentEmailFromSession: string | null = null;
  const session = await getServerSession(authOptions);
  const sessionRole = (session as any)?.user?.role;
  if (session?.user?.email) {
    parentEmailFromSession = session.user.email.toLowerCase();
  } else {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (token?.email) {
      parentEmailFromSession = token.email.toLowerCase();
    }
    // allow parentEmail and role from token if present
    if (!parentEmailFromSession && token?.parentEmail) {
      parentEmailFromSession = String(token.parentEmail).toLowerCase();
    }
  }
  // In development, allow explicit parentEmail in body if session is missing
  const body = await request.json().catch(() => null);
  const bodyParentEmail = String(body?.parentEmail || "").trim().toLowerCase();
  const effectiveParentEmail = parentEmailFromSession || (process.env.NODE_ENV !== "production" ? bodyParentEmail : null);

  if (!effectiveParentEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (sessionRole && !["PARENT", "ADMIN"].includes(sessionRole)) {
    return NextResponse.json({ error: "Only parents can add students" }, { status: 403 });
  }

  const name = String(body?.name || "").trim();
  let username = String(body?.username || "").trim();
  let password = String(body?.password || "");
  const age = Number(body?.age) || null;
  const ageGroup = String(body?.ageGroup || "").toUpperCase() || null;
  const avatar = String(body?.avatar || "");
  const parentEmail = effectiveParentEmail;
  const accessibility = body?.accessibility || {};

  if (!name || !parentEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    // If username is empty, generate one from name + random suffix
    if (!username) {
      const base = name.toLowerCase().replace(/\s+/g, "").slice(0, 12) || "student";
      username = `${base}${Math.floor(100 + Math.random() * 900)}`;
    }

    // Ensure username uniqueness
    let email = studentEmailFromUsername(username);
    let attempts = 0;
    while (attempts < 3) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (!existing) break;
      username = `${username}${Math.floor(Math.random() * 10)}`;
      email = studentEmailFromUsername(username);
      attempts++;
    }

    if (!password) {
      password = Math.random().toString(36).slice(-10);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: "STUDENT",
        // Cast to any to avoid build-time type drift if Prisma client is stale
        studentProfile: {
          create: {
            parentEmail,
            name,
            avatar,
            age,
            ageGroup: ageGroup || undefined,
            accessibilitySettings: {
              dyslexia_font: !!accessibility?.dyslexia_font,
              high_contrast: !!accessibility?.high_contrast,
              larger_text: !!accessibility?.larger_text,
            },
          },
        } as any,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        studentProfile: true,
      },
    });

    return NextResponse.json({ status: "ok", user, credentials: { username, password } });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("[students] create failed", err);
    const msg =
      err?.code === "P2002" || err?.message?.includes("Unique constraint")
        ? "Username already taken"
        : err?.message || "Could not create student";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  let parentEmail: string | null = null;
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) parentEmail = session.user.email.toLowerCase();
  } catch {
    parentEmail = null;
  }
  if (!parentEmail) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (token?.email) parentEmail = token.email.toLowerCase();
  }

  if (!parentEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const students = (await prisma.studentProfile.findMany({
    where: { parentEmail: parentEmail } as any,
    select: {
      id: true,
      name: true,
      age: true,
      avatar: true,
      totalXp: true,
      currentLevel: true,
      streakDays: true,
    } as any,
  })) as any[];

  return NextResponse.json({ students });
}
