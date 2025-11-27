import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import prisma from "../../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = body?.name?.trim();
  const email = body?.email?.toLowerCase().trim();
  const password = body?.password;
  const roleInput = String(body?.role || "").toUpperCase() as Role | string;
  const allowedRoles: Role[] = ["PARENT", "INSTRUCTOR"];
  const role: Role = allowedRoles.includes(roleInput as Role) ? (roleInput as Role) : "PARENT";

  if (!name || !email || !password || password.length < 6) {
    return NextResponse.json({ status: "error", message: "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ status: "error", message: "Email already registered" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      role,
      ...(role === "PARENT"
        ? {
            parentProfile: {
              create: {
                phone: null,
              },
            },
          }
        : {}),
    },
  });

  return NextResponse.json({ status: "ok", user: { id: user.id, email: user.email } }, { status: 201 });
}
