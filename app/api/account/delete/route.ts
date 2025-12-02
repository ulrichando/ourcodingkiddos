import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { stripe } from "../../../../lib/stripe";

/**
 * DELETE /api/account/delete - Permanently delete user account and all associated data
 * This action is irreversible and will:
 * 1. Cancel any active Stripe subscriptions
 * 2. Delete all user data from the database
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    console.log("[Delete Account] Starting deletion for user:", userEmail);

    // Admin accounts cannot be self-deleted for security
    if (userRole === "ADMIN") {
      return NextResponse.json(
        { error: "Admin accounts cannot be deleted through this interface. Please contact support." },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: true,
        studentProfile: true,
        parentProfile: {
          include: {
            children: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Step 1: Cancel all Stripe subscriptions
    for (const subscription of user.subscriptions) {
      if (subscription.stripeSubscriptionId) {
        try {
          console.log("[Delete Account] Canceling Stripe subscription:", subscription.stripeSubscriptionId);
          await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
        } catch (stripeError: any) {
          // Continue even if Stripe subscription doesn't exist
          if (stripeError.code !== "resource_missing") {
            console.error("[Delete Account] Stripe cancellation error:", stripeError.message);
          }
        }
      }
    }

    // Step 2: Delete Stripe customer if exists
    if (user.stripeCustomerId) {
      try {
        console.log("[Delete Account] Deleting Stripe customer:", user.stripeCustomerId);
        await stripe.customers.del(user.stripeCustomerId);
      } catch (stripeError: any) {
        if (stripeError.code !== "resource_missing") {
          console.error("[Delete Account] Stripe customer deletion error:", stripeError.message);
        }
      }
    }

    // Step 3: Delete all related data using a transaction
    await prisma.$transaction(async (tx) => {
      // Delete achievements
      await tx.achievement.deleteMany({ where: { userId } });
      console.log("[Delete Account] Deleted achievements");

      // Delete user badges
      await tx.userBadge.deleteMany({ where: { userId } });
      console.log("[Delete Account] Deleted user badges");

      // Delete portfolio items
      await tx.portfolioItem.deleteMany({ where: { userId } });
      console.log("[Delete Account] Deleted portfolio items");

      // Delete payments
      await tx.payment.deleteMany({ where: { userId } });
      console.log("[Delete Account] Deleted payments");

      // Delete subscriptions
      await tx.subscription.deleteMany({ where: { userId } });
      console.log("[Delete Account] Deleted subscriptions");

      // Delete progress records through enrollments
      const enrollments = await tx.enrollment.findMany({
        where: { userId },
        select: { id: true },
      });
      const enrollmentIds = enrollments.map((e) => e.id);

      // Delete certificates
      await tx.certificate.deleteMany({
        where: { enrollmentId: { in: enrollmentIds } },
      });
      console.log("[Delete Account] Deleted certificates");

      // Delete progress
      await tx.progress.deleteMany({
        where: { enrollmentId: { in: enrollmentIds } },
      });
      console.log("[Delete Account] Deleted progress records");

      // Delete enrollments
      await tx.enrollment.deleteMany({ where: { userId } });
      console.log("[Delete Account] Deleted enrollments");

      // Handle bookings - soft delete by anonymizing instead of hard delete
      // to preserve instructor records
      await tx.booking.updateMany({
        where: { studentId: userId },
        data: {
          status: "CANCELLED",
          notes: "[Account Deleted]",
        },
      });
      console.log("[Delete Account] Anonymized bookings");

      // For instructors, update their sessions and bookings
      if (userRole === "INSTRUCTOR") {
        await tx.booking.updateMany({
          where: { instructorId: userId },
          data: {
            status: "CANCELLED",
            notes: "[Instructor Account Deleted]",
          },
        });

        await tx.classSession.updateMany({
          where: { instructorId: userId },
          data: {
            status: "CANCELLED",
            instructorId: null,
          },
        });

        await tx.instructorAvailability.deleteMany({
          where: { instructorId: userId },
        });
        console.log("[Delete Account] Handled instructor data");
      }

      // Delete student profile
      if (user.studentProfile) {
        await tx.studentProfile.delete({ where: { userId } });
        console.log("[Delete Account] Deleted student profile");
      }

      // Delete parent profile and handle children
      if (user.parentProfile) {
        // Unlink children from this parent (don't delete child accounts)
        await tx.studentProfile.updateMany({
          where: { guardianId: user.parentProfile.id },
          data: { guardianId: null, parentEmail: null },
        });
        console.log("[Delete Account] Unlinked children from parent");

        await tx.parentProfile.delete({ where: { userId } });
        console.log("[Delete Account] Deleted parent profile");
      }

      // Anonymize conversation participants and messages (preserve conversation history)
      await tx.conversationParticipant.updateMany({
        where: { userEmail: userEmail || "" },
        data: { userName: "[Deleted User]" },
      });
      await tx.message.updateMany({
        where: { fromEmail: userEmail || "" },
        data: { fromName: "[Deleted User]" },
      });
      console.log("[Delete Account] Anonymized messages");

      // Anonymize support tickets
      await tx.supportTicket.updateMany({
        where: { userEmail: userEmail || "" },
        data: { userName: "[Deleted User]" },
      });
      await tx.ticketReply.updateMany({
        where: { fromEmail: userEmail || "" },
        data: { fromName: "[Deleted User]" },
      });
      console.log("[Delete Account] Anonymized support tickets");

      // Anonymize class requests
      await tx.classRequest.updateMany({
        where: { parentEmail: userEmail || "" },
        data: { parentName: "[Deleted User]", studentName: "[Deleted]" },
      });
      console.log("[Delete Account] Anonymized class requests");

      // Delete sessions (NextAuth) - these cascade delete automatically
      await tx.session.deleteMany({ where: { userId } });
      console.log("[Delete Account] Deleted auth sessions");

      // Delete accounts (OAuth) - these cascade delete automatically
      await tx.account.deleteMany({ where: { userId } });
      console.log("[Delete Account] Deleted OAuth accounts");

      // Create audit log entry before deleting user
      await tx.auditLog.create({
        data: {
          userEmail: userEmail || "unknown",
          action: "DELETE",
          resource: "User",
          resourceId: userId,
          details: `User account deleted by user request`,
          status: "success",
          severity: "WARNING",
        },
      });

      // Finally, delete the user
      await tx.user.delete({ where: { id: userId } });
      console.log("[Delete Account] Deleted user record");
    });

    console.log("[Delete Account] Account deletion completed for:", userEmail);

    return NextResponse.json({
      success: true,
      message: "Your account has been permanently deleted",
    });
  } catch (error: any) {
    console.error("DELETE /api/account/delete error:", error.message, error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to delete account" },
      { status: 500 }
    );
  }
}
