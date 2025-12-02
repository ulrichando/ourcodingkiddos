import { NextResponse, type NextRequest } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { logUpdate, logDelete } from "../../../../lib/audit";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session as any)?.user?.role;
    if (role && !["PARENT", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const resolvedParams = await params;
    const studentId = resolvedParams.id;
    const body = await request.json();
    const action = body.action; // "archive" or "restore"

    // Verify ownership (except for admins)
    if (role !== "ADMIN") {
      const student = await prisma.studentProfile.findUnique({
        where: { id: studentId },
        select: { parentEmail: true },
      });

      if (!student || student.parentEmail?.toLowerCase() !== session.user.email.toLowerCase()) {
        return NextResponse.json({ error: "Not authorized for this student" }, { status: 403 });
      }
    }

    // Get student info for logging
    const studentInfo = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      select: { name: true },
    });

    // Perform the action
    if (action === "archive") {
      await prisma.studentProfile.update({
        where: { id: studentId },
        data: { archivedAt: new Date() },
      });
      logUpdate(session.user.email, "Student", studentId, `Archived student: ${studentInfo?.name || studentId}`).catch(() => {});
      return NextResponse.json({ status: "ok", message: "Student archived" });
    } else if (action === "restore") {
      await prisma.studentProfile.update({
        where: { id: studentId },
        data: { archivedAt: null },
      });
      logUpdate(session.user.email, "Student", studentId, `Restored student: ${studentInfo?.name || studentId}`).catch(() => {});
      return NextResponse.json({ status: "ok", message: "Student restored" });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("[students/[id]] PATCH error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update student" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session as any)?.user?.role;
    if (role && !["PARENT", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const resolvedParams = await params;
    const studentId = resolvedParams.id;

    // Get student info for logging before deletion
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      select: { parentEmail: true, userId: true, name: true },
    });

    // Verify ownership (except for admins)
    if (role !== "ADMIN") {
      if (!student || student.parentEmail?.toLowerCase() !== session.user.email.toLowerCase()) {
        return NextResponse.json({ error: "Not authorized for this student" }, { status: 403 });
      }
    }

    // Delete the student profile and associated user account
    await prisma.studentProfile.delete({
      where: { id: studentId },
    });

    if (student?.userId) {
      await prisma.user.delete({
        where: { id: student.userId },
      });
    }

    // Log student deletion
    logDelete(session.user.email, "Student", studentId, `Deleted student: ${student?.name || studentId}`).catch(() => {});

    return NextResponse.json({ status: "ok", message: "Student deleted permanently" });
  } catch (error: any) {
    console.error("[students/[id]] DELETE error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete student" },
      { status: 500 }
    );
  }
}
