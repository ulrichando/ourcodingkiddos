import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

// POST - Update user's lastSeen timestamp
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { lastSeen: new Date() },
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[activity] Error updating lastSeen:", error);
    return NextResponse.json({ error: "Failed to update activity" }, { status: 500 });
  }
}
