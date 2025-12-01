import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        emailUpdates: true,
        classReminders: true,
        progressReports: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ preferences: user });
  } catch (error: any) {
    console.error("GET /api/preferences error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { emailUpdates, classReminders, progressReports } = body;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(typeof emailUpdates === 'boolean' && { emailUpdates }),
        ...(typeof classReminders === 'boolean' && { classReminders }),
        ...(typeof progressReports === 'boolean' && { progressReports }),
      },
      select: {
        emailUpdates: true,
        classReminders: true,
        progressReports: true,
      }
    });

    return NextResponse.json({ preferences: user });
  } catch (error: any) {
    console.error("PATCH /api/preferences error:", error);
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}
