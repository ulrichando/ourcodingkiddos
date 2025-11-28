// Imports the static courses from data/courses into the Prisma DB.
// Safe to re-run: uses upserts for courses and lessons.

const { PrismaClient } = require("@prisma/client");

// Inline fallback courses (mirrors data/courses.ts)
const courses = [
  {
    id: "html-basics-for-kids",
    title: "HTML Basics for Kids",
    level: "beginner",
    age: "Ages 7-10",
    xp: 500,
    hours: 5,
    language: "html",
    description: "Learn to build your first web page! Discover tags, headings, paragraphs, images, and links in this fun beginner course.",
    lessons: [
      { title: "What is HTML?", description: "Learn what HTML is and why it's important for building websites", xp: 50 },
      { title: "Headings and Paragraphs", description: "Learn to use headings (h1-h6) and paragraph tags", xp: 50 },
      { title: "Adding Images", description: "Learn to add pictures to your webpage", xp: 75 },
    ],
  },
  {
    id: "css-magic-style-your-pages",
    title: "CSS Magic: Style Your Pages",
    level: "beginner",
    age: "Ages 7-10",
    xp: 500,
    hours: 5,
    language: "css",
    description: "Make your websites beautiful with colors, fonts, and layouts. Learn how to make things look amazing.",
    lessons: [
      { title: "Color & Typography", description: "Set colors, fonts, and sizing", xp: 60 },
      { title: "Layouts & Spacing", description: "Arrange elements with margin, padding, and flexbox", xp: 60 },
      { title: "Buttons & Cards", description: "Design fun UI elements kids love", xp: 80 },
    ],
  },
  {
    id: "javascript-adventures",
    title: "JavaScript Adventures",
    level: "beginner",
    age: "Ages 11-14",
    xp: 750,
    hours: 8,
    language: "javascript",
    description: "Add interactivity to your websites! Make buttons click, create animations, and build mini-games.",
    lessons: [
      { title: "Variables & Strings", description: "Store and show information", xp: 80 },
      { title: "Functions & Events", description: "React to clicks and keypresses", xp: 90 },
      { title: "Mini Game", description: "Build a simple clicker game", xp: 120 },
    ],
  },
  {
    id: "python-for-young-coders",
    title: "Python for Young Coders",
    level: "beginner",
    age: "Ages 11-14",
    xp: 750,
    hours: 10,
    language: "python",
    description: "Start your programming journey with Python! Create games, solve puzzles, and automate fun tasks.",
    lessons: [
      { title: "Print & Variables", description: "Say hello to Python and store values", xp: 70 },
      { title: "Loops & Logic", description: "Make code repeat and decide paths", xp: 90 },
      { title: "Text Adventure", description: "Build a choose-your-own-adventure game", xp: 140 },
    ],
  },
  {
    id: "roblox-game-creator",
    title: "Roblox Game Creator",
    level: "beginner",
    age: "Ages 11-14",
    xp: 1000,
    hours: 12,
    language: "roblox",
    description: "Build your own Roblox games! Use Lua scripting to create obstacles, power-ups, and mini-games.",
    lessons: [
      { title: "Studio Setup", description: "Get comfortable in Roblox Studio", xp: 60 },
      { title: "Scripting Basics", description: "Make parts move and react", xp: 120 },
      { title: "Publish & Share", description: "Ship your first playable obby", xp: 200 },
    ],
  },
  {
    id: "advanced-web-development",
    title: "Advanced Web Development",
    level: "intermediate",
    age: "Ages 15-18",
    xp: 1500,
    hours: 20,
    language: "javascript",
    description: "Take your web skills to the next level. Build responsive layouts, components, and deploy real projects.",
    lessons: [
      { title: "Components & State", description: "Think in reusable UI blocks", xp: 120 },
      { title: "APIs & Data", description: "Fetch and render live data", xp: 160 },
      { title: "Deploy & Share", description: "Publish your project to the web", xp: 200 },
    ],
  },
  {
    id: "reactjs",
    title: "ReactJS",
    level: "beginner",
    age: "Ages 11-14",
    xp: 600,
    hours: 6,
    language: "javascript",
    description: "Build interactive UIs with React components, state, and props.",
    lessons: [
      { title: "Intro to React", description: "JSX, components, and props", xp: 80 },
      { title: "State & Events", description: "Manage state and handle events", xp: 100 },
      { title: "Lists & Keys", description: "Render lists efficiently", xp: 120 },
    ],
  },
];

const prisma = new PrismaClient();

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const ageMap = {
  "Ages 7-10": "AGES_7_10",
  "Ages 11-14": "AGES_11_14",
  "Ages 15-18": "AGES_15_18",
};

async function main() {
  for (const course of courses) {
    const slug = course.id || slugify(course.title);
    const level = course.level.toUpperCase();
    const language = course.language.toUpperCase();
    const ageGroup = ageMap[course.age] || "AGES_7_10";

    const dbCourse = await prisma.course.upsert({
      where: { slug },
      update: {
        title: course.title,
        description: course.description,
        language,
        level,
        ageGroup,
        totalXp: course.xp || 0,
        estimatedHours: course.hours || 0,
        isPublished: true,
      },
      create: {
        title: course.title,
        slug,
        description: course.description,
        language,
        level,
        ageGroup,
        totalXp: course.xp || 0,
        estimatedHours: course.hours || 0,
        isPublished: true,
      },
    });

    if (course.lessons?.length) {
      for (let i = 0; i < course.lessons.length; i++) {
        const lesson = course.lessons[i];
        const lessonSlug = slugify(lesson.title) || `lesson-${i}`;
        const existing = await prisma.lesson.findFirst({
          where: { courseId: dbCourse.id, slug: lessonSlug },
        });
        if (existing) {
          await prisma.lesson.update({
            where: { id: existing.id },
            data: {
              title: lesson.title,
              description: lesson.description,
              xpReward: lesson.xp || 0,
              orderIndex: i,
              isPublished: true,
            },
          });
        } else {
          await prisma.lesson.create({
            data: {
              courseId: dbCourse.id,
              title: lesson.title,
              slug: lessonSlug,
              description: lesson.description,
              xpReward: lesson.xp || 0,
              orderIndex: i,
              isPublished: true,
            },
          });
        }
      }
    }
    console.log(`Upserted course: ${course.title} (${slug})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
