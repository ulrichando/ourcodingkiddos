import { Resend } from "resend";
import { SENDER_EMAIL, REPLY_TO_EMAIL } from "./emails";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Default from email - uses centralized config
const DEFAULT_FROM = SENDER_EMAIL;
const DEFAULT_REPLY_TO = REPLY_TO_EMAIL;

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, subject, html, text, from = DEFAULT_FROM, replyTo = DEFAULT_REPLY_TO } = options;

  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not configured. Email not sent.");
    return {
      success: false,
      error: "Email service not configured",
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      replyTo,
    });

    if (error) {
      console.error("[Email] Resend error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log("[Email] Sent successfully:", data?.id);
    return {
      success: true,
      messageId: data?.id,
    };
  } catch (err) {
    console.error("[Email] Failed to send:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Send a password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string | null,
  resetUrl: string
): Promise<SendEmailResult> {
  const html = `
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

        <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">Reset Your Password</h1>

        <p>Hi ${name || "there"},</p>

        <p>We received a request to reset your password for your Our Coding Kiddos account. Click the button below to create a new password:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
        </div>

        <p style="color: #64748b; font-size: 14px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>

        <p style="color: #64748b; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="color: #8B5CF6; font-size: 12px; word-break: break-all;">${resetUrl}</p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Our Coding Kiddos. All rights reserved.
        </p>
      </body>
    </html>
  `;

  const text = `Reset Your Password

Hi ${name || "there"},

We received a request to reset your password. Click this link to create a new password:

${resetUrl}

This link will expire in 1 hour.

If you didn't request this, you can safely ignore this email.`;

  return sendEmail({
    to: email,
    subject: "Reset Your Password - Our Coding Kiddos",
    html,
    text,
  });
}

/**
 * Send a welcome email to new users
 */
export async function sendWelcomeEmail(
  email: string,
  name: string | null
): Promise<SendEmailResult> {
  const html = `
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

        <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">Welcome to Our Coding Kiddos!</h1>

        <p>Hi ${name || "there"},</p>

        <p>Thank you for joining Our Coding Kiddos! We're excited to help your child start their coding journey.</p>

        <p>Here's what you can do next:</p>
        <ul style="color: #475569;">
          <li>Add your child's profile to get started</li>
          <li>Browse our curriculum and courses</li>
          <li>Take a placement exam to find the right level</li>
          <li>Explore our programs and schedule classes</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL || "https://ourcodingkiddos.com"}/dashboard/parent" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Go to Dashboard</a>
        </div>

        <p>If you have any questions, feel free to reach out to our support team.</p>

        <p>Happy coding!</p>
        <p><strong>The Our Coding Kiddos Team</strong></p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Our Coding Kiddos. All rights reserved.
        </p>
      </body>
    </html>
  `;

  const text = `Welcome to Our Coding Kiddos!

Hi ${name || "there"},

Thank you for joining Our Coding Kiddos! We're excited to help your child start their coding journey.

Here's what you can do next:
- Add your child's profile to get started
- Browse our curriculum and courses
- Take a placement exam to find the right level
- Explore our programs and schedule classes

Visit your dashboard: ${process.env.NEXTAUTH_URL || "https://ourcodingkiddos.com"}/dashboard/parent

If you have any questions, feel free to reach out to our support team.

Happy coding!
The Our Coding Kiddos Team`;

  return sendEmail({
    to: email,
    subject: "Welcome to Our Coding Kiddos!",
    html,
    text,
  });
}

/**
 * Send a class reminder email
 */
export async function sendClassReminderEmail(
  email: string,
  name: string | null,
  className: string,
  startTime: Date,
  meetingLink?: string | null
): Promise<SendEmailResult> {
  const formattedTime = startTime.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const html = `
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

        <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">Class Reminder</h1>

        <p>Hi ${name || "there"},</p>

        <p>This is a reminder that you have an upcoming class:</p>

        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #8B5CF6; font-size: 18px; margin: 0 0 10px 0;">${className}</h2>
          <p style="color: #64748b; margin: 0;"><strong>When:</strong> ${formattedTime}</p>
        </div>

        ${meetingLink ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${meetingLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Join Class</a>
        </div>
        ` : ""}

        <p>See you there!</p>
        <p><strong>The Our Coding Kiddos Team</strong></p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Our Coding Kiddos. All rights reserved.
        </p>
      </body>
    </html>
  `;

  const text = `Class Reminder

Hi ${name || "there"},

This is a reminder that you have an upcoming class:

${className}
When: ${formattedTime}

${meetingLink ? `Join here: ${meetingLink}` : ""}

See you there!
The Our Coding Kiddos Team`;

  return sendEmail({
    to: email,
    subject: `Class Reminder: ${className}`,
    html,
    text,
  });
}

/**
 * Send a notification email
 */
export async function sendNotificationEmail(
  email: string,
  name: string | null,
  title: string,
  message: string,
  actionUrl?: string,
  actionText?: string
): Promise<SendEmailResult> {
  const html = `
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

        <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">${title}</h1>

        <p>Hi ${name || "there"},</p>

        <p>${message}</p>

        ${actionUrl && actionText ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${actionUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">${actionText}</a>
        </div>
        ` : ""}

        <p><strong>The Our Coding Kiddos Team</strong></p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Our Coding Kiddos. All rights reserved.
        </p>
      </body>
    </html>
  `;

  const text = `${title}

Hi ${name || "there"},

${message}

${actionUrl ? `\n${actionText || "Click here"}: ${actionUrl}` : ""}

The Our Coding Kiddos Team`;

  return sendEmail({
    to: email,
    subject: title,
    html,
    text,
  });
}
