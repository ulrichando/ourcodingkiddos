import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";

// POST - Assign an instructor to a program
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session as any)?.user?.role?.toUpperCase();

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    const { programId, instructorEmail } = await req.json();

    if (!programId || !instructorEmail) {
      return NextResponse.json(
        { error: "programId and instructorEmail are required" },
        { status: 400 }
      );
    }

    // Verify program exists
    const program = await prisma.program.findUnique({
      where: { id: programId }
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Verify instructor exists and has INSTRUCTOR role
    const instructor = await prisma.user.findUnique({
      where: { email: instructorEmail }
    });

    if (!instructor || instructor.role !== "INSTRUCTOR") {
      return NextResponse.json(
        { error: "Invalid instructor email or user is not an instructor" },
        { status: 400 }
      );
    }

    // Check if there's an existing active class session for this program
    const existingSession = await prisma.classSession.findFirst({
      where: {
        programId: programId,
        status: { in: ["SCHEDULED", "IN_PROGRESS"] }
      }
    });

    if (existingSession) {
      // Update existing session with new instructor
      await prisma.classSession.update({
        where: { id: existingSession.id },
        data: {
          instructorEmail: instructorEmail,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new class session for this program with the instructor
      await prisma.classSession.create({
        data: {
          title: `${program.title} - Class Session`,
          programId: programId,
          instructorEmail: instructorEmail,
          sessionType: "ONE_ON_ONE",
          language: "JAVASCRIPT",
          ageGroup: "AGES_7_10",
          startTime: new Date(),
          durationMinutes: (program.durationInMonths || 1) * 4 * 60,
          status: "SCHEDULED",
          meetingUrl: null
        }
      });
    }

    return NextResponse.json({
      success: true,
      programTitle: program.title,
      instructorEmail: instructorEmail
    });
  } catch (error) {
    console.error("POST /api/admin/programs/assign-instructor error:", error);
    return NextResponse.json({ error: "Failed to assign instructor" }, { status: 500 });
  }
}
