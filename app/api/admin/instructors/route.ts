import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role =
    typeof (session?.user as any)?.role === "string"
      ? ((session?.user as any).role as string).toUpperCase()
      : null;

  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all instructors with their sessions
    const instructorUsers = await prisma.user.findMany({
      where: {
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

    // Get sessions for each instructor separately
    const instructors = await Promise.all(
      instructorUsers.map(async (user) => {
        // Get class sessions for this instructor
        const classSessions = await prisma.classSession.findMany({
          where: {
            instructorId: user.id,
          },
          select: {
            id: true,
            durationMinutes: true,
            status: true,
            bookings: {
              select: {
                studentId: true,
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

        // Get availability
        const availability = await prisma.instructorAvailability.findMany({
          where: {
            instructorId: user.id,
            isActive: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        });

        // Calculate session stats
        const totalSessions = classSessions.length;
        const completedSessions = classSessions.filter(
          (s) => s.status === "COMPLETED"
        ).length;

        // Calculate total hours (sum of session durations)
        const totalMinutes = classSessions.reduce(
          (sum, s) => sum + (s.durationMinutes || 60),
          0
        );
        const totalHours = Math.round(totalMinutes / 60);

        // Calculate unique students
        const uniqueStudents = new Set(
          classSessions.flatMap((s) => s.bookings.map((b) => b.studentId))
        );
        const totalStudents = uniqueStudents.size;

        // Count attended bookings as revenue indicator
        const attendedCount = bookings.filter((b) => b.status === "ATTENDED").length;

        // Mock rating data (would need a reviews table)
        const avgRating = 4.5 + Math.random() * 0.5;
        const reviewCount = Math.floor(Math.random() * 20) + 5;

        // Check availability
        const hasAvailability = availability.length > 0;

        // Mock specialties (would need instructor profile table)
        const specialties = ["Python", "JavaScript", "Scratch"].slice(
          0,
          Math.floor(Math.random() * 3) + 1
        );

        return {
          id: user.id,
          userId: user.id,
          name: user.name || "Unknown Instructor",
          email: user.email,
          avatar: user.image,
          joinedAt: user.createdAt.toISOString(),
          stats: {
            totalSessions,
            completedSessions,
            totalStudents,
            totalHours,
            revenue: attendedCount * 50, // Mock revenue based on sessions
            avgRating: Math.round(avgRating * 10) / 10,
            reviewCount,
          },
          specialties,
          availability: {
            available: hasAvailability,
          },
        };
      })
    );

    return NextResponse.json({
      instructors,
      total: instructors.length,
    });
  } catch (error) {
    console.error("[Instructors] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructors", instructors: [] },
      { status: 500 }
    );
  }
}
