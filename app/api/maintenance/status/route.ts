import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// Public endpoint to check maintenance mode status
// Used by middleware to redirect non-admin users
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await prisma.platformSettings.findUnique({
      where: { id: "default" },
      select: { maintenanceMode: true }
    });

    return NextResponse.json({
      maintenanceMode: settings?.maintenanceMode ?? false
    }, {
      headers: {
        // Cache for 10 seconds to reduce DB hits while staying responsive
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5'
      }
    });
  } catch (error) {
    console.error("Maintenance status check error:", error);
    // Default to not in maintenance mode on error
    return NextResponse.json({ maintenanceMode: false });
  }
}
