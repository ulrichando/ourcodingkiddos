import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

// GET - Fetch instructor's availability
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    const email = session?.user?.email;

    // Check for query param to get specific instructor's availability (for parents)
    const { searchParams } = new URL(req.url);
    const instructorEmail = searchParams.get("instructor");
    const month = searchParams.get("month"); // Format: YYYY-MM
    const includeRecurring = searchParams.get("recurring") !== "false";

    if (instructorEmail) {
      // Public view - anyone can see instructor availability
      const whereClause: any = {
        instructorEmail: instructorEmail,
        isActive: true,
      };

      // Filter by month if specified
      if (month) {
        const [year, monthNum] = month.split("-").map(Number);
        const startOfMonth = new Date(year, monthNum - 1, 1);
        const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);

        whereClause.OR = [
          // Recurring slots (always show)
          ...(includeRecurring ? [{ isRecurring: true }] : []),
          // Specific date slots within the month
          {
            isRecurring: false,
            specificDate: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        ];
      }

      const availability = await prisma.instructorAvailability.findMany({
        where: whereClause,
        orderBy: [
          { isRecurring: "desc" },
          { specificDate: "asc" },
          { dayOfWeek: "asc" },
          { startTime: "asc" },
        ],
      });

      return NextResponse.json({ availability });
    }

    // Private view - instructor viewing their own availability
    if (!session?.user || (role !== "INSTRUCTOR" && role !== "ADMIN") || !email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const availability = await prisma.instructorAvailability.findMany({
      where: {
        instructorEmail: email,
      },
      orderBy: [
        { isRecurring: "desc" },
        { specificDate: "asc" },
        { dayOfWeek: "asc" },
        { startTime: "asc" },
      ],
    });

    return NextResponse.json({ availability });
  } catch (error) {
    console.error("GET /api/instructor/availability error:", error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}

// POST - Add new availability slot
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    const email = session?.user?.email;
    const userId = (session?.user as any)?.id;

    if (!session?.user || (role !== "INSTRUCTOR" && role !== "ADMIN") || !email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { dayOfWeek, specificDate, isRecurring = true, startTime, endTime } = body;

    // Validate required fields
    if (!startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields: startTime, endTime" },
        { status: 400 }
      );
    }

    // For recurring, need dayOfWeek; for specific date, need specificDate
    if (isRecurring && (dayOfWeek === undefined || dayOfWeek === null)) {
      return NextResponse.json(
        { error: "dayOfWeek is required for recurring availability" },
        { status: 400 }
      );
    }

    if (!isRecurring && !specificDate) {
      return NextResponse.json(
        { error: "specificDate is required for date-specific availability" },
        { status: 400 }
      );
    }

    // Validate day of week (0-6) if recurring
    if (isRecurring && (dayOfWeek < 0 || dayOfWeek > 6)) {
      return NextResponse.json(
        { error: "dayOfWeek must be between 0 (Sunday) and 6 (Saturday)" },
        { status: 400 }
      );
    }

    // Check for overlapping availability
    if (isRecurring) {
      const existing = await prisma.instructorAvailability.findMany({
        where: {
          instructorEmail: email,
          dayOfWeek: dayOfWeek,
          isRecurring: true,
          isActive: true,
        },
      });

      for (const slot of existing) {
        if (
          (startTime >= slot.startTime && startTime < slot.endTime) ||
          (endTime > slot.startTime && endTime <= slot.endTime) ||
          (startTime <= slot.startTime && endTime >= slot.endTime)
        ) {
          return NextResponse.json(
            { error: "This time slot overlaps with an existing availability" },
            { status: 400 }
          );
        }
      }
    } else {
      // Check for overlapping on specific date
      const dateToCheck = new Date(specificDate);
      const startOfDay = new Date(dateToCheck);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateToCheck);
      endOfDay.setHours(23, 59, 59, 999);

      const existing = await prisma.instructorAvailability.findMany({
        where: {
          instructorEmail: email,
          isRecurring: false,
          specificDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
          isActive: true,
        },
      });

      for (const slot of existing) {
        if (
          (startTime >= slot.startTime && startTime < slot.endTime) ||
          (endTime > slot.startTime && endTime <= slot.endTime) ||
          (startTime <= slot.startTime && endTime >= slot.endTime)
        ) {
          return NextResponse.json(
            { error: "This time slot overlaps with an existing availability on this date" },
            { status: 400 }
          );
        }
      }
    }

    const availability = await prisma.instructorAvailability.create({
      data: {
        instructorId: userId,
        instructorEmail: email,
        dayOfWeek: isRecurring ? dayOfWeek : null,
        specificDate: isRecurring ? null : new Date(specificDate),
        isRecurring,
        startTime,
        endTime,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, availability });
  } catch (error) {
    console.error("POST /api/instructor/availability error:", error);
    return NextResponse.json({ error: "Failed to create availability" }, { status: 500 });
  }
}

// PATCH - Update availability slot
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    const email = session?.user?.email;

    if (!session?.user || (role !== "INSTRUCTOR" && role !== "ADMIN") || !email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, isActive, startTime, endTime } = body;

    if (!id) {
      return NextResponse.json({ error: "Availability ID is required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.instructorAvailability.findFirst({
      where: {
        id,
        instructorEmail: email,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Availability not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (startTime) updateData.startTime = startTime;
    if (endTime) updateData.endTime = endTime;

    const updated = await prisma.instructorAvailability.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, availability: updated });
  } catch (error) {
    console.error("PATCH /api/instructor/availability error:", error);
    return NextResponse.json({ error: "Failed to update availability" }, { status: 500 });
  }
}

// DELETE - Remove availability slot
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    const email = session?.user?.email;

    if (!session?.user || (role !== "INSTRUCTOR" && role !== "ADMIN") || !email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Availability ID is required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.instructorAvailability.findFirst({
      where: {
        id,
        instructorEmail: email,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Availability not found" }, { status: 404 });
    }

    await prisma.instructorAvailability.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Availability deleted" });
  } catch (error) {
    console.error("DELETE /api/instructor/availability error:", error);
    return NextResponse.json({ error: "Failed to delete availability" }, { status: 500 });
  }
}
