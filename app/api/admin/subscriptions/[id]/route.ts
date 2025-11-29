import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "lib/auth";
import prisma from "lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { planType, status } = body ?? {};

  try {
    const sub = await prisma.subscription.update({
      where: { id },
      data: {
        ...(planType ? { planType } : {}),
        ...(status ? { status } : {}),
      },
      select: {
        id: true,
        planType: true,
        status: true,
        priceCents: true,
        endDate: true,
        currentPeriodEnd: true,
        user: { select: { email: true } },
        parentEmail: true,
      },
    });
    return NextResponse.json({ subscription: sub });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sub = await prisma.subscription.update({
      where: { id },
      data: { status: "CANCELED" },
      select: { id: true, status: true },
    });
    return NextResponse.json({ subscription: sub });
  } catch (e) {
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
