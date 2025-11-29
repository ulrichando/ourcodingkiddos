import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

function generateMeetLink() {
  const rand = Math.random().toString(36).slice(2, 12);
  return `https://meet.google.com/${rand}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const email = session?.user?.email;

  if (!session?.user || (role !== "INSTRUCTOR" && role !== "ADMIN") || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    description,
    sessionType,
    language,
    ageGroup,
    startTime,
    durationMinutes,
    maxStudents,
    meetingUrl,
  } = body ?? {};

  if (!title || !sessionType || !startTime || !durationMinutes) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const link = meetingUrl && meetingUrl.trim().length > 0 ? meetingUrl.trim() : generateMeetLink();

  try {
    const created = await prisma.classSession.create({
      data: {
        instructorEmail: email,
        title,
        description,
        sessionType,
        language,
        ageGroup,
        startTime: new Date(startTime),
        durationMinutes: Number(durationMinutes),
        maxStudents: maxStudents ? Number(maxStudents) : null,
        meetingUrl: link,
        status: "SCHEDULED",
      },
      select: {
        id: true,
        title: true,
        sessionType: true,
        startTime: true,
        meetingUrl: true,
      },
    });
    return NextResponse.json({ session: created });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const email = session?.user?.email;

  if (!session?.user || !email || (role !== "INSTRUCTOR" && role !== "ADMIN")) {
    // Allow read access for students/parents to see list of classes
    const sessions = await prisma.classSession.findMany({
      where: { status: "SCHEDULED", startTime: { gt: new Date() } },
      orderBy: { startTime: "asc" },
      select: {
        id: true,
        title: true,
        sessionType: true,
        startTime: true,
        durationMinutes: true,
        maxStudents: true,
        enrolledCount: true,
        meetingUrl: true,
      },
    });
    return NextResponse.json({ sessions });
  }

  // Instructors should see all scheduled classes (including those created by others) so they can manage or join.
  const includeFrom = new Date(Date.now() - 60 * 60 * 1000);
  const sessions = await prisma.classSession.findMany({
    where: { status: "SCHEDULED", startTime: { gte: includeFrom } },
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      title: true,
      sessionType: true,
      startTime: true,
      durationMinutes: true,
      maxStudents: true,
      enrolledCount: true,
      meetingUrl: true,
      instructorEmail: true,
    },
  });

  return NextResponse.json({ sessions });
}
