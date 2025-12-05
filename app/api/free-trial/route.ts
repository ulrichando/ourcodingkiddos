import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const freeTrialSchema = z.object({
  parentEmail: z.string().email(),
  parentName: z.string().min(2).optional(),
  childName: z.string().min(2),
  childAge: z.number().int().min(5).max(18).optional(),
  ageGroup: z.enum(["AGES_5_7", "AGES_8_10", "AGES_11_13", "AGES_14_17"]).optional(),
  phone: z.string().optional(),
  programId: z.string().optional(),
  language: z.enum(["PYTHON", "JAVASCRIPT", "SCRATCH", "ROBLOX", "HTML_CSS", "JAVA", "CSHARP", "SWIFT"]).optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  timezone: z.string().optional(),
});

// POST /api/free-trial - Book a free trial class
export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = freeTrialSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = parsed.data;

    // Check if this parent+child combination already has a trial
    const existingTrial = await prisma.freeTrialBooking.findUnique({
      where: {
        parentEmail_childName: {
          parentEmail: payload.parentEmail,
          childName: payload.childName,
        },
      },
    });

    if (existingTrial) {
      // Check if they can book another trial (if previous was expired/declined)
      if (!["EXPIRED", "DECLINED"].includes(existingTrial.status)) {
        return NextResponse.json(
          {
            status: "error",
            message: "A free trial has already been booked for this child. Each child is eligible for one free trial class.",
            existingBooking: {
              status: existingTrial.status,
              scheduledAt: existingTrial.scheduledAt,
            },
          },
          { status: 409 }
        );
      }
    }

    // Get program details if programId provided
    let programDetails = null;
    if (payload.programId) {
      programDetails = await prisma.program.findUnique({
        where: { id: payload.programId },
        select: {
          id: true,
          title: true,
          language: true,
          ageGroup: true,
          sessionCount: true,
          priceCents: true,
        },
      });
    }

    // Create or update the free trial booking
    const freeTrialBooking = existingTrial
      ? await prisma.freeTrialBooking.update({
          where: { id: existingTrial.id },
          data: {
            parentName: payload.parentName,
            childAge: payload.childAge,
            ageGroup: payload.ageGroup as any,
            phone: payload.phone,
            programId: payload.programId,
            language: payload.language as any,
            preferredDate: payload.preferredDate ? new Date(payload.preferredDate) : null,
            preferredTime: payload.preferredTime,
            timezone: payload.timezone || "America/New_York",
            status: "PENDING",
          },
        })
      : await prisma.freeTrialBooking.create({
          data: {
            parentEmail: payload.parentEmail,
            parentName: payload.parentName,
            childName: payload.childName,
            childAge: payload.childAge,
            ageGroup: payload.ageGroup as any,
            phone: payload.phone,
            programId: payload.programId,
            language: payload.language as any,
            preferredDate: payload.preferredDate ? new Date(payload.preferredDate) : null,
            preferredTime: payload.preferredTime,
            timezone: payload.timezone || "America/New_York",
            status: "PENDING",
          },
        });

    return NextResponse.json(
      {
        status: "ok",
        message: "Free trial booked successfully! We'll contact you soon to confirm your session.",
        data: {
          id: freeTrialBooking.id,
          childName: freeTrialBooking.childName,
          status: freeTrialBooking.status,
          program: programDetails,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/free-trial error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to book free trial" },
      { status: 500 }
    );
  }
}

// GET /api/free-trial - Check free trial status by email
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const childName = searchParams.get("childName");

  if (!email) {
    return NextResponse.json(
      { status: "error", message: "Email is required" },
      { status: 400 }
    );
  }

  try {
    const where: any = { parentEmail: email };
    if (childName) {
      where.childName = childName;
    }

    const trials = await prisma.freeTrialBooking.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Get program details for each trial
    const trialsWithPrograms = await Promise.all(
      trials.map(async (trial) => {
        let program = null;
        if (trial.programId) {
          program = await prisma.program.findUnique({
            where: { id: trial.programId },
            select: {
              id: true,
              title: true,
              language: true,
              thumbnailUrl: true,
              priceCents: true,
              sessionCount: true,
            },
          });
        }
        return { ...trial, program };
      })
    );

    return NextResponse.json({
      status: "ok",
      data: trialsWithPrograms,
      canBookNew: trials.every((t) =>
        ["EXPIRED", "DECLINED", "CONVERTED"].includes(t.status)
      ),
    });
  } catch (error) {
    console.error("GET /api/free-trial error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch trial status" },
      { status: 500 }
    );
  }
}
