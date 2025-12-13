import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: "You're already subscribed!" },
          { status: 400 }
        );
      }
      // Re-activate subscription
      await prisma.newsletterSubscriber.update({
        where: { email: normalizedEmail },
        data: {
          isActive: true,
          unsubscribedAt: null,
          subscribedAt: new Date(),
        },
      });
    } else {
      // Create new subscriber
      await prisma.newsletterSubscriber.create({
        data: {
          email: normalizedEmail,
          source: source || "footer",
        },
      });
    }

    // Send welcome email
    await sendEmail({
      to: normalizedEmail,
      subject: "Welcome to Coding Kiddos Newsletter!",
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

            <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">You're In!</h1>

            <p>Thanks for subscribing to the Coding Kiddos newsletter!</p>

            <p>You'll be the first to know about:</p>
            <ul style="color: #475569;">
              <li>New courses and programs</li>
              <li>Coding tips for kids</li>
              <li>Special offers and discounts</li>
              <li>Student success stories</li>
              <li>Free resources and tutorials</li>
            </ul>

            <p>In the meantime, check out our <a href="${process.env.NEXTAUTH_URL || "https://ourcodingkiddos.com"}/courses" style="color: #8B5CF6;">courses</a> and see how we can help your child start their coding journey!</p>

            <p>Happy coding!</p>
            <p><strong>The Coding Kiddos Team</strong></p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
              You can <a href="${process.env.NEXTAUTH_URL || "https://ourcodingkiddos.com"}/unsubscribe?email=${encodeURIComponent(normalizedEmail)}" style="color: #8B5CF6;">unsubscribe</a> at any time.
            </p>
          </body>
        </html>
      `,
      text: `Welcome to Coding Kiddos Newsletter!

Thanks for subscribing! You'll be the first to know about new courses, coding tips, special offers, and more.

Check out our courses: ${process.env.NEXTAUTH_URL || "https://ourcodingkiddos.com"}/courses

Happy coding!
The Coding Kiddos Team`,
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed!",
    });
  } catch (error) {
    logger.api.error("Newsletter subscription failed", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
