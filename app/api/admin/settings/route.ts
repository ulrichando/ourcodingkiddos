import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get or create settings
    let settings = await prisma.platformSettings.findUnique({
      where: { id: "default" }
    });

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prisma.platformSettings.create({
        data: { id: "default" }
      });
    }

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Remove any fields that shouldn't be updated
    const { id, createdAt, updatedAt, ...updateData } = body;

    // Update settings using upsert to create if not exists
    const settings = await prisma.platformSettings.upsert({
      where: { id: "default" },
      update: updateData,
      create: { id: "default", ...updateData }
    });

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error("PATCH /api/admin/settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
