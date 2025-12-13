import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { getToken } from "next-auth/jwt";
import { createNotification } from "../notifications/route";
import { logCreate } from "../../../lib/audit";
import { logger } from "../../../lib/logger";


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
  let password = String(body?.password || "");
  // COPPA Compliance: Use username instead of email for child accounts
  const providedUsername = String(body?.username || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const age = Number(body?.age) || null;
  const ageGroup = String(body?.ageGroup || "").toUpperCase() || null;
  const avatar = String(body?.avatar || "");
  const parentEmail = effectiveParentEmail;
  const accessibility = body?.accessibility || {};

  // New fields from enhanced form
  const profileImage = body?.profileImage || null;
  const codingInterests = body?.codingInterests || [];
  const learningStyle = body?.learningStyle || null;
  const learningGoals = body?.learningGoals || null;
  const parentNotes = body?.parentNotes || null;

  // COPPA consent fields
  const coppaConsent = body?.coppaConsent || false;
  const photoConsent = body?.photoConsent || false;

  if (!name || !parentEmail || !providedUsername) {
    return NextResponse.json({ error: "Name and username are required" }, { status: 400 });
  }

  // Validate username format
  if (providedUsername.length < 3 || providedUsername.length > 30) {
    return NextResponse.json({ error: "Username must be 3-30 characters" }, { status: 400 });
  }

  try {
    // COPPA Compliance: Generate a pseudo-email from username (not used for communication)
    // All communications go to the parent's email
    const email = `${providedUsername}@student.ourcodingkiddos.local`;

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "This username is already taken" }, { status: 400 });
    }

    // Find the parent's profile to properly link the student
    const parentUser = await prisma.user.findUnique({
      where: { email: parentEmail },
      include: { parentProfile: true },
    });

    if (!parentUser?.parentProfile) {
      return NextResponse.json({ error: "Parent profile not found" }, { status: 400 });
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
            guardianId: parentUser.parentProfile.id, // Properly link to parent profile
            name,
            avatar: profileImage || avatar, // Use uploaded image if available, otherwise use avatar
            age,
            ageGroup: ageGroup || undefined,
            // COPPA consent stored in badges for audit purposes
            accessibilitySettings: {
              dyslexia_font: !!accessibility?.dyslexia_font,
              high_contrast: !!accessibility?.high_contrast,
              larger_text: !!accessibility?.larger_text,
              reduce_motion: !!accessibility?.reduce_motion,
              screen_reader: !!accessibility?.screen_reader,
              keyboard_navigation: !!accessibility?.keyboard_navigation,
            },
            badges: {
              interests: codingInterests,
              learningStyle,
              learningGoals,
              parentNotes,
              // COPPA audit trail
              coppaConsent: coppaConsent ? { granted: true, timestamp: new Date().toISOString() } : undefined,
              photoConsent: photoConsent ? { granted: true, timestamp: new Date().toISOString() } : undefined,
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

    // Log student creation
    logCreate(parentEmail, "Student", user.id, `Added student: ${name} (username: ${providedUsername})`, undefined, {
      studentName: name,
      username: providedUsername,
      ageGroup,
    }).catch(() => {});

    // Send notification to parent
    createNotification(
      parentEmail,
      "Student Added Successfully! 🎉",
      `${name} has been added to your account. Username: ${providedUsername}`,
      "student_added",
      "/dashboard/parent/students",
      { studentId: user.id, studentName: name, username: providedUsername }
    );

    return NextResponse.json({ status: "ok", user, credentials: { password, username: providedUsername } });
  } catch (err: any) {
    logger.db.error("Student create failed", err);
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

  // Build where clause - use guardian relationship OR parentEmail for backwards compatibility
  let whereClause: any = {};
  if (studentId) {
    whereClause.id = studentId;
  }
  if (!isElevated && parentEmail) {
    // Find parent's profile to get students linked via guardianId
    const parentUser = await prisma.user.findUnique({
      where: { email: parentEmail },
      include: { parentProfile: true },
    });
    if (parentUser?.parentProfile) {
      // Get students by guardian relationship OR legacy parentEmail
      whereClause.OR = [
        { guardianId: parentUser.parentProfile.id },
        { parentEmail: parentEmail },
      ];
    } else {
      // Fallback to parentEmail only
      whereClause.parentEmail = parentEmail;
    }
  }

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
      guardianId: true,
      lastActiveDate: true,
      archivedAt: true,
      userId: true,
      user: {
        select: {
          email: true,
          lastSeen: true,
        },
      },
      guardian: {
        select: {
          id: true,
          phone: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
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
