import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "lib/auth";
import prisma from "lib/prisma";
import bcrypt from "bcryptjs";
import { logCreate } from "lib/audit";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      parentProfile: {
        select: {
          phone: true,
          address: true,
        },
      },
    },
  });

  // Flatten the response to include phone and address at the user level
  const formattedUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image,
    phone: user.parentProfile?.phone || null,
    address: user.parentProfile?.address || null,
    createdAt: user.createdAt,
  }));

  return NextResponse.json({ users: formattedUsers });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, role = "PARENT", password, phone, address } = body ?? {};

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with optional parent profile if phone/address provided
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        role,
        hashedPassword,
        // Create parent profile if phone or address is provided, or if role is PARENT
        ...(role === "PARENT" || phone || address
          ? {
              parentProfile: {
                create: {
                  phone: phone || null,
                  address: address || null,
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        parentProfile: {
          select: {
            phone: true,
            address: true,
          },
        },
      },
    });

    // Log admin user creation
    logCreate(
      session.user.email || "unknown",
      "User",
      user.id,
      `Admin created user: ${user.email} (${role})`,
      (session as any).user.id,
      { role, email: user.email }
    ).catch(() => {});

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        phone: user.parentProfile?.phone || null,
        address: user.parentProfile?.address || null,
        createdAt: user.createdAt,
      },
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    console.error("[admin/users/create] Error:", e);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
