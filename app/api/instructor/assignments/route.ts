import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

// GET - List assignments for instructor
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const email = session?.user?.email;

  if (!session?.user || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  const programId = searchParams.get("programId");
  const status = searchParams.get("status"); // published, draft, all

  try {
    // Instructors see their own assignments, admins see all
    const whereClause: any = {};

    if (role === "INSTRUCTOR") {
      whereClause.instructorEmail = email;
    } else if (role !== "ADMIN") {
      // Students/Parents see only published assignments
      whereClause.isPublished = true;
    }

    if (courseId) whereClause.courseId = courseId;
    if (programId) whereClause.programId = programId;
    if (status === "published") whereClause.isPublished = true;
    if (status === "draft") whereClause.isPublished = false;

    const assignments = await prisma.assignment.findMany({
      where: whereClause,
      orderBy: [
        { dueDate: "asc" },
        { createdAt: "desc" },
      ],
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });

    // Get submission stats for each assignment
    const assignmentsWithStats = await Promise.all(
      assignments.map(async (assignment) => {
        const submissionStats = await prisma.assignmentSubmission.groupBy({
          by: ["status"],
          where: { assignmentId: assignment.id },
          _count: true,
        });

        const stats = {
          total: assignment._count.submissions,
          submitted: 0,
          graded: 0,
          pending: 0,
        };

        submissionStats.forEach((s) => {
          if (s.status === "SUBMITTED" || s.status === "IN_REVIEW") {
            stats.pending += s._count;
          } else if (s.status === "GRADED") {
            stats.graded += s._count;
          }
          stats.submitted += s._count;
        });

        return {
          ...assignment,
          submissionStats: stats,
        };
      })
    );

    return NextResponse.json({ assignments: assignmentsWithStats });
  } catch (e) {
    console.error("Failed to fetch assignments:", e);
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}

// POST - Create new assignment
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const email = session?.user?.email;
  const userId = (session?.user as any)?.id;

  if (!session?.user || (role !== "INSTRUCTOR" && role !== "ADMIN") || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      description,
      instructions,
      type,
      language,
      ageGroup,
      dueDate,
      maxPoints,
      xpReward,
      starterCode,
      solutionCode,
      rubric,
      attachments,
      isPublished,
      allowLateSubmission,
      courseId,
      lessonId,
      programId,
      classSessionId,
    } = body;

    if (!title || !description || !instructions) {
      return NextResponse.json(
        { error: "Title, description, and instructions are required" },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        instructions,
        type: type || "CODING_PROJECT",
        language: language || null,
        ageGroup: ageGroup || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        maxPoints: maxPoints || 100,
        xpReward: xpReward || 50,
        starterCode: starterCode || null,
        solutionCode: solutionCode || null,
        rubric: rubric || null,
        attachments: attachments || null,
        isPublished: isPublished || false,
        allowLateSubmission: allowLateSubmission !== false,
        instructorId: userId,
        instructorEmail: email,
        courseId: courseId || null,
        lessonId: lessonId || null,
        programId: programId || null,
        classSessionId: classSessionId || null,
      },
    });

    return NextResponse.json({ assignment, message: "Assignment created successfully" });
  } catch (e) {
    console.error("Failed to create assignment:", e);
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
  }
}

// PATCH - Update assignment
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const email = session?.user?.email;

  if (!session?.user || (role !== "INSTRUCTOR" && role !== "ADMIN") || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
    }

    // Verify ownership (instructors can only edit their own)
    const existing = await prisma.assignment.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    if (role === "INSTRUCTOR" && existing.instructorEmail !== email) {
      return NextResponse.json({ error: "Not authorized to edit this assignment" }, { status: 403 });
    }

    // Handle date conversion
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    const assignment = await prisma.assignment.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ assignment, message: "Assignment updated successfully" });
  } catch (e) {
    console.error("Failed to update assignment:", e);
    return NextResponse.json({ error: "Failed to update assignment" }, { status: 500 });
  }
}

// DELETE - Delete assignment
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const email = session?.user?.email;

  if (!session?.user || (role !== "INSTRUCTOR" && role !== "ADMIN") || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
  }

  try {
    // Verify ownership
    const existing = await prisma.assignment.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    if (role === "INSTRUCTOR" && existing.instructorEmail !== email) {
      return NextResponse.json({ error: "Not authorized to delete this assignment" }, { status: 403 });
    }

    await prisma.assignment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Assignment deleted successfully" });
  } catch (e) {
    console.error("Failed to delete assignment:", e);
    return NextResponse.json({ error: "Failed to delete assignment" }, { status: 500 });
  }
}
