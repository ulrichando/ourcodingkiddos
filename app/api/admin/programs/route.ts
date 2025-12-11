import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

// GET - Fetch all programs with enrollment counts and current instructors
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session as any)?.user?.role?.toUpperCase();

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    // Fetch published programs with their enrollment counts and current instructors
    const programs = await prisma.program.findMany({
      where: {
        isPublished: true
      },
      include: {
        enrollments: {
          where: {
            status: { in: ["ACTIVE", "PENDING_PAYMENT"] }
          }
        },
        classSessions: {
          where: {
            status: { in: ["SCHEDULED", "IN_PROGRESS"] }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            instructorEmail: true
          }
        }
      },
      orderBy: {
        title: 'asc'
      }
    });

    // Get instructor details for programs that have assigned instructors
    const instructorEmails = programs
      .map(p => p.classSessions[0]?.instructorEmail)
      .filter(Boolean) as string[];

    const instructors = await prisma.user.findMany({
      where: {
        email: { in: instructorEmails },
        role: "INSTRUCTOR"
      },
      select: {
        email: true,
        name: true
      }
    });

    const instructorMap = new Map(instructors.map(i => [i.email, i]));

    // Transform programs to include current instructor info
    const transformedPrograms = programs.map(program => {
      const instructorEmail = program.classSessions[0]?.instructorEmail;
      const instructor = instructorEmail ? instructorMap.get(instructorEmail) : null;

      return {
        id: program.id,
        title: program.title,
        description: program.description,
        enrollmentCount: program.enrollments.length,
        currentInstructor: instructor ? {
          email: instructor.email,
          name: instructor.name || instructor.email
        } : null
      };
    });

    return NextResponse.json({ programs: transformedPrograms });
  } catch (error) {
    console.error("GET /api/admin/programs error:", error);
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
  }
}
