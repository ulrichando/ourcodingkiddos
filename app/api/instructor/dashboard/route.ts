import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { logger } from "../../../../lib/logger";

/**
 * GET /api/instructor/dashboard - Get dashboard data for instructor
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const instructorEmail = session.user.email;
  const role = (session as any).user.role;

  // Only instructors and admins can access this
  if (role !== "INSTRUCTOR" && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Get instructor's sessions with bookings
    const classSessions = await prisma.classSession.findMany({
      where: role === "ADMIN" ? {} : { instructorEmail },
      include: {
        bookings: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                image: true,
                studentProfile: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
          orderBy: { startsAt: "desc" },
        },
      },
      orderBy: { startTime: "asc" },
    });

    // Get unique students from all bookings
    const studentSet = new Map<string, any>();
    classSessions.forEach((s) => {
      s.bookings.forEach((b) => {
        const studentProfile = b.student?.studentProfile;
        const studentId = studentProfile?.id || b.student?.id;
        if (studentId && !studentSet.has(studentId)) {
          studentSet.set(studentId, {
            id: studentId,
            name: studentProfile?.name || b.student?.name || "Student",
            avatar: studentProfile?.avatar || b.student?.image || null,
          });
        }
      });
    });
    const students = Array.from(studentSet.values());

    // Get recent bookings for the instructor's sessions
    const recentBookings = await prisma.booking.findMany({
      where: {
        session: role === "ADMIN" ? {} : { instructorEmail },
      },
      include: {
        student: {
          select: {
            name: true,
            image: true,
            studentProfile: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
        session: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { startsAt: "desc" },
      take: 10,
    });

    const formattedBookings = recentBookings.map((b) => ({
      id: b.id,
      student: b.student?.studentProfile?.name || b.student?.name || "Unknown",
      avatar: b.student?.studentProfile?.avatar || b.student?.image || "👤",
      sessionTitle: b.session?.title || "Class",
      createdAt: b.startsAt, // Use startsAt as the timestamp
    }));

    return NextResponse.json({
      students,
      bookings: formattedBookings,
      totalStudents: students.length,
      totalBookings: recentBookings.length,
    });
  } catch (error) {
    logger.db.error("[instructor/dashboard] Error", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
