import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

// GET - Fetch instructors with their availability
// For parents: returns only instructors teaching their children
// For others: returns all instructors
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session as any)?.user?.role?.toUpperCase();
    const userEmail = session.user.email;

    let instructors;

    // If parent, only return instructors teaching their children
    if (userRole === "PARENT" && userEmail) {
      // Find parent's children
      const parent = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
          parentProfile: {
            include: {
              children: {
                include: {
                  programEnrollments: {
                    where: {
                      status: { in: ["ACTIVE", "PENDING_PAYMENT"] }
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!parent?.parentProfile) {
        return NextResponse.json({ instructors: [] });
      }

      // Get all class sessions for the parent's children's programs
      const programIds = parent.parentProfile.children.flatMap(
        child => child.programEnrollments.map(e => e.programId)
      );

      // Find instructors teaching these programs
      const classSessions = await prisma.classSession.findMany({
        where: {
          programId: { in: programIds },
          status: { in: ["SCHEDULED", "IN_PROGRESS"] }
        },
        select: {
          instructorEmail: true
        },
        distinct: ["instructorEmail"]
      });

      let instructorEmails = classSessions
        .map(s => s.instructorEmail)
        .filter(Boolean) as string[];

      // Fallback: If no instructors found from programs, check existing conversations
      if (instructorEmails.length === 0) {
        const existingConversations = await prisma.conversation.findMany({
          where: {
            participants: {
              some: {
                userEmail: userEmail
              }
            }
          },
          include: {
            participants: {
              where: {
                userRole: "INSTRUCTOR"
              }
            }
          }
        });

        instructorEmails = existingConversations
          .flatMap(c => c.participants.map(p => p.userEmail))
          .filter((email, index, self) => self.indexOf(email) === index) as string[];
      }

      // If still no instructors found, return all instructors (fallback for demo/testing)
      if (instructorEmails.length === 0) {
        instructors = await prisma.user.findMany({
          where: {
            role: "INSTRUCTOR",
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        });
      } else {
        instructors = await prisma.user.findMany({
          where: {
            email: { in: instructorEmails },
            role: "INSTRUCTOR",
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        });
      }
    } else {
      // For non-parents, return all instructors
      instructors = await prisma.user.findMany({
        where: {
          role: "INSTRUCTOR",
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });
    }

    // Fetch availability for all instructors
    const instructorEmails = instructors.map((i) => i.email).filter(Boolean) as string[];

    // Get recurring availability
    const recurringAvailability = await prisma.instructorAvailability.findMany({
      where: {
        instructorEmail: { in: instructorEmails },
        isActive: true,
        isRecurring: true,
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" },
      ],
    });

    // Get specific date availability (only future dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const specificAvailability = await prisma.instructorAvailability.findMany({
      where: {
        instructorEmail: { in: instructorEmails },
        isActive: true,
        isRecurring: false,
        specificDate: {
          gte: today,
        },
      },
      orderBy: [
        { specificDate: "asc" },
        { startTime: "asc" },
      ],
    });

    // Group recurring availability by instructor email
    const recurringMap: Record<string, any[]> = {};
    for (const slot of recurringAvailability) {
      const email = slot.instructorEmail || "";
      if (!recurringMap[email]) {
        recurringMap[email] = [];
      }
      recurringMap[email].push({
        id: slot.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isRecurring: true,
      });
    }

    // Group specific date availability by instructor email
    const specificMap: Record<string, any[]> = {};
    for (const slot of specificAvailability) {
      const email = slot.instructorEmail || "";
      if (!specificMap[email]) {
        specificMap[email] = [];
      }
      specificMap[email].push({
        id: slot.id,
        specificDate: slot.specificDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isRecurring: false,
      });
    }

    // Combine instructors with their availability
    const instructorsWithAvailability = instructors.map((instructor) => ({
      ...instructor,
      availability: recurringMap[instructor.email || ""] || [],
      specificDateAvailability: specificMap[instructor.email || ""] || [],
    }));

    return NextResponse.json({ instructors: instructorsWithAvailability });
  } catch (error) {
    console.error("GET /api/instructors error:", error);
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 });
  }
}
