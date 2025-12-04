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
    // Get all instructors
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
        classSessions: {
          select: {
            id: true,
            duration: true,
            status: true,
            bookings: {
              select: {
                studentId: true,
              },
            },
          },
        },
        bookings: {
          where: {
            instructorId: { not: null },
          },
          select: {
            id: true,
            amountPaid: true,
            status: true,
          },
        },
        instructorAvailability: {
          where: {
            isAvailable: true,
            startTime: {
              gte: new Date(),
            },
          },
          orderBy: {
            startTime: "asc",
          },
          take: 1,
        },
      },
    });

    const instructors = instructorUsers.map((user) => {
      // Calculate session stats
      const totalSessions = user.classSessions.length;
      const completedSessions = user.classSessions.filter(
        (s) => s.status === "COMPLETED"
      ).length;

      // Calculate total hours (sum of session durations)
      const totalMinutes = user.classSessions.reduce(
        (sum, s) => sum + (s.duration || 60),
        0
      );
      const totalHours = Math.round(totalMinutes / 60);

      // Calculate unique students
      const uniqueStudents = new Set(
        user.classSessions.flatMap((s) => s.bookings.map((b) => b.studentId))
      );
      const totalStudents = uniqueStudents.size;

      // Calculate revenue from bookings
      const revenue = user.bookings
        .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
        .reduce((sum, b) => sum + (b.amountPaid || 0), 0);

      // Mock rating data (would need a reviews table)
      const avgRating = 4.5 + Math.random() * 0.5;
      const reviewCount = Math.floor(Math.random() * 20) + 5;

      // Check availability
      const hasAvailability = user.instructorAvailability.length > 0;
      const nextSlot = hasAvailability
        ? user.instructorAvailability[0].startTime.toISOString()
        : undefined;

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
          revenue,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount,
        },
        specialties,
        availability: {
          available: hasAvailability,
          nextSlot,
        },
      };
    });

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
