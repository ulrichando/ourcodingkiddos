import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/auth";
import { logUpdate, logDelete } from "../../../../lib/audit";
import { logger } from "../../../../lib/logger";

const updateSchema = z
  .object({
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional(),
    notes: z.string().optional(),
  })
  .strict();

// PATCH /api/bookings/:id - update status (e.g., cancel/reschedule)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ status: "unauthorized" }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ status: "error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  try {
    // Ensure the booking belongs to the user (student/instructor) unless admin
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ status: "not-found" }, { status: 404 });
    if (
      role !== "ADMIN" &&
      existing.studentId !== userId &&
      existing.instructorId !== userId
    ) {
      return NextResponse.json({ status: "forbidden" }, { status: 403 });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...parsed.data,
        startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : undefined,
        endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : undefined,
      },
    });

    // Log booking update
    const statusText = parsed.data.status === "CANCELLED" ? "Cancelled" : "Updated";
    logUpdate(
      session.user.email || "unknown",
      "Booking",
      id,
      `${statusText} booking`,
      userId,
      { changes: Object.keys(parsed.data) }
    ).catch(() => {});

    return NextResponse.json({ status: "ok", data: booking });
  } catch (error) {
    logger.db.error("PATCH /api/bookings/:id error", error);
    return NextResponse.json({ status: "error", message: "Failed to update booking" }, { status: 500 });
  }
}

// DELETE /api/bookings/:id - hard cancel
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ status: "unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  const { id } = await params;
  try {
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ status: "not-found" }, { status: 404 });
    if (role !== "ADMIN" && existing.studentId !== userId && existing.instructorId !== userId) {
      return NextResponse.json({ status: "forbidden" }, { status: 403 });
    }
    await prisma.booking.delete({ where: { id } });

    // Log booking deletion
    logDelete(session.user.email || "unknown", "Booking", id, "Deleted booking", userId).catch(() => {});

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    logger.db.error("DELETE /api/bookings/:id error", error);
    return NextResponse.json({ status: "error", message: "Failed to delete booking" }, { status: 500 });
  }
}
