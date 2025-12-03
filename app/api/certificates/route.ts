import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { v4 as uuidv4 } from "uuid";

// GET - Fetch certificates
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    const email = session?.user?.email;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    let certificates;

    if (role === "ADMIN" || role === "INSTRUCTOR") {
      // Admins and instructors can see all certificates or filter by student
      certificates = await prisma.certificate.findMany({
        where: studentId ? { studentId } : undefined,
        orderBy: { issuedAt: "desc" },
      });
    } else {
      // Parents can only see certificates for their students
      const parentUser = await prisma.user.findUnique({
        where: { email: email || "" },
        include: { parentProfile: true },
      });

      if (!parentUser?.parentProfile) {
        return NextResponse.json({ certificates: [] });
      }

      const studentProfiles = await prisma.studentProfile.findMany({
        where: {
          OR: [
            { guardianId: parentUser.parentProfile.id },
            { parentEmail: email },
          ],
        },
        select: { id: true },
      });

      const studentIds = studentProfiles.map((s) => s.id);

      certificates = await prisma.certificate.findMany({
        where: { studentId: { in: studentIds } },
        orderBy: { issuedAt: "desc" },
      });
    }

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error("GET /api/certificates error:", error);
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}

// POST - Issue a new certificate
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session?.user || (role !== "ADMIN" && role !== "INSTRUCTOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, courseId, achievementType = "course_completion" } = body;

    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: "Student ID and Course ID are required" },
        { status: 400 }
      );
    }

    // Get student and course info
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      select: { id: true, name: true, userId: true },
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if student has an enrollment, create one if not
    let enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: student.userId || studentId,
        courseId: courseId,
      },
    });

    if (!enrollment) {
      // Create an enrollment for the certificate
      enrollment = await prisma.enrollment.create({
        data: {
          studentId: student.userId || studentId,
          courseId: courseId,
          status: "COMPLETED",
        },
      });
    }

    // Generate verification code
    const verificationCode = uuidv4().substring(0, 8).toUpperCase();

    // Create the certificate
    const certificate = await prisma.certificate.create({
      data: {
        enrollmentId: enrollment.id,
        studentId: studentId,
        courseId: courseId,
        studentName: student.name,
        courseTitle: course.title,
        achievementType: achievementType,
        verificationCode: verificationCode,
        url: `/certificates/${verificationCode}`,
      },
    });

    return NextResponse.json({
      success: true,
      certificate,
      message: `Certificate issued to ${student.name} for ${course.title}`,
    });
  } catch (error) {
    console.error("POST /api/certificates error:", error);
    return NextResponse.json({ error: "Failed to issue certificate" }, { status: 500 });
  }
}
