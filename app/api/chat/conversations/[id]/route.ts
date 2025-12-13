import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logger } from "../../../../../lib/logger";

export const dynamic = "force-dynamic";

// GET - Fetch messages for a specific conversation
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    if (!session?.user?.email || (role !== "ADMIN" && role !== "SUPPORT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Format messages for frontend
    const formattedMessages = conversation.messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      fromEmail: msg.fromEmail,
      fromName: msg.fromName,
      fromRole: msg.fromRole,
      createdAt: msg.createdAt,
      isAdmin: msg.fromRole === "ADMIN" || msg.fromRole === "SUPPORT",
    }));

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        userEmail: conversation.participants[0]?.userEmail || "Unknown",
        userName: conversation.participants[0]?.userName || conversation.participants[0]?.userEmail?.split("@")[0] || "Guest",
        createdAt: conversation.createdAt,
      },
      messages: formattedMessages,
    });
  } catch (error) {
    logger.db.error("Error fetching conversation", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific conversation and all its messages
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if conversation exists
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Delete in order: messages first, then participants, then conversation
    await prisma.message.deleteMany({
      where: { conversationId: id },
    });

    await prisma.conversationParticipant.deleteMany({
      where: { conversationId: id },
    });

    await prisma.conversation.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    logger.db.error("Error deleting conversation", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}
