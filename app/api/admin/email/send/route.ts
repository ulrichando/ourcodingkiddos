import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import { emails } from "@/lib/emails";

// Map of valid from addresses
const FROM_ADDRESSES: Record<string, string> = {
  hello: `Our Coding Kiddos <${emails.senderAddress}>`,
  support: `Our Coding Kiddos Support <${emails.support}>`,
  billing: `Our Coding Kiddos Billing <${emails.billing}>`,
  safety: `Our Coding Kiddos Safety <${emails.safety}>`,
  info: `Our Coding Kiddos <${emails.info}>`,
  partnerships: `Our Coding Kiddos Partnerships <${emails.partnerships}>`,
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { recipientIds = [], manualEmails = [], subject, body: emailBody, fromAddress = "hello" } = body;

    const hasRecipients = (recipientIds && recipientIds.length > 0) || (manualEmails && manualEmails.length > 0);
    if (!hasRecipients) {
      return NextResponse.json({ error: "No recipients selected" }, { status: 400 });
    }

    if (!subject || !emailBody) {
      return NextResponse.json({ error: "Subject and body are required" }, { status: 400 });
    }

    // Validate from address
    const fromEmail = FROM_ADDRESSES[fromAddress];
    if (!fromEmail) {
      return NextResponse.json({ error: "Invalid from address" }, { status: 400 });
    }

    // Build recipient list
    type EmailRecipient = { email: string; name: string | null };
    const allRecipients: EmailRecipient[] = [];

    // Fetch user recipients if any
    if (recipientIds && recipientIds.length > 0) {
      const users = await prisma.user.findMany({
        where: { id: { in: recipientIds } },
        select: { id: true, name: true, email: true },
      });
      allRecipients.push(...users.map(u => ({ email: u.email, name: u.name })));
    }

    // Add manual email recipients
    if (manualEmails && manualEmails.length > 0) {
      const validEmails = manualEmails.filter((e: string) =>
        typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
      );
      allRecipients.push(...validEmails.map((email: string) => ({ email, name: null })));
    }

    if (allRecipients.length === 0) {
      return NextResponse.json({ error: "No valid recipients found" }, { status: 400 });
    }

    // Helper function to create HTML email
    const currentYear = new Date().getFullYear();
    const createHtmlEmail = (bodyContent: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Our Coding Kiddos</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse: collapse;}
    .container {width: 600px !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9;">
  <!-- Full-width wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0; padding: 0; width: 100%; background-color: #f1f5f9;">
    <tr>
      <td align="center" style="padding: 30px 10px;">

        <!-- Main container - 600px max -->
        <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

          <!-- Header with gradient -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #EC4899 100%); padding: 40px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="width: 60px; height: 60px; background-color: rgba(255,255,255,0.25); border-radius: 16px; text-align: center; vertical-align: middle;">
                          <span style="color: #ffffff; font-size: 26px; font-weight: 800; line-height: 60px;">CK</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2;">Our Coding Kiddos</h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 8px;">
                    <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px; font-weight: 400;">Empowering Young Minds Through Code</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email body content -->
          <tr>
            <td style="padding: 40px 35px; background-color: #ffffff;">
              <div style="color: #1e293b; font-size: 16px; line-height: 1.75; white-space: pre-wrap;">${bodyContent}</div>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 10px 35px 40px 35px; background-color: #ffffff;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);">
                    <a href="https://ourcodingkiddos.com/dashboard" target="_blank" style="display: inline-block; padding: 16px 36px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">Visit Your Dashboard &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 35px;">
              <div style="border-top: 1px solid #e2e8f0;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 35px; background-color: #ffffff;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <!-- Social Links -->
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <a href="https://www.facebook.com/profile.php?id=61578690800757" target="_blank" style="display: inline-block; width: 36px; height: 36px; background-color: #3b5998; border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none;">
                      <span style="color: #ffffff; font-size: 18px; font-weight: bold;">f</span>
                    </a>
                  </td>
                </tr>

                <!-- Contact -->
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                      Questions? Email us at<br>
                      <a href="mailto:support@ourcodingkiddos.com" style="color: #8B5CF6; text-decoration: none; font-weight: 500;">support@ourcodingkiddos.com</a>
                    </p>
                  </td>
                </tr>

                <!-- Links -->
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <p style="margin: 0; font-size: 13px;">
                      <a href="https://ourcodingkiddos.com/privacy" style="color: #64748b; text-decoration: none;">Privacy Policy</a>
                      <span style="color: #cbd5e1; margin: 0 10px;">|</span>
                      <a href="https://ourcodingkiddos.com/terms" style="color: #64748b; text-decoration: none;">Terms of Service</a>
                      <span style="color: #cbd5e1; margin: 0 10px;">|</span>
                      <a href="https://ourcodingkiddos.com" style="color: #64748b; text-decoration: none;">Website</a>
                    </p>
                  </td>
                </tr>

                <!-- Copyright -->
                <tr>
                  <td align="center">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                      &copy; ${currentYear} Our Coding Kiddos. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

    // Send emails
    const results = await Promise.allSettled(
      allRecipients.map(async (recipient) => {
        // Replace template variables
        const recipientName = recipient.name || "there";
        const personalizedBody = emailBody
          .replace(/\{\{name\}\}/g, recipientName)
          .replace(/\{\{email\}\}/g, recipient.email);

        const personalizedSubject = subject
          .replace(/\{\{name\}\}/g, recipientName);

        return sendEmail({
          to: recipient.email,
          subject: personalizedSubject,
          html: createHtmlEmail(personalizedBody),
          text: personalizedBody,
          from: fromEmail,
        });
      })
    );

    // Count successes and failures
    const succeeded = results.filter((r) => r.status === "fulfilled" && (r.value as any).success).length;
    const failed = results.length - succeeded;

    // Log the email send
    console.log(`[Admin Email] Sent ${succeeded}/${allRecipients.length} emails from ${fromAddress}@`);

    return NextResponse.json({
      success: true,
      sent: succeeded,
      failed,
      total: allRecipients.length,
    });
  } catch (error: any) {
    console.error("[Admin Email] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send emails" },
      { status: 500 }
    );
  }
}
