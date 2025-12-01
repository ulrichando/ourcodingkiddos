import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

// This is a placeholder API that returns demo audit logs
// In production, this would query a real audit_logs table in the database

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const role = typeof (session?.user as any)?.role === "string"
    ? ((session?.user as any).role as string).toUpperCase()
    : null;

  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "100");
  const offset = parseInt(searchParams.get("offset") || "0");

  // Generate demo logs with realistic timestamps
  const generateLogs = (count: number) => {
    const actions = ["CREATE", "UPDATE", "DELETE", "VIEW", "LOGIN", "LOGOUT"];
    const resources = ["User", "Course", "Lesson", "Announcement", "Settings", "Class"];
    const users = [
      "admin@ourcodingkiddos.com",
      "instructor@ourcodingkiddos.com",
      "admin2@ourcodingkiddos.com",
    ];
    const statuses: ("success" | "failed")[] = ["success", "success", "success", "success", "failed"];
    const severities: ("INFO" | "WARNING" | "ERROR" | "CRITICAL")[] = ["INFO", "INFO", "INFO", "WARNING", "ERROR", "CRITICAL"];
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Safari/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) Firefox/120.0",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1",
    ];

    return Array.from({ length: count }, (_, i) => {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const resource = resources[Math.floor(Math.random() * resources.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const timestamp = new Date(Date.now() - i * 1000 * 60 * 5);
      const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

      // Determine severity based on action and status
      let severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
      if (status === "failed") {
        severity = action === "DELETE" ? "CRITICAL" : "ERROR";
      } else {
        severity = action === "DELETE" ? "WARNING" : "INFO";
      }

      // Fix details generation - remove the 'D' suffix bug
      const actionVerb =
        action === "DELETE" ? "Deleted" :
        action === "CREATE" ? "Created" :
        action === "UPDATE" ? "Updated" :
        action === "VIEW" ? "Viewed" :
        action === "LOGIN" ? "Logged into" :
        "Logged out of";

      const details = action === "LOGIN" || action === "LOGOUT"
        ? `${actionVerb} the system`
        : `${actionVerb} ${resource.toLowerCase()} record`;

      return {
        id: `log-${Date.now()}-${i}`,
        timestamp: timestamp.toISOString(),
        userId: `user-${i % 3}`,
        user,
        action,
        resource,
        details,
        ipAddress: `192.168.1.${100 + (i % 50)}`,
        userAgent,
        status,
        severity,
        metadata: status === "failed" ? {
          errorCode: `ERR_${Math.floor(Math.random() * 1000) + 4000}`,
          errorMessage: "Operation failed due to insufficient permissions",
        } : null,
      };
    });
  };

  const allLogs = generateLogs(150);
  const paginatedLogs = allLogs.slice(offset, offset + limit);

  return NextResponse.json({
    logs: paginatedLogs,
    total: allLogs.length,
    limit,
    offset,
  });
}
