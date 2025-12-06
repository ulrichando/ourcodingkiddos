import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// Public endpoint to check maintenance mode status
// Used by middleware to redirect non-admin users and by maintenance page for display
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await prisma.platformSettings.findUnique({
      where: { id: "default" },
      select: {
        maintenanceMode: true,
        maintenanceMessage: true,
        maintenanceEndTime: true,
        siteName: true,
      }
    });

    return NextResponse.json({
      maintenanceMode: settings?.maintenanceMode ?? false,
      maintenanceMessage: settings?.maintenanceMessage ?? null,
      maintenanceEndTime: settings?.maintenanceEndTime?.toISOString() ?? null,
      siteName: settings?.siteName ?? "Our Coding Kiddos",
    }, {
      headers: {
        // Cache for 10 seconds to reduce DB hits while staying responsive
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5'
      }
    });
  } catch (error) {
    console.error("Maintenance status check error:", error);
    // Default to not in maintenance mode on error
    return NextResponse.json({
      maintenanceMode: false,
      maintenanceMessage: null,
      maintenanceEndTime: null,
      siteName: "Our Coding Kiddos",
    });
  }
}
