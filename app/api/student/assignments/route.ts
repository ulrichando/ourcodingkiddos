import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateLastSeen } from "@/lib/update-last-seen";

// GET - List assignments for the student
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const userEmail = session.user.email.toLowerCase();

  // Update last seen timestamp for student
  await updateLastSeen(userEmail);

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // all, pending, completed

  try {
    // Get all published assignments
    const assignments = await prisma.assignment.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [
        { dueDate: "asc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        title: true,
        description: true,
        instructions: true,
        type: true,
        language: true,
        ageGroup: true,
        dueDate: true,
        maxPoints: true,
        xpReward: true,
        starterCode: true,
        allowLateSubmission: true,
        createdAt: true,
      },
    });

    // Get student's submissions
    const submissions = await prisma.assignmentSubmission.findMany({
      where: {
        studentId: userId,
      },
      select: {
        id: true,
        assignmentId: true,
        status: true,
        score: true,
        feedback: true,
        submittedAt: true,
        gradedAt: true,
        attemptNumber: true,
      },
      orderBy: {
        attemptNumber: "desc",
      },
    });

    // Create a map of submissions by assignment ID
    const submissionMap = new Map();
    submissions.forEach((sub) => {
      // Only keep the latest submission for each assignment
      if (!submissionMap.has(sub.assignmentId)) {
        submissionMap.set(sub.assignmentId, sub);
      }
    });

    // Combine assignments with their submission status
    const assignmentsWithStatus = assignments.map((assignment) => {
      const submission = submissionMap.get(assignment.id);
      const isPastDue = assignment.dueDate ? new Date(assignment.dueDate) < new Date() : false;

      return {
        ...assignment,
        submission: submission || null,
        isPastDue,
        canSubmit: !isPastDue || assignment.allowLateSubmission,
        statusLabel: getStatusLabel(submission, isPastDue),
      };
    });

    // Filter by status if requested
    let filteredAssignments = assignmentsWithStatus;
    if (status === "pending") {
      filteredAssignments = assignmentsWithStatus.filter(
        (a) => !a.submission || !["GRADED", "SUBMITTED", "IN_REVIEW"].includes(a.submission.status)
      );
    } else if (status === "completed") {
      filteredAssignments = assignmentsWithStatus.filter(
        (a) => a.submission && a.submission.status === "GRADED"
      );
    }

    return NextResponse.json({ assignments: filteredAssignments });
  } catch (error) {
    console.error("[student/assignments] Error:", error);
    return NextResponse.json(
      { error: "Failed to load assignments" },
      { status: 500 }
    );
  }
}

function getStatusLabel(submission: any, isPastDue: boolean): string {
  if (!submission) {
    return isPastDue ? "Past Due" : "Not Started";
  }

  switch (submission.status) {
    case "DRAFT":
      return "In Progress";
    case "SUBMITTED":
      return "Submitted";
    case "IN_REVIEW":
      return "Being Reviewed";
    case "GRADED":
      return "Graded";
    case "RETURNED":
      return "Needs Revision";
    case "RESUBMITTED":
      return "Resubmitted";
    case "LATE":
      return "Submitted Late";
    default:
      return "Not Started";
  }
}
