import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import { logUpdate } from "../../../../../lib/audit";
import { createNotification } from "../../../notifications/route";
import { sendEmail } from "../../../../../lib/email";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // Only admins can reject accounts
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const userId = body?.userId;
  const reason = body?.reason?.trim();

  if (!userId) {
    return NextResponse.json({ status: "error", message: "User ID is required" }, { status: 400 });
  }

  if (!reason) {
    return NextResponse.json({ status: "error", message: "Rejection reason is required" }, { status: 400 });
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

    // Log the rejection before deleting
    logUpdate(
      session.user.email || "admin",
      "User",
      userId,
      `Rejected and deleted ${user.role.toLowerCase()} account: ${user.name || user.email}`,
      session.user.id,
      { oldStatus: "PENDING", newStatus: "DELETED", reason }
    ).catch(() => {});

    // Delete the user completely from the database
    await prisma.user.delete({
      where: { id: userId },
    });

    // Send notification to the user
    createNotification(
      user.email,
      "Account Application Status",
      `Your account application was not approved. Reason: ${reason}. Please contact support for more information.`,
      "error",
      "/auth/login",
      { userName: user.name, userRole: user.role }
    );

    // Send rejection email
    const baseUrl = process.env.NEXTAUTH_URL || "https://ourcodingkiddos.com";
    const supportUrl = `${baseUrl}/contact`;

    sendEmail({
      to: user.email,
      subject: "Account Application Update - Coding Kiddos",
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

            <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">Hello ${user.name},</h1>

            <p>Thank you for your interest in joining Coding Kiddos as ${user.role === "INSTRUCTOR" ? "an instructor" : "a member"}.</p>

            <p>After careful review, we are unable to approve your account application at this time.</p>

            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 8px;">
              <p style="margin: 0; font-weight: 600; color: #991b1b;">Reason:</p>
              <p style="margin: 8px 0 0 0; color: #7f1d1d;">${reason}</p>
            </div>

            <p>If you believe this was a mistake or would like more information, please don't hesitate to contact our support team.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${supportUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Contact Support</a>
            </div>

            <p>Thank you for your understanding.</p>
            <p><strong>The Coding Kiddos Team</strong></p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
              &copy; ${new Date().getFullYear()} Coding Kiddos. All rights reserved.
            </p>
          </body>
        </html>
      `
    }).catch((err) => {
      console.error("[reject] Failed to send rejection email:", err);
    });

    return NextResponse.json(
      { status: "ok", message: "Account rejected successfully" },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("[reject] Error rejecting account:", e);
    return NextResponse.json(
      { status: "error", message: "Failed to reject account" },
      { status: 500 }
    );
  }
}
