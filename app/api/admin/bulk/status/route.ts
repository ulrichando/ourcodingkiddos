import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import { logUpdate, logDelete } from "../../../../../lib/audit";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role =
    typeof (session?.user as any)?.role === "string"
      ? ((session?.user as any).role as string).toUpperCase()
      : null;

  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userIds, action } = await req.json();

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "Invalid user IDs" }, { status: 400 });
    }

    if (!["promote_instructor", "demote_student", "delete"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const results = {
      updated: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const identifier of userIds) {
      try {
        // Find user by ID or email
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { id: identifier },
              { email: identifier },
            ],
          },
        });

        if (!user) {
          results.failed++;
          results.errors.push(`User not found: ${identifier}`);
          continue;
        }

        // Don't allow modifying yourself
        if (user.id === (session.user as any).id) {
          results.failed++;
          results.errors.push(`Cannot modify yourself: ${user.email}`);
          continue;
        }

        // Don't allow modifying other admins
        if (user.role === "ADMIN") {
          results.failed++;
          results.errors.push(`Cannot modify admin: ${user.email}`);
          continue;
        }

        if (action === "delete") {
          await prisma.user.delete({
            where: { id: user.id },
          });

          await logDelete(
            session.user.email || "unknown",
            "User",
            user.id,
            `Bulk deleted user: ${user.email}`,
            (session.user as any).id,
            { bulkOperation: true }
          );
        } else {
          const newRole = action === "promote_instructor" ? "INSTRUCTOR" : "STUDENT";

          await prisma.user.update({
            where: { id: user.id },
            data: { role: newRole },
          });

          await logUpdate(
            session.user.email || "unknown",
            "User",
            user.id,
            `Bulk updated user role: ${user.email} -> ${newRole}`,
            (session.user as any).id,
            { action, newRole, bulkOperation: true }
          );
        }

        results.updated++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Error updating ${identifier}: ${error.message || "Unknown error"}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("[BulkStatus] Error:", error);
    return NextResponse.json(
      { error: "Failed to process status updates", updated: 0, failed: 0, errors: [] },
      { status: 500 }
    );
  }
}
