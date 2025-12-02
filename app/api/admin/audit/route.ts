import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const role = typeof (session?.user as any)?.role === "string"
    ? ((session?.user as any).role as string).toUpperCase()
    : null;

  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    // Get total count
    const total = await prisma.auditLog.count();

    // Get paginated logs
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: limit,
      skip: offset,
    });

    // Transform to match frontend expected format
    const transformedLogs = logs.map((log) => ({
      id: log.id,
      timestamp: log.timestamp.toISOString(),
      userId: log.userId,
      user: log.userEmail,
      action: log.action,
      resource: log.resource,
      resourceId: log.resourceId,
      details: log.details,
      ipAddress: log.ipAddress || "unknown",
      userAgent: log.userAgent,
      status: log.status as "success" | "failed",
      severity: log.severity,
      metadata: log.metadata as Record<string, any> | null,
    }));

    return NextResponse.json({
      logs: transformedLogs,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("[AuditAPI] Error fetching audit logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs", logs: [], total: 0 },
      { status: 500 }
    );
  }
}
