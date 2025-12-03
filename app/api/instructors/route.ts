import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

// GET - Fetch all instructors with their availability
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all users with INSTRUCTOR role
    const instructors = await prisma.user.findMany({
      where: {
        role: "INSTRUCTOR",
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    // Fetch availability for all instructors
    const instructorEmails = instructors.map((i) => i.email).filter(Boolean) as string[];

    // Get recurring availability
    const recurringAvailability = await prisma.instructorAvailability.findMany({
      where: {
        instructorEmail: { in: instructorEmails },
        isActive: true,
        isRecurring: true,
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" },
      ],
    });

    // Get specific date availability (only future dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const specificAvailability = await prisma.instructorAvailability.findMany({
      where: {
        instructorEmail: { in: instructorEmails },
        isActive: true,
        isRecurring: false,
        specificDate: {
          gte: today,
        },
      },
      orderBy: [
        { specificDate: "asc" },
        { startTime: "asc" },
      ],
    });

    // Group recurring availability by instructor email
    const recurringMap: Record<string, any[]> = {};
    for (const slot of recurringAvailability) {
      const email = slot.instructorEmail || "";
      if (!recurringMap[email]) {
        recurringMap[email] = [];
      }
      recurringMap[email].push({
        id: slot.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isRecurring: true,
      });
    }

    // Group specific date availability by instructor email
    const specificMap: Record<string, any[]> = {};
    for (const slot of specificAvailability) {
      const email = slot.instructorEmail || "";
      if (!specificMap[email]) {
        specificMap[email] = [];
      }
      specificMap[email].push({
        id: slot.id,
        specificDate: slot.specificDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isRecurring: false,
      });
    }

    // Combine instructors with their availability
    const instructorsWithAvailability = instructors.map((instructor) => ({
      ...instructor,
      availability: recurringMap[instructor.email || ""] || [],
      specificDateAvailability: specificMap[instructor.email || ""] || [],
    }));

    return NextResponse.json({ instructors: instructorsWithAvailability });
  } catch (error) {
    console.error("GET /api/instructors error:", error);
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 });
  }
}
