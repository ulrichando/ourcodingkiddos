import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import { SubmissionStatus } from "../../../../../generated/prisma-client";

// GET - List submissions for an assignment (instructor) or student's own submissions
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const email = session?.user?.email;
  const userId = (session?.user as any)?.id;

  if (!session?.user || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const assignmentId = searchParams.get("assignmentId");
  const studentId = searchParams.get("studentId");
  const status = searchParams.get("status");

  try {
    const whereClause: any = {};

    if (assignmentId) {
      whereClause.assignmentId = assignmentId;
    }

    // Role-based filtering
    if (role === "STUDENT") {
      // Students can only see their own submissions
      whereClause.studentId = userId;
    } else if (role === "PARENT") {
      // Parents can see their children's submissions
      const parent = await prisma.parentProfile.findUnique({
        where: { userId },
        include: { children: { select: { userId: true } } },
      });
      const childIds = parent?.children.map((c) => c.userId) || [];
      whereClause.studentId = { in: childIds };
    } else if (role === "INSTRUCTOR") {
      // Instructors see submissions for their assignments
      if (assignmentId) {
        const assignment = await prisma.assignment.findUnique({
          where: { id: assignmentId },
        });
        if (assignment?.instructorEmail !== email) {
          return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }
      }
    }
    // Admins see all

    if (studentId && (role === "INSTRUCTOR" || role === "ADMIN")) {
      whereClause.studentId = studentId;
    }

    if (status) {
      whereClause.status = status;
    }

    const submissions = await prisma.assignmentSubmission.findMany({
      where: whereClause,
      orderBy: { submittedAt: "desc" },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            maxPoints: true,
            dueDate: true,
            type: true,
          },
        },
      },
    });

    return NextResponse.json({ submissions });
  } catch (e) {
    console.error("Failed to fetch submissions:", e);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

// POST - Submit assignment (student) or create submission
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const email = session?.user?.email;
  const userId = (session?.user as any)?.id;
  const userName = session?.user?.name;

  if (!session?.user || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      assignmentId,
      code,
      content,
      attachments,
      repoUrl,
      demoUrl,
      isDraft,
    } = body;

    if (!assignmentId) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
    }

    // Check assignment exists and is published
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    if (!assignment.isPublished && role === "STUDENT") {
      return NextResponse.json({ error: "Assignment not available" }, { status: 403 });
    }

    // Check for existing submission
    const existingSubmission = await prisma.assignmentSubmission.findFirst({
      where: {
        assignmentId,
        studentId: userId,
        status: { in: ["DRAFT", "RETURNED"] },
      },
      orderBy: { attemptNumber: "desc" },
    });

    // Determine if late
    const isLate = assignment.dueDate && new Date() > new Date(assignment.dueDate);
    if (isLate && !assignment.allowLateSubmission && !isDraft) {
      return NextResponse.json({ error: "Late submissions not allowed" }, { status: 400 });
    }

    // Get attempt number
    const lastSubmission = await prisma.assignmentSubmission.findFirst({
      where: { assignmentId, studentId: userId },
      orderBy: { attemptNumber: "desc" },
    });
    const attemptNumber = existingSubmission
      ? existingSubmission.attemptNumber
      : (lastSubmission?.attemptNumber || 0) + 1;

    const submissionData = {
      code: code || null,
      content: content || null,
      attachments: attachments || null,
      repoUrl: repoUrl || null,
      demoUrl: demoUrl || null,
      status: isDraft ? SubmissionStatus.DRAFT : (isLate ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED),
      submittedAt: isDraft ? null : new Date(),
    };

    let submission;
    if (existingSubmission) {
      // Update existing draft/returned submission
      submission = await prisma.assignmentSubmission.update({
        where: { id: existingSubmission.id },
        data: {
          ...submissionData,
          status: isDraft ? SubmissionStatus.DRAFT : (existingSubmission.status === SubmissionStatus.RETURNED ? SubmissionStatus.RESUBMITTED : submissionData.status),
        },
      });
    } else {
      // Create new submission
      submission = await prisma.assignmentSubmission.create({
        data: {
          assignment: { connect: { id: assignmentId } },
          studentId: userId,
          studentEmail: email,
          studentName: userName || null,
          attemptNumber,
          ...submissionData,
        },
      });
    }

    return NextResponse.json({
      submission,
      message: isDraft ? "Draft saved" : "Assignment submitted successfully",
    });
  } catch (e) {
    console.error("Failed to submit assignment:", e);
    return NextResponse.json({ error: "Failed to submit assignment" }, { status: 500 });
  }
}

// PATCH - Grade submission (instructor/admin)
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const email = session?.user?.email;
  const userName = session?.user?.name;

  if (!session?.user || (role !== "INSTRUCTOR" && role !== "ADMIN") || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, score, feedback, rubricScores, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
    }

    const submission = await prisma.assignmentSubmission.findUnique({
      where: { id },
      include: { assignment: true },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Verify instructor owns the assignment (or is admin)
    if (role === "INSTRUCTOR" && submission.assignment.instructorEmail !== email) {
      return NextResponse.json({ error: "Not authorized to grade this submission" }, { status: 403 });
    }

    const updateData: any = {};

    if (score !== undefined) {
      updateData.score = score;
      updateData.gradedAt = new Date();
      updateData.gradedByEmail = email;
      updateData.gradedByName = userName;
      updateData.status = "GRADED";
    }

    if (feedback !== undefined) updateData.feedback = feedback;
    if (rubricScores !== undefined) updateData.rubricScores = rubricScores;
    if (status) updateData.status = status;

    const updatedSubmission = await prisma.assignmentSubmission.update({
      where: { id },
      data: updateData,
    });

    // Award XP if graded and passed (score >= 60%)
    if (score !== undefined && score >= (submission.assignment.maxPoints * 0.6)) {
      const student = await prisma.studentProfile.findUnique({
        where: { userId: submission.studentId },
      });

      if (student) {
        await prisma.studentProfile.update({
          where: { id: student.id },
          data: {
            totalXp: { increment: submission.assignment.xpReward },
          },
        });

        // Create achievement record
        await prisma.achievement.create({
          data: {
            userId: submission.studentId,
            title: `Completed: ${submission.assignment.title}`,
            detail: `Scored ${score}/${submission.assignment.maxPoints}`,
            xpAwarded: submission.assignment.xpReward,
            icon: "assignment",
          },
        });
      }
    }

    return NextResponse.json({
      submission: updatedSubmission,
      message: "Submission graded successfully",
    });
  } catch (e) {
    console.error("Failed to grade submission:", e);
    return NextResponse.json({ error: "Failed to grade submission" }, { status: 500 });
  }
}
