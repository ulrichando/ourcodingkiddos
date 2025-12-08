import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

// Available sender addresses
const SENDER_ADDRESSES = [
  { value: "support@ourcodingkiddos.com", label: "Support", displayName: "Our Coding Kiddos Support" },
  { value: "billing@ourcodingkiddos.com", label: "Billing", displayName: "Our Coding Kiddos Billing" },
  { value: "info@ourcodingkiddos.com", label: "Info", displayName: "Our Coding Kiddos" },
  { value: "hello@ourcodingkiddos.com", label: "Hello", displayName: "Our Coding Kiddos" },
  { value: "safety@ourcodingkiddos.com", label: "Safety", displayName: "Our Coding Kiddos Safety" },
  { value: "partnerships@ourcodingkiddos.com", label: "Partnerships", displayName: "Our Coding Kiddos Partnerships" },
];

// GET - Return available sender addresses
export async function GET() {
  return NextResponse.json({ addresses: SENDER_ADDRESSES });
}

// POST - Send a new email
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { to, subject, htmlBody, textBody, fromAddress } = body;

    if (!to || !subject || !htmlBody || !fromAddress) {
      return NextResponse.json(
        { error: "To, subject, body, and from address are required" },
        { status: 400 }
      );
    }

    // Validate the from address
    const senderConfig = SENDER_ADDRESSES.find((s) => s.value === fromAddress);
    if (!senderConfig) {
      return NextResponse.json(
        { error: "Invalid sender address" },
        { status: 400 }
      );
    }

    // Send the email via Resend
    const result = await sendEmail({
      to,
      subject,
      html: htmlBody,
      text: textBody,
      from: `${senderConfig.displayName} <${senderConfig.value}>`,
      replyTo: senderConfig.value,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }

    // Log the sent email (optional: you could store sent emails too)
    console.log(`[Compose Email] Sent email from ${fromAddress} to ${to}: ${subject}`);

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("[Compose Email] Error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
