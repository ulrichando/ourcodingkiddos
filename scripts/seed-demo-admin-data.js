// Seeds demo parent, student, courses, and subscription data for the admin dashboard.
// Requires DATABASE_URL to be set (already in .env.local). Safe to re-run (uses upserts).

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const demoPassword = "demo1234";
  const hashedPassword = await bcrypt.hash(demoPassword, 10);

  // Parent user
  const parentUser = await prisma.user.upsert({
    where: { email: "demo.parent@ourcodingkiddos.com" },
    update: { name: "Demo Parent", hashedPassword, role: "PARENT" },
    create: { email: "demo.parent@ourcodingkiddos.com", name: "Demo Parent", hashedPassword, role: "PARENT" },
  });

  // Parent profile
  const parentProfile = await prisma.parentProfile.upsert({
    where: { userId: parentUser.id },
    update: { phone: "555-1234", address: "123 Demo St" },
    create: { userId: parentUser.id, phone: "555-1234", address: "123 Demo St" },
  });

  // Student user + profile
  const studentUser = await prisma.user.upsert({
    where: { email: "demo.student@ourcodingkiddos.com" },
    update: { name: "Demo Student", hashedPassword, role: "STUDENT" },
    create: { email: "demo.student@ourcodingkiddos.com", name: "Demo Student", hashedPassword, role: "STUDENT" },
  });

  await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {
      name: "Demo Student",
      age: 11,
      parentEmail: parentUser.email,
      totalXp: 1250,
      currentLevel: 3,
      guardianId: parentProfile.id,
    },
    create: {
      userId: studentUser.id,
      name: "Demo Student",
      age: 11,
      parentEmail: parentUser.email,
      totalXp: 1250,
      currentLevel: 3,
      guardianId: parentProfile.id,
    },
  });

  // Courses
  const demoCourses = [
    { title: "HTML Basics for Kids", slug: "html-basics-for-kids", language: "HTML", level: "BEGINNER", ageGroup: "AGES_7_10" },
    { title: "CSS Magic: Style Your Pages", slug: "css-magic-style-your-pages", language: "CSS", level: "BEGINNER", ageGroup: "AGES_7_10" },
    { title: "JavaScript Adventures", slug: "javascript-adventures", language: "JAVASCRIPT", level: "BEGINNER", ageGroup: "AGES_11_14" },
    { title: "Python for Young Coders", slug: "python-for-young-coders", language: "PYTHON", level: "BEGINNER", ageGroup: "AGES_11_14" },
    { title: "Roblox Game Creator", slug: "roblox-game-creator", language: "ROBLOX", level: "BEGINNER", ageGroup: "AGES_11_14" },
    { title: "Advanced Web Development", slug: "advanced-web-development", language: "JAVASCRIPT", level: "INTERMEDIATE", ageGroup: "AGES_15_18" },
  ];

  for (const course of demoCourses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: { ...course, description: course.title, isPublished: true },
      create: { ...course, description: course.title, isPublished: true },
    });
  }

  // Subscription for the parent
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: "demo-subscription-1" },
    update: {
      userId: parentUser.id,
      status: "ACTIVE",
      priceId: "demo-price",
      planType: "FAMILY",
      priceCents: 0,
      stripeCustomerId: "demo-customer",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      parentEmail: parentUser.email,
    },
    create: {
      userId: parentUser.id,
      status: "ACTIVE",
      priceId: "demo-price",
      planType: "FAMILY",
      priceCents: 0,
      stripeSubscriptionId: "demo-subscription-1",
      stripeCustomerId: "demo-customer",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      parentEmail: parentUser.email,
    },
  });

  console.log("Seed complete:");
  console.log("- Parent:", parentUser.email);
  console.log("- Student:", studentUser.email);
  console.log("- Courses:", demoCourses.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
