import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { logger } from "../../../../lib/logger";

// Force dynamic - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase();

    // Fetch conversations where user is a participant
    // Exclude soft-deleted conversations (deletedAt is not null)
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userEmail
          }
        },
        deletedAt: null  // Only show non-deleted conversations
      },
      include: {
        participants: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1 // Get last message for preview
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    });

    // Transform to frontend format
    const transformedConvos = conversations.map(conv => {
      const otherParticipants = conv.participants.filter(p => p.userEmail !== userEmail);
      const lastMsg = conv.messages[0];

      return {
        id: conv.id,
        name: conv.title || otherParticipants.map(p => p.userName || p.userEmail).join(", ") || "Conversation",
        type: conv.type,
        preview: lastMsg?.content?.substring(0, 50) || "",
        time: lastMsg ? getRelativeTime(lastMsg.createdAt) : "",
        roles: {
          from: conv.participants.find(p => p.userEmail === userEmail)?.userRole || "INSTRUCTOR",
          to: otherParticipants[0]?.userRole || "PARENT"
        },
        role: otherParticipants[0]?.userRole?.toLowerCase() || "parent",
        participants: otherParticipants.map(p => p.userName || p.userEmail),
        isOnline: false, // Could be enhanced with real-time presence
        unreadCount: 0 // Could be enhanced with read receipts
      };
    });

    return NextResponse.json({
      conversations: transformedConvos
    });
  } catch (error: any) {
    logger.api.error("GET /api/messages/conversations error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase();
    const userName = session.user.name || userEmail;
    const userRole = (session as any)?.user?.role?.toUpperCase() || "PARENT";

    const body = await req.json();
    const { recipientEmail, recipientName } = body;

    if (!recipientEmail) {
      return NextResponse.json({ error: "recipientEmail is required" }, { status: 400 });
    }

    const recipientEmailLower = recipientEmail.toLowerCase();

    // Check if conversation already exists between these two users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                userEmail: {
                  equals: userEmail,
                  mode: 'insensitive'
                }
              }
            }
          },
          {
            participants: {
              some: {
                userEmail: {
                  equals: recipientEmailLower,
                  mode: 'insensitive'
                }
              }
            }
          }
        ],
        deletedAt: null // Only find non-deleted conversations
      },
      select: {
        id: true
      }
    });

    if (existingConversation) {
      // Return existing conversation
      return NextResponse.json({
        conversationId: existingConversation.id,
        message: "Conversation already exists"
      });
    }

    // Get recipient info from database
    const recipient = await prisma.user.findUnique({
      where: { email: recipientEmailLower },
      select: {
        email: true,
        name: true,
        role: true
      }
    });

    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    // Create new conversation with both participants
    const conversation = await prisma.conversation.create({
      data: {
        type: "direct",
        participants: {
          create: [
            {
              userEmail: userEmail,
              userName: userName,
              userRole: userRole
            },
            {
              userEmail: recipient.email,
              userName: recipient.name || recipientName || recipient.email,
              userRole: recipient.role
            }
          ]
        },
        lastMessageAt: new Date()
      }
    });

    return NextResponse.json({
      conversationId: conversation.id,
      message: "Conversation created successfully"
    });
  } catch (error: any) {
    logger.api.error("POST /api/messages/conversations error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase();
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('id');

    logger.info("Messages", "DELETE conversation request", { userEmail, conversationId });

    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID required" }, { status: 400 });
    }

    // First, check if the conversation exists at all
    const convExists = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          select: {
            userEmail: true,
            userName: true,
            userRole: true
          }
        }
      }
    });

    logger.info("Messages", "Conversation exists check", { exists: !!convExists, participants: convExists?.participants });

    // Verify user is a participant in this conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: {
            userEmail: {
              equals: userEmail,
              mode: 'insensitive'
            }
          }
        }
      }
    });

    logger.info("Messages", "User is participant check", { isParticipant: !!conversation });

    if (!conversation) {
      logger.warn("Messages", "Authorization failed - conversation not found or unauthorized", { userEmail, conversationId });
      return NextResponse.json({ error: "Conversation not found or unauthorized" }, { status: 404 });
    }

    logger.info("Messages", "Proceeding with soft deletion");

    // Soft delete: Mark the conversation as deleted instead of actually deleting it
    // This allows admins to view deleted conversations for monitoring
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        deletedAt: new Date(),
        deletedBy: userEmail
      }
    });

    logger.info("Messages", "Conversation soft-deleted successfully", { conversationId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.api.error("DELETE /api/messages/conversations error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function
function getRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}
