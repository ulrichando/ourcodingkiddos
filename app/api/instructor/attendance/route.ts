import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { createNotification } from "../../notifications/route";
import { logger } from "../../../../lib/logger";

// Check if user is online (active in last 5 minutes)
function isOnline(lastSeen?: Date | null): boolean {
  if (!lastSeen) return false;
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return lastSeen > fiveMinutesAgo;
}

// GET - Check attendance for a class session
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const email = session?.user?.email;

  if (!session?.user || !email || (role !== "INSTRUCTOR" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");

  if (!classId) {
    return NextResponse.json({ error: "Missing classId parameter" }, { status: 400 });
  }

  try {
    // Get class session with bookings
    const classSession = await prisma.classSession.findUnique({
      where: { id: classId },
      include: {
        bookings: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                lastSeen: true,
                studentProfile: {
                  select: {
                    name: true,
                    avatar: true,
                    parentEmail: true,
                    guardian: {
                      select: {
                        user: {
                          select: {
                            name: true,
                            email: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!classSession) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Check each student's online status
    const attendance = classSession.bookings.map((booking) => {
      const student = booking.student;
      const online = isOnline(student?.lastSeen);
      const studentName = student?.studentProfile?.name || student?.name || "Unknown";
      const parentEmail = student?.studentProfile?.guardian?.user?.email || student?.studentProfile?.parentEmail;
      const parentName = student?.studentProfile?.guardian?.user?.name || "Parent";

      return {
        bookingId: booking.id,
        studentId: student?.id,
        studentName,
        studentEmail: student?.email,
        avatar: student?.studentProfile?.avatar,
        online,
        lastSeen: student?.lastSeen,
        attended: booking.attended,
        parentEmail,
        parentName,
      };
    });

    const onlineCount = attendance.filter((a) => a.online).length;
    const offlineCount = attendance.filter((a) => !a.online).length;

    return NextResponse.json({
      classId: classSession.id,
      classTitle: classSession.title,
      startTime: classSession.startTime,
      attendance,
      summary: {
        total: attendance.length,
        online: onlineCount,
        offline: offlineCount,
      },
    });
  } catch (error) {
    logger.db.error("[attendance] Error checking attendance", error);
    return NextResponse.json({ error: "Failed to check attendance" }, { status: 500 });
  }
}

// POST - Notify instructor about offline students
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const email = session?.user?.email;

  if (!session?.user || !email || (role !== "INSTRUCTOR" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { classId, notifyParents } = body;

  if (!classId) {
    return NextResponse.json({ error: "Missing classId" }, { status: 400 });
  }

  try {
    // Get class session with bookings
    const classSession = await prisma.classSession.findUnique({
      where: { id: classId },
      include: {
        bookings: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                lastSeen: true,
                studentProfile: {
                  select: {
                    name: true,
                    parentEmail: true,
                    guardian: {
                      select: {
                        user: {
                          select: {
                            name: true,
                            email: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!classSession) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Find offline students
    const offlineStudents = classSession.bookings
      .filter((booking) => !isOnline(booking.student?.lastSeen))
      .map((booking) => {
        const student = booking.student;
        return {
          studentName: student?.studentProfile?.name || student?.name || "Unknown",
          studentEmail: student?.email,
          parentEmail: student?.studentProfile?.guardian?.user?.email || student?.studentProfile?.parentEmail,
          parentName: student?.studentProfile?.guardian?.user?.name || "Parent",
        };
      });

    if (offlineStudents.length === 0) {
      return NextResponse.json({
        message: "All students are online!",
        offlineCount: 0,
      });
    }

    // Create notification for instructor
    const offlineNames = offlineStudents.map((s) => s.studentName).join(", ");
    createNotification(
      email,
      `${offlineStudents.length} Student(s) Offline`,
      `The following students are not online for "${classSession.title}": ${offlineNames}`,
      "attendance_alert",
      `/dashboard/instructor/classes/${classId}`,
      {
        classId,
        classTitle: classSession.title,
        offlineStudents: offlineStudents.map((s) => s.studentName),
      }
    );

    // Optionally notify parents about their offline children
    if (notifyParents) {
      for (const student of offlineStudents) {
        if (student.parentEmail) {
          createNotification(
            student.parentEmail,
            `${student.studentName} is not online for class`,
            `Your child ${student.studentName} is not currently online for the class "${classSession.title}" which is starting soon. Please ensure they join.`,
            "class_reminder",
            "/dashboard/parent",
            {
              classId,
              classTitle: classSession.title,
              studentName: student.studentName,
            }
          );
        }
      }
    }

    return NextResponse.json({
      message: `Notification sent. ${offlineStudents.length} student(s) are offline.`,
      offlineCount: offlineStudents.length,
      offlineStudents: offlineStudents.map((s) => s.studentName),
      parentsNotified: notifyParents ? offlineStudents.filter((s) => s.parentEmail).length : 0,
    });
  } catch (error) {
    logger.db.error("Error notifying attendance", error);
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
  }
}
