import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logger } from "../../../../lib/logger";

// In-memory storage for goals (in production, add a Goal model to Prisma schema)
// This is a temporary solution - goals will reset on server restart
// Exported so admin can access it
export const goalsStore: Map<string, any[]> = new Map();

// GET - Fetch all goals for the parent's students
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        parentProfile: {
          include: {
            children: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get goals from in-memory store
    const parentGoals = goalsStore.get(user.id) || [];

    return NextResponse.json({ goals: parentGoals });
  } catch (error) {
    logger.db.error("Error fetching goals", error);
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

// POST - Create a new goal
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, description, targetXp } = body;

    if (!studentId || !description || !targetXp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        parentProfile: {
          include: {
            children: {
              where: { id: studentId },
            },
          },
        },
      },
    });

    if (!user || !user.parentProfile || user.parentProfile.children.length === 0) {
      return NextResponse.json({ error: "Student not found or not authorized" }, { status: 403 });
    }

    const student = user.parentProfile.children[0];

    // Create goal in memory store
    const goal = {
      id: `goal_${Date.now()}`,
      studentId,
      description,
      targetXp,
      currentXp: student.totalXp || 0,
      createdAt: new Date().toISOString(),
      completed: false,
    };

    const existingGoals = goalsStore.get(user.id) || [];
    goalsStore.set(user.id, [...existingGoals, goal]);

    return NextResponse.json({ goal });
  } catch (error) {
    logger.db.error("Error creating goal", error);
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}

// DELETE - Remove a goal
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const goalId = searchParams.get("id");

    if (!goalId) {
      return NextResponse.json({ error: "Goal ID required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingGoals = goalsStore.get(user.id) || [];
    const filteredGoals = existingGoals.filter((g) => g.id !== goalId);
    goalsStore.set(user.id, filteredGoals);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.db.error("Error deleting goal", error);
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}
