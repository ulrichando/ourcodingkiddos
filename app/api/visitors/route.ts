import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// In-memory store for active visitors (for simplicity)
// In production, use Redis or database for persistence across instances
const activeVisitors = new Map<string, {
  id: string;
  page: string;
  userAgent: string;
  lastSeen: Date;
  sessionStart: Date;
  country?: string;
  city?: string;
  isAuthenticated: boolean;
  userName?: string;
  userEmail?: string;
}>();

// Clean up old visitors (older than 5 minutes)
function cleanupOldVisitors() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  activeVisitors.forEach((visitor, id) => {
    if (visitor.lastSeen < fiveMinutesAgo) {
      activeVisitors.delete(id);
    }
  });
}

// GET - Get active visitors (admin and support)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    if (!session?.user?.email || (role !== "ADMIN" && role !== "SUPPORT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    cleanupOldVisitors();

    const visitors = Array.from(activeVisitors.values())
      .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());

    return NextResponse.json({
      count: visitors.length,
      visitors,
    });
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitors" },
      { status: 500 }
    );
  }
}

// POST - Register/update visitor heartbeat
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { visitorId, page } = body;

    if (!visitorId) {
      return NextResponse.json(
        { error: "Visitor ID is required" },
        { status: 400 }
      );
    }

    // Get session if available
    const session = await getServerSession(authOptions);

    // Get user agent from headers
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Update or create visitor
    const existingVisitor = activeVisitors.get(visitorId);

    activeVisitors.set(visitorId, {
      id: visitorId,
      page: page || "/",
      userAgent,
      lastSeen: new Date(),
      sessionStart: existingVisitor?.sessionStart || new Date(),
      isAuthenticated: !!session?.user?.email,
      userName: session?.user?.name || undefined,
      userEmail: session?.user?.email || undefined,
    });

    cleanupOldVisitors();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating visitor:", error);
    return NextResponse.json(
      { error: "Failed to update visitor" },
      { status: 500 }
    );
  }
}

// DELETE - Remove visitor (when they leave)
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { visitorId } = body;

    if (visitorId) {
      activeVisitors.delete(visitorId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing visitor:", error);
    return NextResponse.json(
      { error: "Failed to remove visitor" },
      { status: 500 }
    );
  }
}
