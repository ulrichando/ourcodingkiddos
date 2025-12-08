import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/emails - List all received emails
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or support
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !["ADMIN", "SUPPORT"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (category && category !== "all") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { from: { contains: search, mode: "insensitive" } },
        { fromName: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { snippet: { contains: search, mode: "insensitive" } },
      ];
    }

    const [emails, total] = await Promise.all([
      prisma.receivedEmail.findMany({
        where,
        orderBy: { receivedAt: "desc" },
        skip,
        take: limit,
        include: {
          replies: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
      prisma.receivedEmail.count({ where }),
    ]);

    // Get counts by status
    const statusCounts = await prisma.receivedEmail.groupBy({
      by: ["status"],
      _count: true,
    });

    return NextResponse.json({
      emails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      statusCounts: statusCounts.reduce(
        (acc, item) => ({
          ...acc,
          [item.status]: item._count,
        }),
        {}
      ),
    });
  } catch (error) {
    console.error("[Admin Emails] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}
