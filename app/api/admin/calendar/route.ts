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

    for (const sess of sessions) {
      events.push({
        id: sess.id,
        title: sess.title,
        type: "session",
        start: sess.startTime.toISOString(),
        end: new Date(
          sess.startTime.getTime() + (sess.durationMinutes || 60) * 60 * 1000
        ).toISOString(),
        instructor: sess.instructor?.name,
        instructorId: sess.instructor?.id,
        studentCount: sess.bookings.length,
        status: sess.status,
        color: "blue",
      });
    }

    // Get instructor availability (for specific dates)
    const availability = await prisma.instructorAvailability.findMany({
      where: {
        isActive: true,
        specificDate: {
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
      },
    });

    for (const slot of availability) {
      if (slot.specificDate) {
        events.push({
          id: `avail-${slot.id}`,
          title: `${slot.instructor?.name || slot.instructorEmail || "Instructor"} Available`,
          type: "availability",
          start: slot.specificDate.toISOString(),
          end: slot.specificDate.toISOString(),
          instructor: slot.instructor?.name,
          instructorId: slot.instructor?.id,
          details: `${slot.startTime} - ${slot.endTime}`,
          color: "green",
        });
      }
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
    });

    for (const req of requests) {
      // Use creation date as placeholder since requests don't have scheduled times yet
      const requestDate = req.createdAt;
      events.push({
        id: `req-${req.id}`,
        title: `Request: ${req.requestedTopic}`,
        type: "request",
        start: requestDate.toISOString(),
        end: new Date(requestDate.getTime() + 60 * 60 * 1000).toISOString(),
        instructor: null,
        status: req.status,
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
