import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createNotification } from "../../notifications/route";

export async function POST(request: Request) {
  // Authentication check
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  const userRole = (session.user as any).role;
  const userEmail = session.user.email;
  const userId = (session.user as any).id;

  const body = await request.json().catch(() => null);
  const lessonId = String(body?.lessonId || "").trim();
  const courseId = String(body?.courseId || "").trim();
  const studentId = String(body?.studentId || "").trim();
  const xpFromClient = Number(body?.xp) || 0;

  if (!lessonId || !studentId) {
    return NextResponse.json({ status: "error", message: "lessonId and studentId required" }, { status: 400 });
  }

  try {
    // Verify authorization - user must be:
    // 1. Admin or Instructor (can update any student)
    // 2. The student themselves
    // 3. The parent of the student
    if (userRole !== "ADMIN" && userRole !== "INSTRUCTOR") {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { id: studentId },
        select: { userId: true, parentEmail: true, guardianId: true },
      });

      if (!studentProfile) {
        return NextResponse.json({ status: "error", message: "Student not found" }, { status: 404 });
      }

      // Check if user is the student
      const isStudent = studentProfile.userId === userId;

      // Check if user is the parent
      let isParent = false;
      if (userRole === "PARENT") {
        const parentProfile = await prisma.parentProfile.findFirst({
          where: { user: { email: userEmail ?? undefined } },
          select: { id: true },
        });

        isParent = !!(studentProfile.parentEmail === userEmail ||
                   (parentProfile && studentProfile.guardianId === parentProfile.id));
      }

      if (!isStudent && !isParent) {
        return NextResponse.json({ status: "error", message: "Forbidden - you cannot update this student's progress" }, { status: 403 });
      }
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { xpReward: true, courseId: true },
    });

    const xpReward = lesson?.xpReward ?? (xpFromClient > 0 ? xpFromClient : 50);

    // Update student XP and level
    const updated = await prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        totalXp: { increment: xpReward },
        lastActiveDate: new Date(),
      },
      select: { totalXp: true, currentLevel: true, name: true, parentEmail: true },
    });

    // Recalculate level (every 500 XP = new level)
    const newLevel = Math.max(1, Math.floor((updated.totalXp || 0) / 500) + 1);
    const leveledUp = newLevel !== updated.currentLevel;

    if (leveledUp) {
      await prisma.studentProfile.update({
        where: { id: studentId },
        data: { currentLevel: newLevel },
      });

      // Send level up notification to parent
      if (updated.parentEmail) {
        createNotification(
          updated.parentEmail,
          `${updated.name} Leveled Up! 🎊`,
          `${updated.name} reached Level ${newLevel}! Keep up the great work!`,
          "achievement",
          "/dashboard/parent/reports",
          { studentId, studentName: updated.name, newLevel, xpEarned: xpReward }
        );
      }
    } else {
      // Send XP earned notification to parent
      if (updated.parentEmail && xpReward >= 100) {
        createNotification(
          updated.parentEmail,
          `${updated.name} Earned ${xpReward} XP! ⭐`,
          `${updated.name} completed a lesson and earned ${xpReward} XP!`,
          "progress",
          "/dashboard/parent/reports",
          { studentId, studentName: updated.name, xpEarned: xpReward }
        );
      }
    }

    return NextResponse.json({
      status: "ok",
      data: { totalXp: updated.totalXp, currentLevel: newLevel, courseId: courseId || lesson?.courseId },
    });
  } catch (error) {
    console.error("[lessons/complete] failed", error);
    return NextResponse.json({ status: "error", message: "Could not update progress" }, { status: 500 });
  }
}
