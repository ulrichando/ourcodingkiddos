/* Seed sample courses/lessons into the local Postgres DB.
 * Run with: NODE_ENV=development node scripts/seed.js
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const sampleCourses = [
  {
    slug: "html-basics",
    title: "HTML Basics for Kids",
    level: "BEGINNER",
    ageGroup: "AGES_7_10",
    language: "HTML",
    totalXp: 500,
    estimatedHours: 5,
    description:
      "Learn to build your first web page! Discover tags, headings, paragraphs, images, and links in this fun beginner course.",
    isPublished: true,
    lessons: [
      { slug: "what-is-html", title: "What is HTML?", description: "Learn what HTML is and why it's important for building websites", xpReward: 50 },
      { slug: "headings-paragraphs", title: "Headings and Paragraphs", description: "Learn to use headings (h1-h6) and paragraph tags", xpReward: 50 },
      { slug: "adding-images", title: "Adding Images", description: "Learn to add pictures to your webpage", xpReward: 75 },
    ],
  },
  {
    slug: "css-magic",
    title: "CSS Magic: Style Your Pages",
    level: "BEGINNER",
    ageGroup: "AGES_7_10",
    language: "CSS",
    totalXp: 500,
    estimatedHours: 5,
    description: "Make your websites beautiful with colors, fonts, and layouts. Learn how to make things look amazing.",
    isPublished: true,
    lessons: [
      { slug: "color-typography", title: "Color & Typography", description: "Set colors, fonts, and sizing", xpReward: 60 },
      { slug: "layouts-spacing", title: "Layouts & Spacing", description: "Arrange elements with margin, padding, and flexbox", xpReward: 60 },
      { slug: "buttons-cards", title: "Buttons & Cards", description: "Design fun UI elements kids love", xpReward: 80 },
    ],
  },
  {
    slug: "js-adventures",
    title: "JavaScript Adventures",
    level: "BEGINNER",
    ageGroup: "AGES_11_14",
    language: "JAVASCRIPT",
    totalXp: 750,
    estimatedHours: 8,
    description: "Add interactivity to your websites! Make buttons click, create animations, and build mini-games.",
    isPublished: true,
    lessons: [
      { slug: "variables-strings", title: "Variables & Strings", description: "Store and show information", xpReward: 80 },
      { slug: "functions-events", title: "Functions & Events", description: "React to clicks and keypresses", xpReward: 90 },
      { slug: "mini-game", title: "Mini Game", description: "Build a simple clicker game", xpReward: 120 },
    ],
  },
  {
    slug: "python-young",
    title: "Python for Young Coders",
    level: "BEGINNER",
    ageGroup: "AGES_11_14",
    language: "PYTHON",
    totalXp: 750,
    estimatedHours: 10,
    description: "Start your programming journey with Python! Create games, solve puzzles, and automate fun tasks.",
    isPublished: true,
    lessons: [
      { slug: "print-variables", title: "Print & Variables", description: "Say hello to Python and store values", xpReward: 70 },
      { slug: "loops-logic", title: "Loops & Logic", description: "Make code repeat and decide paths", xpReward: 90 },
      { slug: "text-adventure", title: "Text Adventure", description: "Build a choose-your-own-adventure game", xpReward: 140 },
    ],
  },
  {
    slug: "roblox-creator",
    title: "Roblox Game Creator",
    level: "BEGINNER",
    ageGroup: "AGES_11_14",
    language: "ROBLOX",
    totalXp: 1000,
    estimatedHours: 12,
    description: "Build your own Roblox games! Use Lua scripting to create obstacles, power-ups, and mini-games.",
    isPublished: true,
    lessons: [
      { slug: "studio-setup", title: "Studio Setup", description: "Get comfortable in Roblox Studio", xpReward: 60 },
      { slug: "scripting-basics", title: "Scripting Basics", description: "Make parts move and react", xpReward: 120 },
      { slug: "publish-share", title: "Publish & Share", description: "Ship your first playable obby", xpReward: 200 },
    ],
  },
  {
    slug: "web-advanced",
    title: "Advanced Web Development",
    level: "INTERMEDIATE",
    ageGroup: "AGES_15_18",
    language: "JAVASCRIPT",
    totalXp: 1500,
    estimatedHours: 20,
    description: "Take your web skills to the next level. Build responsive layouts, components, and deploy real projects.",
    isPublished: true,
    lessons: [
      { slug: "components-state", title: "Components & State", description: "Think in reusable UI blocks", xpReward: 120 },
      { slug: "apis-data", title: "APIs & Data", description: "Fetch and render live data", xpReward: 160 },
      { slug: "deploy-share", title: "Deploy & Share", description: "Publish your project to the web", xpReward: 200 },
    ],
  },
];

async function main() {
  // Seed demo users (admin/parent/instructor/student)
  const demoUsers = [
    { email: "demo@ourcodingkiddos.com", name: "Demo Admin", role: "ADMIN" },
    { email: "demo.parent@ourcodingkiddos.com", name: "Demo Parent", role: "PARENT" },
    { email: "demo.instructor@ourcodingkiddos.com", name: "Demo Instructor", role: "INSTRUCTOR" },
    { email: "demo.student@ourcodingkiddos.com", name: "Demo Student", role: "STUDENT" },
  ];
  const hashed = await bcrypt.hash("demo1234", 10);
  for (const u of demoUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role },
      create: { email: u.email, name: u.name, role: u.role, hashedPassword: hashed },
    });
  }

  for (const course of sampleCourses) {
    const upserted = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        title: course.title,
        description: course.description,
        language: course.language,
        level: course.level,
        ageGroup: course.ageGroup,
        totalXp: course.totalXp,
        estimatedHours: course.estimatedHours,
        isPublished: course.isPublished,
      },
      create: {
        slug: course.slug,
        title: course.title,
        description: course.description,
        language: course.language,
        level: course.level,
        ageGroup: course.ageGroup,
        totalXp: course.totalXp,
        estimatedHours: course.estimatedHours,
        isPublished: course.isPublished,
        lessons: {
          create: course.lessons.map((l, idx) => ({
            slug: l.slug,
            title: l.title,
            description: l.description,
            xpReward: l.xpReward,
            orderIndex: idx,
            isPublished: true,
          })),
        },
      },
      include: { lessons: true },
    });
    console.log(`✔ Seeded course: ${upserted.title} (${upserted.lessons.length} lessons)`);
  }
}

main()
  .catch((e) => {
    console.error("Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
