import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { createAuditLog, getClientIP, getUserAgent } from "@/lib/audit";

export const dynamic = "force-dynamic";

// POST - Admin/Support initiates a conversation with a visitor
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    if (!session?.user?.email || (role !== "ADMIN" && role !== "SUPPORT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { visitorEmail, visitorName, message } = body;

    if (!visitorEmail) {
      return NextResponse.json(
        { error: "Visitor email is required" },
        { status: 400 }
      );
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check for existing support conversation with this visitor
    let conversation = await prisma.conversation.findFirst({
      where: {
        type: "SUPPORT",
        participants: {
          some: {
            userEmail: visitorEmail,
          },
        },
      },
      include: {
        participants: true,
      },
    });

    // Create new conversation if none exists
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          type: "SUPPORT",
          participants: {
            create: [
              {
                userEmail: visitorEmail,
                userRole: "PARENT",
                userName: visitorName || visitorEmail.split("@")[0],
              },
            ],
          },
        },
        include: {
          participants: true,
        },
      });
    }

    // Add support message to conversation
    const newMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        fromEmail: session.user.email,
        fromRole: role || "SUPPORT",
        fromName: session.user.name || "Support Team",
        content: message.trim(),
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    // Send email notification to visitor
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
              <h1 style="color: white; margin: 0; font-size: 24px;">Message from Our Coding Kiddos</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">From:</p>
                <p style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; font-weight: 600;">${session.user.name || "Support Team"}</p>
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Message:</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; white-space: pre-wrap;">${message.trim()}</p>
              </div>
              <div style="text-align: center;">
                <a href="https://ourcodingkiddos.com"
                   style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  Visit Our Website to Reply
                </a>
              </div>
              <p style="margin: 20px 0 0 0; color: #94a3b8; font-size: 12px; text-align: center;">
                Simply reply to this email or use our website chat to continue the conversation.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      to: visitorEmail,
      subject: `Message from Our Coding Kiddos Support`,
      html: emailHtml,
      text: `Message from Our Coding Kiddos Support:\n\n${message.trim()}\n\nVisit our website to reply: https://ourcodingkiddos.com`,
    });

    // Audit log for initiated conversation
    await createAuditLog({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "CREATE",
      resource: "SupportConversation",
      resourceId: conversation.id,
      details: `${role} agent initiated chat with visitor ${visitorEmail}`,
      ipAddress: getClientIP(request.headers),
      userAgent: getUserAgent(request.headers),
      severity: "INFO",
      metadata: {
        visitorEmail,
        visitorName,
        conversationId: conversation.id,
        messagePreview: message.trim().substring(0, 100),
      },
    });

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      messageId: newMessage.id,
    });
  } catch (error) {
    console.error("Error initiating conversation:", error);
    return NextResponse.json(
      { error: "Failed to initiate conversation" },
      { status: 500 }
    );
  }
}
