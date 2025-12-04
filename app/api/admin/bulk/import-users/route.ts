import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { logCreate } from "../../../../../lib/audit";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role =
    typeof (session?.user as any)?.role === "string"
      ? ((session?.user as any).role as string).toUpperCase()
      : null;

  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { csvData } = await req.json();

    if (!csvData || typeof csvData !== "string") {
      return NextResponse.json({ error: "Invalid CSV data" }, { status: 400 });
    }

    const lines = csvData.split("\n").filter((l) => l.trim());
    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV must have header and at least one data row" }, { status: 400 });
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const emailIndex = headers.indexOf("email");
    const passwordIndex = headers.indexOf("password");
    const nameIndex = headers.indexOf("name");
    const roleIndex = headers.indexOf("role");
    const phoneIndex = headers.indexOf("phone");

    if (emailIndex === -1 || passwordIndex === -1) {
      return NextResponse.json({ error: "CSV must have 'email' and 'password' columns" }, { status: 400 });
    }

    const results = {
      imported: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const email = values[emailIndex];
      const password = values[passwordIndex];
      const name = nameIndex !== -1 ? values[nameIndex] : undefined;
      const userRole = roleIndex !== -1 ? values[roleIndex]?.toUpperCase() : "STUDENT";
      const phone = phoneIndex !== -1 ? values[phoneIndex] : undefined;

      if (!email || !password) {
        results.failed++;
        results.errors.push(`Row ${i + 1}: Missing email or password`);
        continue;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        results.failed++;
        results.errors.push(`Row ${i + 1}: Invalid email format - ${email}`);
        continue;
      }

      // Validate role
      const validRoles = ["STUDENT", "PARENT", "INSTRUCTOR", "ADMIN"];
      if (!validRoles.includes(userRole)) {
        results.failed++;
        results.errors.push(`Row ${i + 1}: Invalid role - ${userRole}`);
        continue;
      }

      try {
        // Check if user already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: User already exists - ${email}`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
          data: {
            email,
            hashedPassword,
            name: name || null,
            role: userRole as any,
          },
        });

        // Create profile based on role
        if (userRole === "PARENT") {
          await prisma.parentProfile.create({
            data: { userId: user.id },
          });
        } else if (userRole === "STUDENT") {
          await prisma.studentProfile.create({
            data: {
              userId: user.id,
              name: name || null,
            },
          });
        }

        results.imported++;

        // Log the import
        await logCreate(
          session.user.email || "unknown",
          "User",
          user.id,
          `Bulk imported user: ${email}`,
          (session.user as any).id,
          { role: userRole, bulkImport: true }
        );
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Row ${i + 1}: ${error.message || "Unknown error"}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("[BulkImport] Error:", error);
    return NextResponse.json(
      { error: "Failed to process import", imported: 0, failed: 0, errors: [] },
      { status: 500 }
    );
  }
}
