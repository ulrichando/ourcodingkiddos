import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const lessonId = String(body?.lessonId || "").trim();
  const courseId = String(body?.courseId || "").trim();
  const studentId = String(body?.studentId || "").trim();
  const xpFromClient = Number(body?.xp) || 0;

  if (!lessonId || !studentId) {
    return NextResponse.json({ status: "error", message: "lessonId and studentId required" }, { status: 400 });
  }

  try {
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
      select: { totalXp: true, currentLevel: true },
    });

    // Recalculate level (every 500 XP = new level)
    const newLevel = Math.max(1, Math.floor((updated.totalXp || 0) / 500) + 1);
    if (newLevel !== updated.currentLevel) {
      await prisma.studentProfile.update({
        where: { id: studentId },
        data: { currentLevel: newLevel },
      });
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
