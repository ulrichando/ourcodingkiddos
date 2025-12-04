import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const role =
    typeof (session?.user as any)?.role === "string"
      ? ((session?.user as any).role as string).toUpperCase()
      : null;

  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  const start = startDate ? new Date(startDate) : new Date();
  const end = endDate
    ? new Date(endDate)
    : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

  try {
    const events: any[] = [];

    // Get class sessions
    const sessions = await prisma.classSession.findMany({
      where: {
        startTime: {
          gte: start,
          lte: end,
        },
      },
      include: {
        instructor: {
          select: {
            name: true,
            id: true,
          },
        },
        bookings: {
          select: {
            id: true,
          },
        },
      },
    });

    for (const session of sessions) {
      events.push({
        id: session.id,
        title: session.title,
        type: "session",
        start: session.startTime.toISOString(),
        end: new Date(
          session.startTime.getTime() + (session.duration || 60) * 60 * 1000
        ).toISOString(),
        instructor: session.instructor?.name,
        instructorId: session.instructor?.id,
        studentCount: session.bookings.length,
        status: session.status,
        color: "blue",
      });
    }

    // Get instructor availability
    const availability = await prisma.instructorAvailability.findMany({
      where: {
        startTime: {
          gte: start,
          lte: end,
        },
        isAvailable: true,
      },
      include: {
        instructor: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    for (const slot of availability) {
      events.push({
        id: `avail-${slot.id}`,
        title: `${slot.instructor?.name || "Instructor"} Available`,
        type: "availability",
        start: slot.startTime.toISOString(),
        end: slot.endTime.toISOString(),
        instructor: slot.instructor?.name,
        instructorId: slot.instructor?.id,
        color: "green",
      });
    }

    // Get pending class requests
    const requests = await prisma.classRequest.findMany({
      where: {
        status: "PENDING",
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        parent: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    for (const request of requests) {
      // Use creation date as placeholder since requests don't have scheduled times yet
      const requestDate = request.createdAt;
      events.push({
        id: `req-${request.id}`,
        title: `Request: ${request.topic}`,
        type: "request",
        start: requestDate.toISOString(),
        end: new Date(requestDate.getTime() + 60 * 60 * 1000).toISOString(),
        instructor: null,
        status: request.status,
        color: "amber",
      });
    }

    // Sort events by start time
    events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    return NextResponse.json({
      events,
      total: events.length,
    });
  } catch (error) {
    console.error("[Calendar] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar events", events: [] },
      { status: 500 }
    );
  }
}
