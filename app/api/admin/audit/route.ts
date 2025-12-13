import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { createAuditLog } from "../../../../lib/audit";
import { logger } from "../../../../lib/logger";

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
    logger.db.error("Error fetching audit logs", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs", logs: [], total: 0 },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  const role = typeof (session?.user as any)?.role === "string"
    ? ((session?.user as any).role as string).toUpperCase()
    : null;

  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const olderThan = searchParams.get("olderThan"); // Optional: clear logs older than X days
  const keepRecent = parseInt(searchParams.get("keepRecent") || "0"); // Optional: keep X most recent logs

  try {
    let deletedCount = 0;

    if (olderThan) {
      // Delete logs older than specified days
      const days = parseInt(olderThan);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const result = await prisma.auditLog.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate,
          },
        },
      });
      deletedCount = result.count;
    } else if (keepRecent > 0) {
      // Keep only the most recent X logs
      const logsToKeep = await prisma.auditLog.findMany({
        orderBy: { timestamp: "desc" },
        take: keepRecent,
        select: { id: true },
      });

      const idsToKeep = logsToKeep.map((log) => log.id);

      const result = await prisma.auditLog.deleteMany({
        where: {
          id: {
            notIn: idsToKeep,
          },
        },
      });
      deletedCount = result.count;
    } else {
      // Delete all logs
      const result = await prisma.auditLog.deleteMany({});
      deletedCount = result.count;
    }

    // Log this action (create a new audit log for the deletion)
    await createAuditLog({
      userId: (session.user as any).id,
      userEmail: session.user.email || "unknown",
      action: "DELETE",
      resource: "AuditLog",
      details: `Admin cleared ${deletedCount} audit log entries${olderThan ? ` older than ${olderThan} days` : keepRecent ? `, kept ${keepRecent} recent` : " (all)"}`,
      severity: "WARNING",
      metadata: { deletedCount, olderThan, keepRecent },
    });

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Successfully deleted ${deletedCount} audit log entries`,
    });
  } catch (error) {
    logger.db.error("Error clearing audit logs", error);
    return NextResponse.json(
      { error: "Failed to clear audit logs" },
      { status: 500 }
    );
  }
}
