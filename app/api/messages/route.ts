import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { logger } from "../../../lib/logger";

// Force dynamic - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase();
    const userRole = (session as any)?.user?.role?.toUpperCase() || "PARENT";

    // Check if requesting specific conversation messages
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      // Fetch messages for specific conversation
      const messages = await prisma.message.findMany({
        where: {
          conversationId
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      const transformedMessages = messages.map(msg => ({
        id: msg.id,
        conversationId: msg.conversationId,
        fromRole: msg.fromRole.toLowerCase(),
        toRole: "parent", // Simplified
        fromName: msg.fromName,
        text: msg.content,
        attachmentName: msg.attachmentName,
        timestamp: new Date(msg.createdAt).getTime(),
        status: "sent"
      }));

      return NextResponse.json({ messages: transformedMessages });
    }

    // Fetch conversations where user is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userEmail
          }
        }
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

    // Fetch all messages for user's conversations
    const conversationIds = conversations.map(c => c.id);
    const messages = await prisma.message.findMany({
      where: {
        conversationId: {
          in: conversationIds
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Get list of contacts based on user role
    // Instructors can message students/parents, everyone can message instructors/admins
    let contactRoles: string[] = ['INSTRUCTOR', 'ADMIN'];
    if (userRole === 'INSTRUCTOR' || userRole === 'ADMIN') {
      contactRoles = ['STUDENT', 'PARENT', 'INSTRUCTOR', 'ADMIN'];
    }

    const contacts = await prisma.user.findMany({
      where: {
        role: {
          in: contactRoles as any
        },
        email: {
          not: userEmail // Don't show self
        }
      },
      select: {
        name: true,
        email: true,
        role: true
      },
      take: 100 // Limit for performance
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
          from: conv.participants.find(p => p.userEmail === userEmail)?.userRole || userRole,
          to: otherParticipants[0]?.userRole || "SUPPORT"
        },
        participants: otherParticipants.map(p => p.userName || p.userEmail),
        isOnline: Math.random() > 0.5 // Placeholder
      };
    });

    const transformedMessages = messages.map(msg => ({
      id: msg.id,
      conversationId: msg.conversationId,
      fromRole: msg.fromRole.toLowerCase(),
      toRole: "parent", // Simplified
      fromName: msg.fromName,
      text: msg.content,
      attachmentName: msg.attachmentName,
      timestamp: new Date(msg.createdAt).getTime(),
      status: "sent"
    }));

    const transformedContacts = contacts.map(c => ({
      name: c.name || c.email,
      email: c.email,
      role: c.role.toLowerCase()
    }));

    return NextResponse.json({
      conversations: transformedConvos,
      messages: transformedMessages,
      contacts: transformedContacts
    });
  } catch (error: any) {
    logger.api.error("GET /api/messages error", error);
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
    const userName = session.user.name || "User";
    const userRole = (session as any)?.user?.role?.toUpperCase() || "PARENT";

    const body = await req.json();
    const {
      action,
      conversationId,
      text,
      toEmail,
      toName,
      toRole,
      participantNames,
      label,
      attachmentName
    } = body;

    // Create new conversation
    if (action === "createConversation") {
      // Determine conversation type
      const isGroup = participantNames && participantNames.length > 1;
      const convType = toRole === "support" ? "support" : isGroup ? "group" : "direct";

      // Find or create conversation
      const conversation = await prisma.conversation.create({
        data: {
          title: label || (isGroup ? `Group: ${participantNames.join(", ")}` : null),
          type: convType,
          lastMessageAt: new Date(),
          participants: {
            create: [
              {
                userEmail,
                userRole: userRole as any,
                userName
              },
              {
                userEmail: toEmail || `${toName?.toLowerCase().replace(/\s+/g, '')}@ourcodingkiddos.com`,
                userRole: (toRole?.toUpperCase() || "SUPPORT") as any,
                userName: toName
              }
            ]
          }
        },
        include: {
          participants: true
        }
      });

      // Create first message if text provided
      if (text) {
        const message = await prisma.message.create({
          data: {
            conversationId: conversation.id,
            fromEmail: userEmail,
            fromRole: userRole as any,
            fromName: userName,
            content: text,
            attachmentName
          }
        });

        return NextResponse.json({
          conversation: {
            id: conversation.id,
            name: conversation.title || toName || "New Conversation",
            type: conversation.type
          },
          message: {
            id: message.id,
            conversationId: message.conversationId,
            text: message.content,
            fromRole: message.fromRole.toLowerCase(),
            timestamp: new Date(message.createdAt).getTime()
          }
        });
      }

      return NextResponse.json({
        conversation: {
          id: conversation.id,
          name: conversation.title || toName || "New Conversation"
        }
      });
    }

    // Send message to existing conversation
    if (!conversationId || !text) {
      return NextResponse.json({ error: "Missing conversationId or text" }, { status: 400 });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        fromEmail: userEmail,
        fromRole: userRole as any,
        fromName: userName,
        content: text,
        attachmentName
      }
    });

    // Update conversation lastMessageAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() }
    });

    return NextResponse.json({
      message: {
        id: message.id,
        conversationId: message.conversationId,
        text: message.content,
        fromRole: message.fromRole.toLowerCase(),
        fromName: message.fromName,
        attachmentName: message.attachmentName,
        timestamp: new Date(message.createdAt).getTime(),
        status: "sent"
      }
    });
  } catch (error: any) {
    logger.api.error("POST /api/messages error", error);
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
