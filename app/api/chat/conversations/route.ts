import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { createAuditLog, getClientIP, getUserAgent } from "@/lib/audit";
import { logger } from "../../../../lib/logger";

export const dynamic = "force-dynamic";

// GET - Fetch all support conversations for admin/support
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    if (!session?.user?.email || (role !== "ADMIN" && role !== "SUPPORT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        type: "SUPPORT",
      },
      include: {
        participants: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Get last message for preview
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    // Transform for easier frontend consumption
    const formattedConversations = conversations.map((conv) => ({
      id: conv.id,
      userEmail: conv.participants[0]?.userEmail || "Unknown",
      userName: conv.participants[0]?.userName || conv.participants[0]?.userEmail?.split("@")[0] || "Guest",
      lastMessage: conv.messages[0]?.content || "",
      lastMessageAt: conv.lastMessageAt,
      messageCount: conv._count.messages,
      createdAt: conv.createdAt,
    }));

    return NextResponse.json({ conversations: formattedConversations });
  } catch (error) {
    logger.db.error("Error fetching conversations", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// POST - Send admin/support reply to a conversation
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    if (!session?.user?.email || (role !== "ADMIN" && role !== "SUPPORT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, message, userEmail } = body;

    if (!conversationId || !message?.trim()) {
      return NextResponse.json(
        { error: "Conversation ID and message are required" },
        { status: 400 }
      );
    }

    // Verify conversation exists
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Add support message to conversation
    const newMessage = await prisma.message.create({
      data: {
        conversationId,
        fromEmail: session.user.email,
        fromRole: role || "SUPPORT",
        fromName: session.user.name || "Support Team",
        content: message.trim(),
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    // Send email notification to user
    const recipientEmail = userEmail || conversation.participants[0]?.userEmail;
    if (recipientEmail) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">New Reply from Support</h1>
              </div>
              <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                  <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">From:</p>
                  <p style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; font-weight: 600;">Coding Kiddos Support Team</p>
                  <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Message:</p>
                  <p style="margin: 0; color: #1e293b; font-size: 16px; white-space: pre-wrap;">${message.trim()}</p>
                </div>
                <div style="text-align: center;">
                  <a href="https://ourcodingkiddos.com"
                     style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
                    Visit Our Website
                  </a>
                </div>
                <p style="margin: 20px 0 0 0; color: #94a3b8; font-size: 12px; text-align: center;">
                  Simply reply to this email to continue the conversation.
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      await sendEmail({
        to: recipientEmail,
        subject: "Reply from Coding Kiddos Support",
        html: emailHtml,
        text: `New reply from Coding Kiddos Support:\n\n${message.trim()}\n\nVisit our website: https://ourcodingkiddos.com`,
      });
    }

    // Audit log for support message
    await createAuditLog({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "CREATE",
      resource: "SupportMessage",
      resourceId: newMessage.id,
      details: `${role} agent sent message to conversation with ${recipientEmail || "unknown user"}`,
      ipAddress: getClientIP(request.headers),
      userAgent: getUserAgent(request.headers),
      severity: "INFO",
      metadata: {
        conversationId,
        recipientEmail,
        messagePreview: message.trim().substring(0, 100),
      },
    });

    return NextResponse.json({
      success: true,
      messageId: newMessage.id,
    });
  } catch (error) {
    logger.db.error("Error sending admin reply", error);
    return NextResponse.json(
      { error: "Failed to send reply" },
      { status: 500 }
    );
  }
}
