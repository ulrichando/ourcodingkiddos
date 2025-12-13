import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { logger } from "@/lib/logger";

// Only allow admins to test email
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const testEmail = body.email || session.user.email;

    if (!testEmail) {
      return NextResponse.json(
        { error: "Email address required" },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "RESEND_API_KEY not configured",
        message: "Please add RESEND_API_KEY to your environment variables",
      }, { status: 500 });
    }

    // Send test email
    const result = await sendEmail({
      to: testEmail,
      subject: "Test Email - Coding Kiddos",
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

            <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 24px;">Email Setup Successful!</h1>
            </div>

            <p>Hi ${session.user.name || "Admin"},</p>

            <p>This is a test email to confirm that your Resend email integration is working correctly.</p>

            <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #475569;">Configuration Details:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #64748b;">
                <li>Provider: Resend</li>
                <li>Sent at: ${new Date().toLocaleString()}</li>
                <li>Environment: ${process.env.NODE_ENV}</li>
              </ul>
            </div>

            <p style="color: #64748b; font-size: 14px;">If you received this email, your email service is properly configured!</p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
              &copy; ${new Date().getFullYear()} Coding Kiddos. All rights reserved.
            </p>
          </body>
        </html>
      `,
      text: `Email Setup Successful!

Hi ${session.user.name || "Admin"},

This is a test email to confirm that your Resend email integration is working correctly.

Configuration Details:
- Provider: Resend
- Sent at: ${new Date().toLocaleString()}
- Environment: ${process.env.NODE_ENV}

If you received this email, your email service is properly configured!`,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${testEmail}`,
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: "Failed to send test email. Check your Resend configuration.",
      }, { status: 500 });
    }
  } catch (error) {
    logger.email.error("Test email failed", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to send test email"
      },
      { status: 500 }
    );
  }
}
