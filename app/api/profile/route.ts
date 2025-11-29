import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "lib/auth";
import prisma from "lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { name, email } = body ?? {};

  try {
    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(name ? { name } : {}),
        ...(email ? { email: String(email).toLowerCase() } : {}),
      },
      select: { id: true, name: true, email: true },
    });
    return NextResponse.json({ user: updated });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
