import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logger } from "../../../../lib/logger";

export const dynamic = "force-dynamic";

// GET - Fetch messages for a visitor's support conversation
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const lastMessageId = searchParams.get("lastMessageId");

    // Get session or use provided email
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || email;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user's support conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        type: "SUPPORT",
        participants: {
          some: {
            userEmail: userEmail,
          },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          ...(lastMessageId && {
            where: {
              createdAt: {
                gt: (await prisma.message.findUnique({
                  where: { id: lastMessageId },
                  select: { createdAt: true },
                }))?.createdAt || new Date(0),
              },
            },
          }),
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ messages: [], conversationId: null });
    }

    // Format messages for frontend
    const formattedMessages = conversation.messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      fromEmail: msg.fromEmail,
      fromName: msg.fromName,
      fromRole: msg.fromRole,
      createdAt: msg.createdAt,
      isAdmin: msg.fromRole === "ADMIN",
    }));

    return NextResponse.json({
      messages: formattedMessages,
      conversationId: conversation.id,
    });
  } catch (error) {
    logger.db.error("Error fetching messages", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
