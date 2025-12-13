import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logger } from "../../../../lib/logger";

export const dynamic = 'force-dynamic';

// GET parent profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      include: {
        parentProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      profile: {
        name: user.name,
        email: user.email,
        phone: user.parentProfile?.phone || "",
        address: user.parentProfile?.address || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    logger.db.error("GET /api/parent/profile error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update parent profile
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, address } = body;

    // Update user name
    const user = await prisma.user.update({
      where: { email: session.user.email.toLowerCase() },
      data: {
        name: name || undefined,
      },
    });

    // Upsert parent profile
    const parentProfile = await prisma.parentProfile.upsert({
      where: { userId: user.id },
      update: {
        phone: phone || null,
        address: address || null,
      },
      create: {
        userId: user.id,
        phone: phone || null,
        address: address || null,
      },
    });

    return NextResponse.json({
      success: true,
      profile: {
        name: user.name,
        email: user.email,
        phone: parentProfile.phone,
        address: parentProfile.address,
      },
    });
  } catch (error: any) {
    logger.db.error("PUT /api/parent/profile error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
