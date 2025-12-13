import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { logger } from "@/lib/logger";

// Resend webhook event types
interface ResendEmailReceivedEvent {
  type: "email.received";
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    created_at: string;
  };
}

interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: Record<string, unknown>;
}

// Verify Resend webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Categorize email based on recipient address
function categorizeEmail(toAddress: string): "GENERAL" | "SUPPORT" | "BILLING" | "ENROLLMENT" | "FEEDBACK" | "PARTNERSHIP" {
  const address = toAddress.toLowerCase();

  if (address.includes("support")) return "SUPPORT";
  if (address.includes("billing")) return "BILLING";
  if (address.includes("enroll") || address.includes("signup")) return "ENROLLMENT";
  if (address.includes("feedback")) return "FEEDBACK";
  if (address.includes("partner")) return "PARTNERSHIP";

  return "GENERAL";
}

// Extract name from email "Name <email@example.com>" format
function parseEmailAddress(emailString: string): { email: string; name?: string } {
  const match = emailString.match(/^(?:"?([^"]*)"?\s)?<?([^>]+)>?$/);
  if (match) {
    return {
      name: match[1]?.trim() || undefined,
      email: match[2].trim(),
    };
  }
  return { email: emailString.trim() };
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("resend-signature");
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    // Verify signature if secret is configured
    if (webhookSecret && !verifyWebhookSignature(payload, signature, webhookSecret)) {
      logger.error("Resend Webhook", "Invalid signature", new Error("Signature verification failed"));
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event: ResendWebhookEvent = JSON.parse(payload);
    logger.info("Resend Webhook", `Received event: ${event.type}`);

    // Handle email.received event
    if (event.type === "email.received") {
      const emailEvent = event as ResendEmailReceivedEvent;
      const { email_id, from, to, subject } = emailEvent.data;

      // Parse sender
      const sender = parseEmailAddress(from);

      // Check if we already processed this email
      const existing = await prisma.receivedEmail.findUnique({
        where: { resendEmailId: email_id },
      });

      if (existing) {
        logger.info("Resend Webhook", `Email ${email_id} already processed`);
        return NextResponse.json({ success: true, message: "Already processed" });
      }

      // Fetch full email content from Resend API
      let textBody: string | null = null;
      let htmlBody: string | null = null;
      let attachments: { filename: string; contentType: string; size: number }[] = [];

      try {
        // Fetch email details from Resend Receiving API (for inbound emails)
        const emailDetails = await fetch(
          `https://api.resend.com/emails/receiving/${email_id}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
          }
        );

        if (emailDetails.ok) {
          const details = await emailDetails.json();
          logger.info("Resend Webhook", "Email details fetched", { emailId: email_id });
          textBody = details.text || null;
          htmlBody = details.html || null;
        } else {
          logger.error("Resend Webhook", "Failed to fetch email details", new Error(`Status: ${emailDetails.status}`));
        }

        // Fetch attachments metadata
        const attachmentsResponse = await fetch(
          `https://api.resend.com/emails/receiving/${email_id}/attachments`,
          {
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
          }
        );

        if (attachmentsResponse.ok) {
          const attachmentsData = await attachmentsResponse.json();
          attachments = attachmentsData.data || [];
        }
      } catch (fetchError) {
        logger.error("Resend Webhook", "Error fetching email details", fetchError);
      }

      // Look up if sender is a known user
      const knownUser = await prisma.user.findUnique({
        where: { email: sender.email },
      });

      // Categorize based on recipient
      const category = categorizeEmail(to[0] || "");

      // Create snippet from text body
      const snippet = textBody
        ? textBody.substring(0, 200).replace(/\s+/g, " ").trim()
        : null;

      // Save to database
      const receivedEmail = await prisma.receivedEmail.create({
        data: {
          resendEmailId: email_id,
          from: sender.email,
          fromName: sender.name,
          to: to[0] || "",
          subject: subject || "(No Subject)",
          textBody,
          htmlBody,
          snippet,
          attachments: attachments.length > 0 ? attachments : undefined,
          category,
          userId: knownUser?.id,
          receivedAt: new Date(emailEvent.data.created_at),
        },
      });

      logger.info("Resend Webhook", "Saved email", { emailId: receivedEmail.id, from: sender.email });

      return NextResponse.json({
        success: true,
        emailId: receivedEmail.id,
      });
    }

    // Handle other event types (delivery status, bounces, etc.)
    if (event.type === "email.delivered") {
      logger.info("Resend Webhook", "Email delivered", { data: event.data });
    } else if (event.type === "email.bounced") {
      logger.warn("Resend Webhook", "Email bounced", { data: event.data });
    } else if (event.type === "email.complained") {
      logger.warn("Resend Webhook", "Spam complaint", { data: event.data });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Resend Webhook", "Webhook processing failed", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Respond to Resend webhook verification
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
