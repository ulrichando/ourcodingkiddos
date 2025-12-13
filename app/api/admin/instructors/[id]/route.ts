import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import { logger } from "../../../../../lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const role =
    typeof (session?.user as any)?.role === "string"
      ? ((session?.user as any).role as string).toUpperCase()
      : null;

  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Get the instructor user
    const user = await prisma.user.findUnique({
      where: {
        id,
        role: "INSTRUCTOR",
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
    }

    // Get class sessions for this instructor
    const classSessions = await prisma.classSession.findMany({
      where: {
        instructorId: user.id,
      },
      orderBy: {
        startTime: "desc",
      },
      select: {
        id: true,
        durationMinutes: true,
        status: true,
        startTime: true,
        title: true,
        bookings: {
          select: {
            studentId: true,
            student: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Get bookings where this user is instructor
    const bookings = await prisma.booking.findMany({
      where: {
        instructorId: user.id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    // Get availability slots
    const availabilitySlots = await prisma.instructorAvailability.findMany({
      where: {
        instructorId: user.id,
        isActive: true,
      },
      orderBy: {
        dayOfWeek: "asc",
      },
      select: {
        dayOfWeek: true,
        startTime: true,
        endTime: true,
      },
    });

    // Calculate session stats
    const totalSessions = classSessions.length;
    const completedSessions = classSessions.filter(
      (s) => s.status === "COMPLETED"
    ).length;
    const cancelledSessions = classSessions.filter(
      (s) => s.status === "CANCELLED"
    ).length;

    // Calculate total hours
    const totalMinutes = classSessions.reduce(
      (sum, s) => sum + (s.durationMinutes || 60),
      0
    );
    const totalHours = Math.round(totalMinutes / 60);

    // Calculate unique students
    const allStudentIds = classSessions.flatMap((s) =>
      s.bookings.map((b) => b.studentId)
    );
    const uniqueStudents = new Set(allStudentIds);
    const totalStudents = uniqueStudents.size;

    // Count attended bookings as revenue indicator
    const attendedCount = bookings.filter((b) => b.status === "ATTENDED").length;

    // Mock rating data (would need a reviews table)
    const avgRating = 4.5 + Math.random() * 0.5;
    const reviewCount = Math.floor(Math.random() * 20) + 5;

    // Build schedule from availability
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const scheduleMap = new Map<string, string[]>();

    availabilitySlots.forEach((slot) => {
      const dayIndex = slot.dayOfWeek ?? 0;
      const dayName = dayNames[dayIndex] || `Day ${dayIndex}`;
      const timeSlot = `${slot.startTime} - ${slot.endTime}`;
      if (!scheduleMap.has(dayName)) {
        scheduleMap.set(dayName, []);
      }
      scheduleMap.get(dayName)!.push(timeSlot);
    });

    const schedule = Array.from(scheduleMap.entries()).map(([day, slots]) => ({
      day,
      slots,
    }));

    // Build recent sessions list
    const recentSessions = classSessions.slice(0, 10).map((session) => ({
      id: session.id,
      studentName: session.bookings[0]?.student?.name || "No student",
      courseName: session.title || "General Session",
      date: session.startTime.toISOString(),
      duration: session.durationMinutes || 60,
      status: session.status === "COMPLETED"
        ? "completed"
        : session.status === "CANCELLED"
        ? "cancelled"
        : "upcoming",
    }));

    // Get courses - for now return courses based on session titles
    const courseTitleSet = new Set(classSessions.map((s) => s.title).filter(Boolean));
    const uniqueCourseTitles = Array.from(courseTitleSet);
    const courses = uniqueCourseTitles.slice(0, 5).map((title, idx) => ({
      id: `course-${idx}`,
      title,
      studentsEnrolled: Math.floor(Math.random() * 20) + 5,
    }));

    // Mock specialties and certifications
    const allSpecialties = ["Python", "JavaScript", "Scratch", "HTML/CSS", "Game Development", "Robotics"];
    const allCertifications = [
      "Certified Coding Instructor",
      "Youth Programming Specialist",
      "STEM Education Certificate",
      "Child Development Training",
    ];

    const specialties = allSpecialties.slice(0, Math.floor(Math.random() * 4) + 1);
    const certifications = allCertifications.slice(0, Math.floor(Math.random() * 3) + 1);

    // Mock reviews
    const mockReviews = [
      { studentName: "Alex P.", rating: 5, comment: "Amazing teacher! Very patient and explains concepts clearly." },
      { studentName: "Jordan M.", rating: 5, comment: "My kid loves the sessions. Highly recommend!" },
      { studentName: "Sam K.", rating: 4, comment: "Great instructor, makes learning fun." },
    ].slice(0, Math.floor(Math.random() * 3) + 1).map((r, idx) => ({
      id: `review-${idx}`,
      ...r,
      date: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    const instructor = {
      id: user.id,
      userId: user.id,
      name: user.name || "Unknown Instructor",
      email: user.email,
      phone: null,
      avatar: user.image,
      bio: "Passionate coding instructor dedicated to making programming fun and accessible for young learners.",
      location: null,
      website: null,
      joinedAt: user.createdAt.toISOString(),
      stats: {
        totalSessions,
        completedSessions,
        cancelledSessions,
        totalStudents,
        activeStudents: Math.min(totalStudents, 5),
        totalHours,
        revenue: attendedCount * 5000, // Revenue in cents
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount,
      },
      specialties,
      certifications,
      availability: {
        available: availabilitySlots.length > 0,
        schedule,
      },
      recentSessions,
      reviews: mockReviews,
      courses,
    };

    return NextResponse.json({ instructor });
  } catch (error) {
    logger.db.error("Failed to fetch instructor details", error);
    return NextResponse.json(
      { error: "Failed to fetch instructor details" },
      { status: 500 }
    );
  }
}
