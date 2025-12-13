import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "lib/auth";
import prisma from "lib/prisma";
import { logUpdate, logDelete } from "lib/audit";
import { logger } from "lib/logger";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { name, email, role, password, phone, address } = body ?? {};

  try {
    // Build user update data
    const userData: any = {};
    if (name !== undefined) userData.name = name || null;
    if (email) userData.email = String(email).toLowerCase();
    if (role) userData.role = String(role).toUpperCase();
    if (password) userData.hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    const updated = await prisma.user.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    // Handle phone and address updates via parentProfile
    let updatedPhone = null;
    let updatedAddress = null;

    if (phone !== undefined || address !== undefined) {
      // Check if parent profile exists
      const existingProfile = await prisma.parentProfile.findUnique({
        where: { userId: id },
      });

      if (existingProfile) {
        // Update existing profile
        const profileUpdate = await prisma.parentProfile.update({
          where: { userId: id },
          data: {
            ...(phone !== undefined ? { phone: phone || null } : {}),
            ...(address !== undefined ? { address: address || null } : {}),
          },
        });
        updatedPhone = profileUpdate.phone;
        updatedAddress = profileUpdate.address;
      } else if (phone || address) {
        // Create new profile if phone or address provided
        const newProfile = await prisma.parentProfile.create({
          data: {
            userId: id,
            phone: phone || null,
            address: address || null,
          },
        });
        updatedPhone = newProfile.phone;
        updatedAddress = newProfile.address;
      }
    } else {
      // Fetch existing phone/address if not being updated
      const existingProfile = await prisma.parentProfile.findUnique({
        where: { userId: id },
        select: { phone: true, address: true },
      });
      updatedPhone = existingProfile?.phone || null;
      updatedAddress = existingProfile?.address || null;
    }

    // Log user update
    const changedFields = [
      ...Object.keys(userData),
      ...(phone !== undefined ? ["phone"] : []),
      ...(address !== undefined ? ["address"] : []),
    ];

    logUpdate(
      session.user.email || "unknown",
      "User",
      id,
      `Admin updated user: ${updated.email}`,
      (session as any).user.id,
      { changes: changedFields }
    ).catch(() => {});

    return NextResponse.json({
      user: {
        ...updated,
        phone: updatedPhone,
        address: updatedAddress,
      },
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    logger.db.error("Failed to update user", e);
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
        // Delete showcase project likes first
        await tx.like.deleteMany({
          where: {
            studentProject: {
              studentProfileId: studentProfile.id
            }
          }
        });

        // Delete showcase project comments
        await tx.comment.deleteMany({
          where: {
            studentProject: {
              studentProfileId: studentProfile.id
            }
          }
        });

        // Delete showcase projects (StudentProject model)
        await tx.studentProject.deleteMany({
          where: { studentProfileId: studentProfile.id }
        });

        // Delete projects associated with this student
        await tx.project.deleteMany({
          where: { studentId: studentProfile.id }
        });
      }

      // Get parent profile to find children
      const parentProfile = await tx.parentProfile.findUnique({
        where: { userId: id },
        select: { id: true }
      });

      // If this is a parent, we need to delete children's data first
      if (parentProfile) {
        // Find all children (students) of this parent
        const childrenProfiles = await tx.studentProfile.findMany({
          where: { guardianId: parentProfile.id },
          select: { id: true }
        });

        for (const child of childrenProfiles) {
          // Delete child's showcase project likes
          await tx.like.deleteMany({
            where: {
              studentProject: {
                studentProfileId: child.id
              }
            }
          });

          // Delete child's showcase project comments
          await tx.comment.deleteMany({
            where: {
              studentProject: {
                studentProfileId: child.id
              }
            }
          });

          // Delete child's showcase projects
          await tx.studentProject.deleteMany({
            where: { studentProfileId: child.id }
          });

          // Delete child's projects
          await tx.project.deleteMany({
            where: { studentId: child.id }
          });

          // Delete child's program enrollments
          await tx.programEnrollment.deleteMany({
            where: { studentProfileId: child.id }
          });
        }

        // Now delete all children profiles linked to this parent
        await tx.studentProfile.deleteMany({
          where: { guardianId: parentProfile.id }
        });
      }

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

      // Delete program enrollments (if user has a student profile)
      if (studentProfile) {
        await tx.programEnrollment.deleteMany({ where: { studentProfileId: studentProfile.id } });
      }

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
    logger.db.error("Failed to delete user", e);
    return NextResponse.json({
      error: e.message || "Delete failed",
      details: e.toString()
    }, { status: 500 });
  }
}
