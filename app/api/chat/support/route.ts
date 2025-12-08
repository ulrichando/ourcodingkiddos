import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { emails } from "@/lib/emails";

export const dynamic = "force-dynamic";

// Generate unique ticket number
function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TKT-${timestamp}${random}`;
}

// Create or find existing support conversation
async function getOrCreateSupportConversation(userEmail: string, userName: string) {
  // Look for existing support conversation for this user
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      type: "SUPPORT",
      participants: {
        some: {
          userEmail: userEmail,
        },
      },
    },
    include: {
      participants: true,
    },
  });

  if (existingConversation) {
    // Update the participant's name if it was previously unknown
    if (userName && existingConversation.participants[0]?.userName !== userName) {
      await prisma.conversationParticipant.updateMany({
        where: {
          conversationId: existingConversation.id,
          userEmail: userEmail,
        },
        data: {
          userName: userName,
        },
      });
    }
    return existingConversation;
  }

  // Create new support conversation
  const conversation = await prisma.conversation.create({
    data: {
      type: "SUPPORT",
      participants: {
        create: [
          {
            userEmail: userEmail,
            userRole: "PARENT",
            userName: userName,
          },
        ],
      },
    },
    include: {
      participants: true,
    },
  });

  return conversation;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Allow both authenticated and guest messages
    const body = await request.json();
    const { message, name, email: guestEmail } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const userEmail = session?.user?.email || guestEmail;
    const userName = session?.user?.name || name || "Website Visitor";

    if (!userEmail) {
      return NextResponse.json(
        { error: "Email is required for guest messages" },
        { status: 400 }
      );
    }

    // Get or create support conversation
    const conversation = await getOrCreateSupportConversation(userEmail, userName);

    // Add message to conversation
    const newMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        fromEmail: userEmail,
        fromRole: session?.user?.role || "PARENT",
        fromName: userName,
        content: message.trim(),
      },
    });

    // Update conversation's last message timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    // Create support ticket if this is a new conversation or update existing
    const existingTicket = await prisma.supportTicket.findFirst({
      where: {
        userEmail: userEmail,
        status: { in: ["OPEN", "IN_PROGRESS"] },
      },
    });

    if (!existingTicket) {
      await prisma.supportTicket.create({
        data: {
          ticketNumber: generateTicketNumber(),
          userEmail: userEmail,
          userRole: session?.user?.role || "PARENT",
          userName: userName,
          subject: "Chat Support Request",
          description: message.trim(),
          category: "GENERAL",
          status: "OPEN",
          priority: "MEDIUM",
        },
      });
    } else {
      // Update existing ticket with new message
      await prisma.supportTicket.update({
        where: { id: existingTicket.id },
        data: {
          description: `${existingTicket.description}\n\n---\nNew message (${new Date().toLocaleString()}):\n${message.trim()}`,
          updatedAt: new Date(),
        },
      });
    }

    // Send email notification to support team
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">💬 New Chat Support Message</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">From:</p>
                <p style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; font-weight: 600;">${userName} (${userEmail})</p>
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Message:</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; white-space: pre-wrap;">${message.trim()}</p>
              </div>
              <div style="text-align: center;">
                <a href="https://ourcodingkiddos.com/dashboard/admin/support-tickets"
                   style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  View in Dashboard
                </a>
              </div>
              <p style="margin: 20px 0 0 0; color: #94a3b8; font-size: 12px; text-align: center;">
                This message was sent from the website chat widget.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      to: emails.support,
      subject: `💬 Chat Support: New message from ${userName}`,
      html: emailHtml,
      text: `New chat support message from ${userName} (${userEmail}):\n\n${message.trim()}\n\nView in dashboard: https://ourcodingkiddos.com/dashboard/admin/support-tickets`,
    });

    return NextResponse.json({
      success: true,
      messageId: newMessage.id,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error("Support chat error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
