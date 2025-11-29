import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "lib/auth";
import prisma from "lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { name, email, role, password } = body ?? {};

  try {
    const data: any = {};
    if (name) data.name = name;
    if (email) data.email = String(email).toLowerCase();
    if (role) data.role = String(role).toUpperCase();
    if (password) data.hashedPassword = await bcrypt.hash(password, 10);

    const updated = await prisma.user.update({
      where: { id: params.id },
      data,
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json({ user: updated });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ status: "ok" });
  } catch (e: any) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
