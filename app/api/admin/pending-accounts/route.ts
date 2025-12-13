import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { logger } from "../../../../lib/logger";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  // Only admins can view pending accounts
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPPORT")) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        accountStatus: "PENDING",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        accountStatus: true,
        image: true,
        resumeUrl: true,
        resumeUploadedAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc", // Oldest first
      },
    });

    return NextResponse.json({ status: "ok", users }, { status: 200 });
  } catch (e: any) {
    logger.db.error("Error fetching pending accounts", e);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch pending accounts" },
      { status: 500 }
    );
  }
}
