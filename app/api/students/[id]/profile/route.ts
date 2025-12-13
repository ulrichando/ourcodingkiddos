import { NextResponse, type NextRequest } from "next/server";
import prisma from "../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { AgeGroup } from "@prisma/client";
import { logger } from "../../../../../lib/logger";

export const dynamic = 'force-dynamic';

// GET student profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session as any)?.user?.role;
    if (role && !["PARENT", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const resolvedParams = await params;
    const studentId = resolvedParams.id;

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        avatar: true,
        age: true,
        dob: true,
        ageGroup: true,
        totalXp: true,
        currentLevel: true,
        streakDays: true,
        badges: true,
        lastActiveDate: true,
        parentEmail: true,
        user: {
          select: {
            createdAt: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Verify ownership (except for admins)
    if (role !== "ADMIN") {
      if (student.parentEmail?.toLowerCase() !== session.user.email.toLowerCase()) {
        return NextResponse.json({ error: "Not authorized for this student" }, { status: 403 });
      }
    }

    return NextResponse.json({
      student: {
        id: student.id,
        name: student.name,
        avatar: student.avatar,
        age: student.age,
        dob: student.dob,
        ageGroup: student.ageGroup,
        totalXp: student.totalXp,
        currentLevel: student.currentLevel,
        streakDays: student.streakDays,
        badges: student.badges || [],
        lastActiveDate: student.lastActiveDate,
        createdAt: student.user?.createdAt,
      },
    });
  } catch (error: any) {
    logger.db.error("GET /api/students/[id]/profile error", error);
    return NextResponse.json(
      { error: error?.message || "Failed to get student profile" },
      { status: 500 }
    );
  }
}

// PUT update student profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session as any)?.user?.role;
    if (role && !["PARENT", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const resolvedParams = await params;
    const studentId = resolvedParams.id;
    const body = await request.json();
    const { name, avatar, age, dob } = body;

    // Verify ownership (except for admins)
    if (role !== "ADMIN") {
      const student = await prisma.studentProfile.findUnique({
        where: { id: studentId },
        select: { parentEmail: true },
      });

      if (!student || student.parentEmail?.toLowerCase() !== session.user.email.toLowerCase()) {
        return NextResponse.json({ error: "Not authorized for this student" }, { status: 403 });
      }
    }

    // Determine age group based on age
    let ageGroup: AgeGroup | null = null;
    if (age) {
      const ageNum = parseInt(age);
      if (ageNum >= 7 && ageNum <= 10) {
        ageGroup = AgeGroup.AGES_7_10;
      } else if (ageNum >= 11 && ageNum <= 14) {
        ageGroup = AgeGroup.AGES_11_14;
      } else if (ageNum >= 15) {
        ageGroup = AgeGroup.AGES_15_18;
      }
    }

    // Update student profile
    const updatedStudent = await prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        name: name || undefined,
        avatar: avatar || undefined,
        age: age ? parseInt(age) : undefined,
        dob: dob ? new Date(dob) : undefined,
        ageGroup: ageGroup ?? undefined,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        age: true,
        dob: true,
        ageGroup: true,
        totalXp: true,
        currentLevel: true,
        streakDays: true,
        badges: true,
        lastActiveDate: true,
      },
    });

    // Also update the user's name if provided
    if (name) {
      const studentWithUser = await prisma.studentProfile.findUnique({
        where: { id: studentId },
        select: { userId: true },
      });

      if (studentWithUser?.userId) {
        await prisma.user.update({
          where: { id: studentWithUser.userId },
          data: { name },
        });
      }
    }

    return NextResponse.json({
      success: true,
      student: {
        id: updatedStudent.id,
        name: updatedStudent.name,
        avatar: updatedStudent.avatar,
        age: updatedStudent.age,
        dob: updatedStudent.dob,
        ageGroup: updatedStudent.ageGroup,
        totalXp: updatedStudent.totalXp,
        currentLevel: updatedStudent.currentLevel,
        streakDays: updatedStudent.streakDays,
        badges: updatedStudent.badges || [],
        lastActiveDate: updatedStudent.lastActiveDate,
      },
    });
  } catch (error: any) {
    logger.db.error("PUT /api/students/[id]/profile error", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update student profile" },
      { status: 500 }
    );
  }
}
