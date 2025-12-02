import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import prisma from "../../../lib/prisma";
import { authOptions } from "../../../lib/auth";
import { logCreate } from "../../../lib/audit";

const bookingSchema = z.object({
  instructorId: z.string(),
  courseId: z.string().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  type: z.enum(["ONE_ON_ONE", "GROUP"]),
  notes: z.string().optional(),
});

// GET /api/bookings - list bookings (filter by role/user)
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ status: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const userId = searchParams.get("userId") ?? undefined;

  const role = (session.user as any).role;
  const where: any = {
    status: status ? (status as any) : undefined,
  };

  if (role === "STUDENT") {
    where.studentId = (session.user as any).id;
  } else if (role === "INSTRUCTOR") {
    where.instructorId = (session.user as any).id;
  } else if (userId) {
    // admin override
    where.OR = [{ studentId: userId }, { instructorId: userId }];
  }

  try {
    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { startsAt: "asc" },
      include: {
        course: { select: { id: true, title: true } },
        student: { select: { id: true, name: true, email: true } },
        instructor: { select: { id: true, name: true, email: true } },
      },
    });
    return NextResponse.json({ status: "ok", data: bookings });
  } catch (error) {
    console.error("GET /api/bookings error", error);
    return NextResponse.json({ status: "error", message: "Failed to fetch bookings" }, { status: 500 });
  }
}

// POST /api/bookings - create a booking
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ status: "unauthorized" }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = bookingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ status: "error", errors: parsed.error.flatten() }, { status: 400 });
  }

  // Check subscription status for students and parents (admins and instructors bypass this check)
  const role = (session.user as any).role;
  const userEmail = session.user.email;

  if (role === "STUDENT" || role === "PARENT") {
    // For students, check their parent's subscription via parentEmail in studentProfile
    // For parents, check their own subscription
    let checkEmail = userEmail;

    if (role === "STUDENT") {
      const studentProfile = await prisma.studentProfile.findFirst({
        where: { userId: (session.user as any).id },
        select: { parentEmail: true },
      });
      checkEmail = studentProfile?.parentEmail || userEmail;
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        user: { email: checkEmail },
        status: { in: ["ACTIVE", "TRIALING"] },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { status: "error", message: "Active subscription required. Please start your free trial or upgrade your plan to book classes." },
        { status: 403 }
      );
    }
  }

  const payload = parsed.data;
  try {
    const booking = await prisma.booking.create({
      data: {
        studentId: (session.user as any).id,
        instructorId: payload.instructorId,
        courseId: payload.courseId,
        startsAt: new Date(payload.startsAt),
        endsAt: new Date(payload.endsAt),
        type: payload.type,
        status: "SCHEDULED",
        notes: payload.notes,
      },
    });

    // Log booking creation
    logCreate(
      session.user.email || "unknown",
      "Booking",
      booking.id,
      `Booked ${payload.type} session for ${new Date(payload.startsAt).toLocaleDateString()}`,
      (session.user as any).id,
      { type: payload.type, startsAt: payload.startsAt }
    ).catch(() => {});

    return NextResponse.json({ status: "ok", data: booking }, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error", error);
    return NextResponse.json({ status: "error", message: "Failed to create booking" }, { status: 500 });
  }
}
