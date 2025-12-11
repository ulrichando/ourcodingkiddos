import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

// Force dynamic - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session as any)?.user?.role?.toUpperCase();

    // Only admins and support can view all conversations
    if (userRole !== "ADMIN" && userRole !== "SUPPORT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch ALL conversations including deleted ones (for admin monitoring)
    const conversations = await prisma.conversation.findMany({
      include: {
        participants: {
          select: {
            userName: true,
            userEmail: true,
            userRole: true
          }
        },
        messages: {
          select: {
            id: true,
            content: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    });

    const transformedConversations = conversations.map(conv => {
      const lastMessage = conv.messages[0];

      return {
        id: conv.id,
        title: conv.title,
        type: conv.type,
        createdAt: conv.createdAt.toISOString(),
        lastMessageAt: conv.lastMessageAt?.toISOString() || null,
        participantNames: conv.participants.map(p => p.userName || p.userEmail),
        participantRoles: conv.participants.map(p => p.userRole),
        messageCount: conv._count.messages,
        lastMessage: lastMessage?.content?.substring(0, 100) || null,
        isDeleted: conv.deletedAt !== null,
        deletedAt: conv.deletedAt?.toISOString() || null,
        deletedBy: conv.deletedBy || null
      };
    });

    return NextResponse.json({
      conversations: transformedConversations
    });
  } catch (error: any) {
    console.error("GET /api/admin/conversations error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
