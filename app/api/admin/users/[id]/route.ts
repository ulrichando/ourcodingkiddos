import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "lib/auth";
import prisma from "lib/prisma";
import { logUpdate, logDelete } from "lib/audit";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { name, email, role, password } = body ?? {};

  try {
    const data: any = {};
    if (name) data.name = name;
    if (email) data.email = String(email).toLowerCase();
    if (role) data.role = String(role).toUpperCase();
    if (password) data.hashedPassword = await bcrypt.hash(password, 10);

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true },
    });

    // Log user update
    logUpdate(
      session.user.email || "unknown",
      "User",
      id,
      `Admin updated user: ${updated.email}`,
      (session as any).user.id,
      { changes: Object.keys(data) }
    ).catch(() => {});

    return NextResponse.json({ user: updated });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Prevent admin from deleting themselves
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true },
  });

  if (currentUser?.id === id) {
    return NextResponse.json({
      error: "You cannot delete your own admin account. Please ask another admin to do this."
    }, { status: 403 });
  }

  try {
    // Delete user with all related records using a transaction
    await prisma.$transaction(async (tx) => {
      // Delete related records first to avoid foreign key constraint errors

      // Delete student profile related records
      const studentProfile = await tx.studentProfile.findUnique({
        where: { userId: id },
        select: { id: true }
      });

      if (studentProfile) {
        // Delete projects associated with this student
        await tx.project.deleteMany({
          where: { studentId: studentProfile.id }
        });
      }

      // Delete parent profile related records
      await tx.studentProfile.deleteMany({
        where: {
          guardian: {
            userId: id
          }
        }
      });

      // Delete user badges
      await tx.userBadge.deleteMany({ where: { userId: id } });

      // Delete achievements
      await tx.achievement.deleteMany({ where: { userId: id } });

      // Delete portfolio items
      await tx.portfolioItem.deleteMany({ where: { userId: id } });

      // Delete bookings (as student or instructor)
      await tx.booking.deleteMany({
        where: {
          OR: [
            { studentId: id },
            { instructorId: id }
          ]
        }
      });

      // Delete class sessions
      await tx.classSession.deleteMany({ where: { instructorId: id } });

      // Delete instructor availability
      await tx.instructorAvailability.deleteMany({ where: { instructorId: id } });

      // Delete certificates through enrollments
      const enrollments = await tx.enrollment.findMany({
        where: { userId: id },
        select: { id: true }
      });

      for (const enrollment of enrollments) {
        await tx.certificate.deleteMany({
          where: { enrollmentId: enrollment.id }
        });
        await tx.progress.deleteMany({
          where: { enrollmentId: enrollment.id }
        });
      }

      // Delete enrollments
      await tx.enrollment.deleteMany({ where: { userId: id } });

      // Delete subscriptions
      await tx.subscription.deleteMany({ where: { userId: id } });

      // Delete payments
      await tx.payment.deleteMany({ where: { userId: id } });

      // Delete student profile
      await tx.studentProfile.deleteMany({ where: { userId: id } });

      // Delete parent profile
      await tx.parentProfile.deleteMany({ where: { userId: id } });

      // Delete accounts (OAuth)
      await tx.account.deleteMany({ where: { userId: id } });

      // Delete sessions
      await tx.session.deleteMany({ where: { userId: id } });

      // Finally delete the user
      await tx.user.delete({ where: { id } });
    });

    // Log user deletion
    logDelete(
      session.user.email || "unknown",
      "User",
      id,
      `Admin deleted user account`,
      (session as any).user.id
    ).catch(() => {});

    return NextResponse.json({ status: "ok" });
  } catch (e: any) {
    console.error("[admin/users/delete] Error:", e);
    return NextResponse.json({
      error: e.message || "Delete failed",
      details: e.toString()
    }, { status: 500 });
  }
}
