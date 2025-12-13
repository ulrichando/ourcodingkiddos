import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { createNotification } from "../../notifications/route";
import prisma from "../../../../lib/prisma";
import { logger } from "../../../../lib/logger";

type Announcement = {
  id: string;
  title: string;
  message: string;
  targetRole: "ALL" | "PARENT" | "STUDENT" | "INSTRUCTOR";
  isPinned: boolean;
  createdAt: string;
  createdBy: string;
};

// In-memory storage
let announcements: Announcement[] = [];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ announcements });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, message, targetRole, isPinned } = body;

    if (!title || !message || !targetRole) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const announcement: Announcement = {
      id: `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      targetRole,
      isPinned: isPinned || false,
      createdAt: new Date().toISOString(),
      createdBy: session.user.email || "Admin",
    };

    announcements.unshift(announcement);

    // Send notifications to targeted users
    const users = await prisma.user.findMany({
      where: targetRole === "ALL" ? {} : { role: targetRole },
      select: { email: true }
    });

    // Create notifications for all targeted users
    for (const user of users) {
      createNotification(
        user.email,
        title,
        message,
        "system",
        undefined,
        { announcementId: announcement.id }
      );
    }

    return NextResponse.json({ announcement });
  } catch (error) {
    logger.error("admin/announcements", "Failed to create announcement", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing announcement ID" }, { status: 400 });
  }

  announcements = announcements.filter(a => a.id !== id);
  return NextResponse.json({ status: "ok" });
}
