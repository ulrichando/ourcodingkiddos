import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session as any)?.user?.role?.toUpperCase();

    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { programId } = await request.json();

    if (!programId) {
      return NextResponse.json(
        { error: "Program ID is required" },
        { status: 400 }
      );
    }

    // Get the program to verify it exists
    const program = await prisma.program.findUnique({
      where: { id: programId },
      select: { id: true, title: true },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Delete all class sessions for this program
    await prisma.classSession.deleteMany({
      where: {
        programId: programId,
        status: { in: ["SCHEDULED", "IN_PROGRESS"] },
      },
    });

    return NextResponse.json({
      success: true,
      programTitle: program.title,
      message: "Instructor unassigned successfully",
    });
  } catch (error) {
    console.error("POST /api/admin/programs/unassign-instructor error:", error);
    return NextResponse.json(
      { error: "Failed to unassign instructor" },
      { status: 500 }
    );
  }
}
