import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session as any)?.user?.role?.toUpperCase();

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' }
    });

    const stats = {
      total: subscribers.length,
      active: subscribers.filter(s => s.isActive).length,
      unsubscribed: subscribers.filter(s => !s.isActive).length,
    };

    return NextResponse.json({ subscribers, stats });
  } catch (error: any) {
    console.error("GET /api/admin/subscribers error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete a subscriber
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session as any)?.user?.role?.toUpperCase();

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Subscriber ID required" }, { status: 400 });
    }

    await prisma.newsletterSubscriber.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/admin/subscribers error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update subscriber (toggle active status)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session as any)?.user?.role?.toUpperCase();

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { id, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Subscriber ID required" }, { status: 400 });
    }

    const subscriber = await prisma.newsletterSubscriber.update({
      where: { id },
      data: {
        isActive,
        unsubscribedAt: isActive ? null : new Date()
      }
    });

    return NextResponse.json({ success: true, subscriber });
  } catch (error: any) {
    console.error("PATCH /api/admin/subscribers error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
