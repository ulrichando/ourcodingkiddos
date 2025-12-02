import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

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
    // Get instructor's sessions
    const sessions = await prisma.classSession.findMany({
      where: role === "ADMIN" ? {} : { instructorEmail },
      include: {
        bookings: {
          include: {
            studentProfile: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { startTime: "asc" },
    });

    // Get unique students from all bookings
    const studentSet = new Map<string, any>();
    sessions.forEach((s) => {
      s.bookings.forEach((b) => {
        if (b.studentProfile && !studentSet.has(b.studentProfile.id)) {
          studentSet.set(b.studentProfile.id, {
            id: b.studentProfile.id,
            name: b.studentProfile.name,
            avatar: b.studentProfile.avatar,
          });
        }
      });
    });
    const students = Array.from(studentSet.values());

    // Get recent bookings
    const recentBookings = await prisma.classBooking.findMany({
      where: {
        classSession: role === "ADMIN" ? {} : { instructorEmail },
      },
      include: {
        studentProfile: {
          select: {
            name: true,
            avatar: true,
          },
        },
        classSession: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const formattedBookings = recentBookings.map((b) => ({
      id: b.id,
      student: b.studentProfile?.name || "Unknown",
      avatar: b.studentProfile?.avatar || "👤",
      sessionTitle: b.classSession?.title || "Class",
      createdAt: b.createdAt,
    }));

    return NextResponse.json({
      students,
      bookings: formattedBookings,
      totalStudents: students.length,
      totalBookings: recentBookings.length,
    });
  } catch (error) {
    console.error("[instructor/dashboard] Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
