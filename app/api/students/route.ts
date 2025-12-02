import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { getToken } from "next-auth/jwt";
import { createNotification } from "../notifications/route";
import { logCreate } from "../../../lib/audit";
import { isSubscriptionValid } from "../../../lib/subscription";

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

  // Check subscription status for parents (admins bypass this check)
  if (sessionRole === "PARENT") {
    const subscription = await prisma.subscription.findFirst({
      where: {
        OR: [
          { user: { email: effectiveParentEmail } },
          { parentEmail: effectiveParentEmail },
        ],
      },
      orderBy: { currentPeriodEnd: "desc" },
      select: {
        status: true,
        planType: true,
        endDate: true,
        currentPeriodEnd: true,
        trialEndsAt: true,
      },
    });

    if (!isSubscriptionValid(subscription)) {
      const status = subscription?.status?.toUpperCase();
      let errorMessage = "Active subscription required. Please start your free trial or upgrade your plan to add students.";

      if (status === "PAST_DUE" || status === "UNPAID") {
        errorMessage = "Your payment has failed. Please update your payment method to continue adding students.";
      } else if (status === "CANCELED") {
        errorMessage = "Your subscription has been canceled. Please resubscribe to add students.";
      }

      return NextResponse.json({ error: errorMessage }, { status: 403 });
    }
  }

  const name = String(body?.name || "").trim();
  let username = String(body?.username || "").trim();
  let password = String(body?.password || "");
  const providedEmail = String(body?.email || "").trim().toLowerCase();
  const age = Number(body?.age) || null;
  const ageGroup = String(body?.ageGroup || "").toUpperCase() || null;
  const avatar = String(body?.avatar || "");
  const parentEmail = effectiveParentEmail;
  const accessibility = body?.accessibility || {};

  // New fields from enhanced form
  const profileImage = body?.profileImage || null;
  const birthday = body?.birthday || null;
  const codingInterests = body?.codingInterests || [];
  const learningStyle = body?.learningStyle || null;
  const learningGoals = body?.learningGoals || null;
  const parentNotes = body?.parentNotes || null;

  if (!name || !parentEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    // If username is empty, generate one from name + random suffix
    if (!username) {
      const base = name.toLowerCase().replace(/\s+/g, "").slice(0, 12) || "student";
      username = `${base}${Math.floor(100 + Math.random() * 900)}`;
    }

    // Use provided email if available, otherwise generate from username
    let email = providedEmail || studentEmailFromUsername(username);

    // Check if email already exists
    if (providedEmail) {
      const existingUser = await prisma.user.findUnique({ where: { email: providedEmail } });
      if (existingUser) {
        return NextResponse.json({ error: "This email is already registered" }, { status: 400 });
      }
    } else {
      // Ensure username-based email uniqueness
      let attempts = 0;
      while (attempts < 3) {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (!existing) break;
        username = `${username}${Math.floor(Math.random() * 10)}`;
        email = studentEmailFromUsername(username);
        attempts++;
      }
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
            avatar: profileImage || avatar, // Use uploaded image if available, otherwise use avatar
            age,
            ageGroup: ageGroup || undefined,
            dob: birthday ? new Date(birthday) : undefined, // Map birthday to dob field
            accessibilitySettings: {
              dyslexia_font: !!accessibility?.dyslexia_font,
              high_contrast: !!accessibility?.high_contrast,
              larger_text: !!accessibility?.larger_text,
              reduce_motion: !!accessibility?.reduce_motion,
              screen_reader: !!accessibility?.screen_reader,
              keyboard_navigation: !!accessibility?.keyboard_navigation,
            },
            badges: codingInterests.length > 0 ? { interests: codingInterests, learningStyle, learningGoals, parentNotes } : undefined,
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

    // Log student creation
    logCreate(parentEmail, "Student", user.id, `Added student: ${name} (${username})`, undefined, {
      studentName: name,
      username,
      ageGroup,
    }).catch(() => {});

    // Send notification to parent
    const loginInfo = providedEmail ? `Email: ${providedEmail}` : `Username: ${username}`;
    createNotification(
      parentEmail,
      "Student Added Successfully! 🎉",
      `${name} has been added to your account. ${loginInfo}`,
      "student_added",
      "/dashboard/parent/students",
      { studentId: user.id, studentName: name, username, email }
    );

    return NextResponse.json({ status: "ok", user, credentials: { username, password, email } });
  } catch (err: any) {
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
  let role: string | null = null;
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("id") || undefined;
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) parentEmail = session.user.email.toLowerCase();
    if ((session as any)?.user?.role) role = (session as any).user.role;
  } catch {
    parentEmail = null;
  }
  if (!parentEmail) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (token?.email) parentEmail = token.email.toLowerCase();
    if (token?.role) role = String(token.role);
  }

  if (!parentEmail && !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const isElevated = role === "INSTRUCTOR" || role === "ADMIN";
  const allowDemo = role === "ADMIN" && process.env.NEXT_PUBLIC_USE_DEMO_DATA !== "false";
  const whereClause = isElevated
    ? { ...(studentId ? { id: studentId } : {}) }
    : { parentEmail: parentEmail ?? undefined, ...(studentId ? { id: studentId } : {}) };

  const students = (await prisma.studentProfile.findMany({
    where: whereClause as any,
    select: {
      id: true,
      name: true,
      age: true,
      avatar: true,
      totalXp: true,
      currentLevel: true,
      streakDays: true,
      parentEmail: true,
      lastActiveDate: true,
      archivedAt: true,
      userId: true,
    } as any,
  })) as any[];

  if (students.length === 0) {
    const hasAuthenticatedParent = !!parentEmail || isElevated;

    // Only show demo data when explicitly allowed and no authenticated parent context exists.
    if (allowDemo && !hasAuthenticatedParent) {
      return NextResponse.json({
        students: [
          {
            id: "demo-student-1",
            name: "Demo Student",
            age: 12,
            avatar: "🦊",
            totalXp: 1200,
            currentLevel: 3,
            streakDays: 2,
            parentEmail: "demo.parent@ourcodingkiddos.com",
            lastActiveDate: new Date().toISOString(),
          },
        ],
      });
    }

    return NextResponse.json({ students: [] });
  }

  return NextResponse.json({ students });
}
