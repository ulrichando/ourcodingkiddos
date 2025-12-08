import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

// POST /api/admin/emails/[id]/reply - Send a reply to the email
export async function POST(
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
    const { subject, htmlBody, textBody } = body;

    if (!htmlBody || !subject) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    // Get the original email
    const originalEmail = await prisma.receivedEmail.findUnique({
      where: { id },
    });

    if (!originalEmail) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    // Send the reply email via Resend
    const result = await sendEmail({
      to: originalEmail.from,
      subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
      html: htmlBody,
      text: textBody,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }

    // Save the reply to database
    const reply = await prisma.emailReply.create({
      data: {
        receivedEmailId: id,
        fromEmail: session.user.email,
        fromName: user.name || session.user.name,
        toEmail: originalEmail.from,
        subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
        htmlBody,
        textBody,
        resendMessageId: result.messageId,
        status: "sent",
      },
    });

    // Update the original email status
    await prisma.receivedEmail.update({
      where: { id },
      data: {
        status: "REPLIED",
        processedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("[Admin Email Reply] Error:", error);
    return NextResponse.json(
      { error: "Failed to send reply" },
      { status: 500 }
    );
  }
}
