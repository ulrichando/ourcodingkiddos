import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

// Audit logging is not yet implemented in the database
// This returns an empty state until AuditLog model is added to schema

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

  // Return empty state - audit logging not yet implemented
  return NextResponse.json({
    logs: [],
    total: 0,
    limit,
    offset,
    message: "Audit logging coming soon",
  });
}
