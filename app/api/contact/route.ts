import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { SUPPORT_EMAIL } from "@/lib/emails";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Get subject label
    const subjectLabels: Record<string, string> = {
      general: "General Inquiry",
      enrollment: "Course Enrollment",
      billing: "Billing & Payments",
      technical: "Technical Support",
      partnership: "Partnership",
    };
    const subjectLabel = subjectLabels[subject] || "General Inquiry";

    // Send email to support team
    const supportResult = await sendEmail({
      to: SUPPORT_EMAIL,
      subject: `[Contact Form] ${subjectLabel} from ${name}`,
      replyTo: email,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); border-radius: 12px 12px 0 0; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 20px;">New Contact Form Submission</h1>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 500;">From:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #8B5CF6;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Subject:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${subjectLabel}</td>
                </tr>
              </table>

              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-weight: 500; margin-bottom: 8px;">Message:</p>
                <div style="background: white; border-radius: 8px; padding: 16px; color: #1e293b; white-space: pre-wrap;">${message}</div>
              </div>

              <div style="margin-top: 20px; text-align: center;">
                <a href="mailto:${email}?subject=Re: ${subjectLabel}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Reply to ${name}</a>
              </div>
            </div>

            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
              This message was sent from the Our Coding Kiddos contact form.
            </p>
          </body>
        </html>
      `,
      text: `New Contact Form Submission

From: ${name}
Email: ${email}
Subject: ${subjectLabel}

Message:
${message}

---
Reply directly to this email to respond to ${name}.`,
    });

    if (!supportResult.success) {
      console.error("[contact] Failed to send to support:", supportResult.error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    // Send confirmation email to user
    const confirmResult = await sendEmail({
      to: email,
      subject: "We received your message - Our Coding Kiddos",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #8B5CF6, #EC4899); border-radius: 16px; line-height: 60px; color: white; font-weight: bold; font-size: 24px;">CK</div>
            </div>

            <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">Thanks for reaching out!</h1>

            <p>Hi ${name},</p>

            <p>We've received your message and will get back to you within 24 hours.</p>

            <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;"><strong>Subject:</strong> ${subjectLabel}</p>
              <p style="color: #64748b; font-size: 14px; margin: 0;"><strong>Your message:</strong></p>
              <p style="color: #475569; font-size: 14px; margin: 8px 0 0 0; white-space: pre-wrap;">${message}</p>
            </div>

            <p>In the meantime, you can:</p>
            <ul style="color: #475569;">
              <li>Check our <a href="${process.env.NEXTAUTH_URL || "https://ourcodingkiddos.com"}/faq" style="color: #8B5CF6;">FAQ page</a> for quick answers</li>
              <li>Browse our <a href="${process.env.NEXTAUTH_URL || "https://ourcodingkiddos.com"}/courses" style="color: #8B5CF6;">courses catalog</a></li>
              <li>Chat with Cody, our AI assistant, on the website</li>
            </ul>

            <p>Thank you for your interest in Our Coding Kiddos!</p>

            <p>Best regards,<br><strong>The Our Coding Kiddos Team</strong></p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
              &copy; ${new Date().getFullYear()} Our Coding Kiddos. All rights reserved.
            </p>
          </body>
        </html>
      `,
      text: `Thanks for reaching out!

Hi ${name},

We've received your message and will get back to you within 24 hours.

Subject: ${subjectLabel}
Your message:
${message}

In the meantime, you can:
- Check our FAQ page for quick answers: ${process.env.NEXTAUTH_URL || "https://ourcodingkiddos.com"}/faq
- Browse our courses catalog: ${process.env.NEXTAUTH_URL || "https://ourcodingkiddos.com"}/courses
- Chat with Cody, our AI assistant, on the website

Thank you for your interest in Our Coding Kiddos!

Best regards,
The Our Coding Kiddos Team`,
    });

    if (!confirmResult.success) {
      // Log but don't fail - support email was sent successfully
      console.warn("[contact] Failed to send confirmation email:", confirmResult.error);
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("[contact] Error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
