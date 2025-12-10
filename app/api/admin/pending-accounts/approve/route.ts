import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import { logUpdate } from "../../../../../lib/audit";
import { createNotification } from "../../../notifications/route";
import { sendEmail } from "../../../../../lib/email";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // Only admins can approve accounts
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const userId = body?.userId;

  if (!userId) {
    return NextResponse.json({ status: "error", message: "User ID is required" }, { status: 400 });
  }

  try {
    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        accountStatus: true,
      },
    });

    if (!user) {
      return NextResponse.json({ status: "error", message: "User not found" }, { status: 404 });
    }

    if (user.accountStatus !== "PENDING") {
      return NextResponse.json(
        { status: "error", message: "User is not pending approval" },
        { status: 400 }
      );
    }

    // Update account status to APPROVED
    await prisma.user.update({
      where: { id: userId },
      data: { accountStatus: "APPROVED" },
    });

    // Log the approval
    logUpdate(
      session.user.email || "admin",
      "User",
      userId,
      `Approved ${user.role.toLowerCase()} account: ${user.name || user.email}`,
      session.user.id,
      { oldStatus: "PENDING", newStatus: "APPROVED" }
    ).catch(() => {});

    // Send notification to the user
    createNotification(
      user.email,
      `Welcome to Coding Kiddos, ${user.name}!`,
      user.role === "INSTRUCTOR"
        ? "Your instructor account has been approved! You can now log in and start creating sessions."
        : "Your account has been approved! You can now log in and access the platform.",
      "welcome",
      "/auth/login",
      { userName: user.name, userRole: user.role }
    );

    // Send approval email
    const baseUrl = process.env.NEXTAUTH_URL || "https://ourcodingkiddos.com";
    const loginUrl = `${baseUrl}/auth/login`;

    sendEmail({
      to: user.email,
      subject: "Account Approved - Welcome to Coding Kiddos!",
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

            <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">Congratulations, ${user.name}!</h1>

            <p>Your ${user.role.toLowerCase()} account has been approved by our admin team.</p>

            ${
              user.role === "INSTRUCTOR"
                ? `
              <p>You can now:</p>
              <ul style="color: #475569;">
                <li>Log in to your instructor dashboard</li>
                <li>Create and manage coding sessions</li>
                <li>Connect with students</li>
                <li>Schedule classes via Google Meet</li>
              </ul>
            `
                : `
              <p>You can now log in and start exploring our platform.</p>
            `
            }

            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Log In Now</a>
            </div>

            <p>If you have any questions, feel free to reach out to our support team.</p>

            <p>Welcome aboard!</p>
            <p><strong>The Coding Kiddos Team</strong></p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
              &copy; ${new Date().getFullYear()} Coding Kiddos. All rights reserved.
            </p>
          </body>
        </html>
      `
    }).catch((err) => {
      console.error("[approve] Failed to send approval email:", err);
    });

    return NextResponse.json(
      { status: "ok", message: "Account approved successfully" },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("[approve] Error approving account:", e);
    return NextResponse.json(
      { status: "error", message: "Failed to approve account" },
      { status: 500 }
    );
  }
}
