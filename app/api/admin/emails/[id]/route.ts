import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";

// GET /api/admin/emails/[id] - Get single email with full content
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !["ADMIN", "SUPPORT"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const email = await prisma.receivedEmail.findUnique({
      where: { id },
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    // Mark as read if unread
    if (email.status === "UNREAD") {
      await prisma.receivedEmail.update({
        where: { id },
        data: { status: "READ" },
      });
    }

    return NextResponse.json(email);
  } catch (error) {
    logger.db.error("Failed to fetch email", error);
    return NextResponse.json(
      { error: "Failed to fetch email" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/emails/[id] - Update email status/category/assignment
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !["ADMIN", "SUPPORT"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, category, priority, assignedToEmail, assignedToName } = body;

    const updateData: Record<string, unknown> = {};

    if (status) updateData.status = status;
    if (category) updateData.category = category;
    if (priority) updateData.priority = priority;
    if (assignedToEmail !== undefined) {
      updateData.assignedToEmail = assignedToEmail;
      updateData.assignedToName = assignedToName;
    }

    if (status === "ARCHIVED") {
      updateData.archivedAt = new Date();
    }

    const email = await prisma.receivedEmail.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(email);
  } catch (error) {
    logger.db.error("Failed to update email", error);
    return NextResponse.json(
      { error: "Failed to update email" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/emails/[id] - Delete email
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.receivedEmail.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.db.error("Failed to delete email", error);
    return NextResponse.json(
      { error: "Failed to delete email" },
      { status: 500 }
    );
  }
}
