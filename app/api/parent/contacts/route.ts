import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

// GET - Fetch contacts for parents (instructors + children)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session as any)?.user?.role?.toUpperCase();
    const userEmail = session.user.email;

    if (userRole !== "PARENT" || !userEmail) {
      return NextResponse.json({ error: "Only parents can access this endpoint" }, { status: 403 });
    }

    // Find parent's profile with children
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
      return NextResponse.json({ contacts: [] });
    }

    const contacts: any[] = [];

    // Add children as contacts
    for (const child of parent.parentProfile.children) {
      // Find the User account associated with this student profile
      const studentUser = await prisma.user.findUnique({
        where: { id: child.userId },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true
        }
      });

      if (studentUser && studentUser.email) {
        contacts.push({
          id: studentUser.id,
          email: studentUser.email,
          name: studentUser.name || child.name || "Student",
          type: "student",
          role: studentUser.role,
          image: studentUser.image,
          relationship: "Child"
        });
      }
    }

    // Get instructors teaching children's programs
    const programIds = parent.parentProfile.children.flatMap(
      child => child.programEnrollments.map(e => e.programId)
    );

    if (programIds.length > 0) {
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

      // Fallback: check existing conversations
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

      // Final fallback for demo/testing
      if (instructorEmails.length === 0) {
        const allInstructors = await prisma.user.findMany({
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

        for (const instructor of allInstructors) {
          contacts.push({
            id: instructor.id,
            email: instructor.email,
            name: instructor.name,
            type: "instructor",
            role: "INSTRUCTOR",
            image: instructor.image,
            relationship: "Instructor"
          });
        }
      } else {
        const instructors = await prisma.user.findMany({
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

        for (const instructor of instructors) {
          contacts.push({
            id: instructor.id,
            email: instructor.email,
            name: instructor.name,
            type: "instructor",
            role: "INSTRUCTOR",
            image: instructor.image,
            relationship: "Instructor"
          });
        }
      }
    }

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("GET /api/parent/contacts error:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}
