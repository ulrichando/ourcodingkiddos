import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding demo accounts...");

  const hashedPassword = await bcrypt.hash("demo123", 10);

  // Create demo instructor
  const instructor = await prisma.user.upsert({
    where: { email: "demo.instructor@example.com" },
    update: { name: "Demo Instructor" },
    create: {
      email: "demo.instructor@example.com",
      name: "Demo Instructor",
      hashedPassword,
      role: "INSTRUCTOR",
    },
  });
  console.log("✅ Demo instructor created:", instructor.email);

  // Create demo parent
  const parent = await prisma.user.upsert({
    where: { email: "demo.parent@example.com" },
    update: { name: "Demo Parent" },
    create: {
      email: "demo.parent@example.com",
      name: "Demo Parent",
      hashedPassword,
      role: "PARENT",
      parentProfile: {
        create: {
          phone: "555-123-4567",
        },
      },
    },
    include: { parentProfile: true },
  });
  console.log("✅ Demo parent created:", parent.email);

  // Create demo student (linked to demo parent)
  const student = await prisma.user.upsert({
    where: { email: "demo.student@example.com" },
    update: { name: "Demo Student" },
    create: {
      email: "demo.student@example.com",
      name: "Demo Student",
      hashedPassword,
      role: "STUDENT",
      studentProfile: {
        create: {
          name: "Demo Student",
          age: 12,
          ageGroup: "AGES_11_14",
          guardianId: parent.parentProfile?.id,
          parentEmail: "demo.parent@example.com",
          avatar: "🦊",
        },
      },
    },
  });

  // Ensure the student profile has the correct name, parent link, and default avatar
  await prisma.studentProfile.updateMany({
    where: { userId: student.id },
    data: {
      name: "Demo Student",
      parentEmail: "demo.parent@example.com",
      guardianId: parent.parentProfile?.id,
      avatar: "🦊",
    },
  });
  console.log("✅ Demo student created:", student.email);

  console.log("\n📋 Demo Account Credentials:");
  console.log("================================");
  console.log("Instructor: demo.instructor@example.com / demo123");
  console.log("Parent:     demo.parent@example.com / demo123");
  console.log("Student:    demo.student@example.com / demo123");
  console.log("================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
