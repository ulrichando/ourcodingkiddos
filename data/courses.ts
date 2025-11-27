export type Lesson = { title: string; description: string; xp: number };

export type Course = {
  id: string;
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  age: string;
  xp: number;
  hours: number;
  description: string;
  language: "html" | "css" | "javascript" | "python" | "roblox";
  gradient: string;
  lessons: Lesson[];
};

export const courses: Course[] = [
  {
    id: "html-basics",
    title: "HTML Basics for Kids",
    level: "beginner",
    age: "Ages 7-10",
    xp: 500,
    hours: 5,
    language: "html",
    gradient: "from-orange-400 to-pink-500",
    description:
      "Learn to build your first web page! Discover tags, headings, paragraphs, images, and links in this fun beginner course.",
    lessons: [
      { title: "What is HTML?", description: "Learn what HTML is and why it's important for building websites", xp: 50 },
      { title: "Headings and Paragraphs", description: "Learn to use headings (h1-h6) and paragraph tags", xp: 50 },
      { title: "Adding Images", description: "Learn to add pictures to your webpage", xp: 75 },
    ],
  },
  {
    id: "css-magic",
    title: "CSS Magic: Style Your Pages",
    level: "beginner",
    age: "Ages 7-10",
    xp: 500,
    hours: 5,
    language: "css",
    gradient: "from-blue-400 to-cyan-500",
    description:
      "Make your websites beautiful with colors, fonts, and layouts. Learn how to make things look amazing.",
    lessons: [
      { title: "Color & Typography", description: "Set colors, fonts, and sizing", xp: 60 },
      { title: "Layouts & Spacing", description: "Arrange elements with margin, padding, and flexbox", xp: 60 },
      { title: "Buttons & Cards", description: "Design fun UI elements kids love", xp: 80 },
    ],
  },
  {
    id: "js-adventures",
    title: "JavaScript Adventures",
    level: "beginner",
    age: "Ages 11-14",
    xp: 750,
    hours: 8,
    language: "javascript",
    gradient: "from-amber-400 to-orange-500",
    description:
      "Add interactivity to your websites! Make buttons click, create animations, and build mini-games.",
    lessons: [
      { title: "Variables & Strings", description: "Store and show information", xp: 80 },
      { title: "Functions & Events", description: "React to clicks and keypresses", xp: 90 },
      { title: "Mini Game", description: "Build a simple clicker game", xp: 120 },
    ],
  },
  {
    id: "python-young",
    title: "Python for Young Coders",
    level: "beginner",
    age: "Ages 11-14",
    xp: 750,
    hours: 10,
    language: "python",
    gradient: "from-green-400 to-emerald-500",
    description:
      "Start your programming journey with Python! Create games, solve puzzles, and automate fun tasks.",
    lessons: [
      { title: "Print & Variables", description: "Say hello to Python and store values", xp: 70 },
      { title: "Loops & Logic", description: "Make code repeat and decide paths", xp: 90 },
      { title: "Text Adventure", description: "Build a choose-your-own-adventure game", xp: 140 },
    ],
  },
  {
    id: "roblox-creator",
    title: "Roblox Game Creator",
    level: "beginner",
    age: "Ages 11-14",
    xp: 1000,
    hours: 12,
    language: "roblox",
    gradient: "from-rose-400 to-pink-500",
    description:
      "Build your own Roblox games! Use Lua scripting to create obstacles, power-ups, and mini-games.",
    lessons: [
      { title: "Studio Setup", description: "Get comfortable in Roblox Studio", xp: 60 },
      { title: "Scripting Basics", description: "Make parts move and react", xp: 120 },
      { title: "Publish & Share", description: "Ship your first playable obby", xp: 200 },
    ],
  },
  {
    id: "web-advanced",
    title: "Advanced Web Development",
    level: "intermediate",
    age: "Ages 15-18",
    xp: 1500,
    hours: 20,
    language: "javascript",
    gradient: "from-purple-400 to-indigo-500",
    description:
      "Take your web skills to the next level. Build responsive layouts, components, and deploy real projects.",
    lessons: [
      { title: "Components & State", description: "Think in reusable UI blocks", xp: 120 },
      { title: "APIs & Data", description: "Fetch and render live data", xp: 160 },
      { title: "Deploy & Share", description: "Publish your project to the web", xp: 200 },
    ],
  },
];
