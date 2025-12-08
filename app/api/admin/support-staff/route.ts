import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createAuditLog, getClientIP, getUserAgent } from "@/lib/audit";

export const dynamic = "force-dynamic";

// GET - Fetch all support staff accounts
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supportStaff = await prisma.user.findMany({
      where: { role: "SUPPORT" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ supportStaff });
  } catch (error) {
    console.error("Error fetching support staff:", error);
    return NextResponse.json(
      { error: "Failed to fetch support staff" },
      { status: 500 }
    );
  }
}

// POST - Create a new support staff account
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the support user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "SUPPORT",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Audit log for support staff creation
    await createAuditLog({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "CREATE",
      resource: "SupportStaff",
      resourceId: newUser.id,
      details: `Admin created support staff account for ${name} (${email})`,
      ipAddress: getClientIP(request.headers),
      userAgent: getUserAgent(request.headers),
      severity: "INFO",
      metadata: {
        staffName: name,
        staffEmail: email,
      },
    });

    return NextResponse.json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating support staff:", error);
    return NextResponse.json(
      { error: "Failed to create support staff" },
      { status: 500 }
    );
  }
}

// PUT - Update a support staff account
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, email, password } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify user exists and is support
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser || existingUser.role !== "SUPPORT") {
      return NextResponse.json(
        { error: "Support staff not found" },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email },
      });

      if (emailTaken) {
        return NextResponse.json(
          { error: "A user with this email already exists" },
          { status: 400 }
        );
      }
    }

    // Build update data
    const updateData: { name?: string; email?: string; password?: string } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Audit log for support staff update
    await createAuditLog({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "UPDATE",
      resource: "SupportStaff",
      resourceId: id,
      details: `Admin updated support staff account ${existingUser.email}`,
      ipAddress: getClientIP(request.headers),
      userAgent: getUserAgent(request.headers),
      severity: "INFO",
      metadata: {
        previousName: existingUser.name,
        previousEmail: existingUser.email,
        newName: name || existingUser.name,
        newEmail: email || existingUser.email,
        passwordChanged: !!password,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating support staff:", error);
    return NextResponse.json(
      { error: "Failed to update support staff" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a support staff account
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify user exists and is support
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser || existingUser.role !== "SUPPORT") {
      return NextResponse.json(
        { error: "Support staff not found" },
        { status: 404 }
      );
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    // Audit log for support staff deletion
    await createAuditLog({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "DELETE",
      resource: "SupportStaff",
      resourceId: id,
      details: `Admin deleted support staff account ${existingUser.name} (${existingUser.email})`,
      ipAddress: getClientIP(request.headers),
      userAgent: getUserAgent(request.headers),
      severity: "WARNING",
      metadata: {
        deletedStaffName: existingUser.name,
        deletedStaffEmail: existingUser.email,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Support staff deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting support staff:", error);
    return NextResponse.json(
      { error: "Failed to delete support staff" },
      { status: 500 }
    );
  }
}
