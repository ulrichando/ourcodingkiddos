import { PrismaClient, Language, CourseLevel, AgeGroup } from "../generated/prisma-client";

const prisma = new PrismaClient();

// Web Development Courses Data
const webDevCourses = [
  // LEVEL 1: WEB DEVELOPMENT BEGINNER
  {
    id: "webdev-beginner",
    title: "Web Development Foundations",
    level: "BEGINNER" as CourseLevel,
    ageGroup: "AGES_11_14" as AgeGroup,
    totalXp: 1500,
    estimatedHours: 15,
    language: "WEB_DEVELOPMENT" as Language,
    description:
      "Start your journey to become a web developer! Learn the fundamentals of HTML, CSS, and JavaScript to create your first interactive websites from scratch.",
    lessons: [
      { title: "Welcome to Web Development", description: "Discover how the internet works and what web developers do - your journey starts here!", xp: 50 },
      { title: "Setting Up Your Developer Environment", description: "Install VS Code, set up your workspace, and learn essential developer tools", xp: 60 },
      { title: "HTML Fundamentals: Structure", description: "Learn HTML tags, elements, and how to structure a webpage with headings, paragraphs, and lists", xp: 80 },
      { title: "HTML Fundamentals: Content", description: "Add images, links, and multimedia content to your webpages", xp: 80 },
      { title: "HTML Forms & Inputs", description: "Create interactive forms to collect user information", xp: 90 },
      { title: "CSS Basics: Styling Text", description: "Add colors, fonts, and text styling to make your pages beautiful", xp: 80 },
      { title: "CSS Basics: Box Model", description: "Understand margin, padding, borders, and how elements take up space", xp: 100 },
      { title: "CSS Layouts with Flexbox", description: "Arrange elements on your page using the powerful Flexbox system", xp: 120 },
      { title: "Introduction to JavaScript", description: "Write your first JavaScript code - variables, data types, and console output", xp: 100 },
      { title: "JavaScript: Making Decisions", description: "Use if/else statements and comparison operators to add logic to your code", xp: 110 },
      { title: "JavaScript: DOM Basics", description: "Select HTML elements and change them dynamically with JavaScript", xp: 120 },
      { title: "JavaScript: Events", description: "Respond to clicks, keyboard input, and other user interactions", xp: 120 },
      { title: "Project: Personal Portfolio Page", description: "Build a complete personal portfolio showcasing what you've learned!", xp: 200 },
    ],
  },

  // LEVEL 2: WEB DEVELOPMENT INTERMEDIATE
  {
    id: "webdev-intermediate",
    title: "Web Development: Building Real Websites",
    level: "INTERMEDIATE" as CourseLevel,
    ageGroup: "AGES_11_14" as AgeGroup,
    totalXp: 2200,
    estimatedHours: 22,
    language: "WEB_DEVELOPMENT" as Language,
    description:
      "Take your web skills to the next level! Master responsive design, advanced CSS, JavaScript functions, and build dynamic, mobile-friendly websites.",
    lessons: [
      { title: "Review & Advanced HTML5", description: "Refresh HTML basics and explore semantic HTML5 elements for better structure", xp: 70 },
      { title: "CSS Grid Layouts", description: "Create complex, two-dimensional layouts using CSS Grid", xp: 120 },
      { title: "Responsive Design Principles", description: "Make your websites look great on phones, tablets, and desktops", xp: 130 },
      { title: "Media Queries & Breakpoints", description: "Write CSS that adapts to different screen sizes", xp: 120 },
      { title: "CSS Transitions & Animations", description: "Add smooth animations and hover effects to your elements", xp: 140 },
      { title: "JavaScript Functions Deep Dive", description: "Master function declarations, expressions, arrow functions, and scope", xp: 150 },
      { title: "JavaScript Arrays & Objects", description: "Work with collections of data and complex data structures", xp: 150 },
      { title: "Array Methods: map, filter, reduce", description: "Transform and manipulate data like a pro with powerful array methods", xp: 160 },
      { title: "DOM Manipulation Advanced", description: "Create, remove, and modify elements dynamically - build interactive UIs", xp: 150 },
      { title: "Form Validation with JavaScript", description: "Validate user input and provide helpful feedback before submission", xp: 140 },
      { title: "Local Storage & Session Storage", description: "Save data in the browser to persist user preferences and app state", xp: 130 },
      { title: "Introduction to Version Control", description: "Learn Git basics - commit, push, pull, and collaborate on code", xp: 140 },
      { title: "Project: Responsive Business Website", description: "Build a fully responsive, multi-page business website with a contact form", xp: 250 },
    ],
  },

  // LEVEL 3: WEB DEVELOPMENT ADVANCED
  {
    id: "webdev-advanced",
    title: "Web Development: Modern JavaScript & APIs",
    level: "ADVANCED" as CourseLevel,
    ageGroup: "AGES_15_18" as AgeGroup,
    totalXp: 3000,
    estimatedHours: 30,
    language: "WEB_DEVELOPMENT" as Language,
    description:
      "Master modern JavaScript (ES6+), work with APIs, handle asynchronous code, and start building dynamic web applications that fetch real data.",
    lessons: [
      { title: "ES6+ Modern JavaScript", description: "Destructuring, spread operator, template literals, and modern JS features", xp: 150 },
      { title: "JavaScript Classes & OOP", description: "Object-oriented programming with classes, constructors, and inheritance", xp: 170 },
      { title: "Modules & Code Organization", description: "Import/export modules and organize your code into reusable pieces", xp: 150 },
      { title: "Asynchronous JavaScript: Callbacks", description: "Understand async programming and how JavaScript handles non-blocking code", xp: 160 },
      { title: "Promises in JavaScript", description: "Master Promises for cleaner async code and better error handling", xp: 180 },
      { title: "Async/Await Mastery", description: "Write async code that reads like synchronous code using async/await", xp: 180 },
      { title: "Fetch API: Getting Data", description: "Make HTTP requests and retrieve data from external APIs", xp: 200 },
      { title: "Working with JSON Data", description: "Parse, manipulate, and display JSON data from APIs", xp: 160 },
      { title: "Error Handling & Debugging", description: "Handle errors gracefully and debug like a professional developer", xp: 150 },
      { title: "Building a REST API Client", description: "Create a complete client that communicates with REST APIs", xp: 200 },
      { title: "Introduction to NPM & Packages", description: "Use the Node Package Manager to add powerful libraries to your projects", xp: 150 },
      { title: "Build Tools: Bundlers & Transpilers", description: "Set up Webpack or Vite to bundle and optimize your code", xp: 180 },
      { title: "CSS Preprocessors: Sass/SCSS", description: "Write more powerful CSS with variables, nesting, and mixins", xp: 160 },
      { title: "Project: Weather Dashboard App", description: "Build a real weather app that fetches live data from a weather API", xp: 300 },
    ],
  },

  // LEVEL 4: WEB DEVELOPMENT EXPERT (mapped to ADVANCED in DB)
  {
    id: "webdev-expert",
    title: "Web Development: Full-Stack Foundations",
    level: "ADVANCED" as CourseLevel,
    ageGroup: "AGES_15_18" as AgeGroup,
    totalXp: 4000,
    estimatedHours: 40,
    language: "WEB_DEVELOPMENT" as Language,
    description:
      "Become a full-stack developer! Learn React for frontend, Node.js for backend, databases, authentication, and deploy real applications to the cloud.",
    lessons: [
      { title: "Introduction to React", description: "Learn component-based architecture and why React dominates modern web development", xp: 200 },
      { title: "React Components & JSX", description: "Create reusable UI components using JSX syntax", xp: 200 },
      { title: "React Props & Data Flow", description: "Pass data between components and understand one-way data flow", xp: 180 },
      { title: "React State & useState Hook", description: "Manage component state and create interactive UIs", xp: 220 },
      { title: "React useEffect & Side Effects", description: "Handle side effects, API calls, and component lifecycle", xp: 220 },
      { title: "React Forms & Controlled Components", description: "Build forms and handle user input in React", xp: 180 },
      { title: "React Router: Multi-Page Apps", description: "Add client-side routing to create single-page applications", xp: 200 },
      { title: "Introduction to Node.js", description: "Run JavaScript on the server and understand the Node.js runtime", xp: 200 },
      { title: "Express.js: Building APIs", description: "Create REST APIs with Express.js - routes, middleware, and responses", xp: 250 },
      { title: "Database Fundamentals: SQL vs NoSQL", description: "Understand database types and when to use each", xp: 180 },
      { title: "MongoDB & Mongoose", description: "Store and retrieve data using MongoDB and the Mongoose ODM", xp: 250 },
      { title: "User Authentication: JWT", description: "Implement secure user login with JSON Web Tokens", xp: 280 },
      { title: "Protecting Routes & Authorization", description: "Secure your API endpoints and implement role-based access", xp: 220 },
      { title: "Connecting Frontend to Backend", description: "Integrate your React app with your Express API", xp: 250 },
      { title: "Deployment: Vercel & Railway", description: "Deploy your full-stack app to production on the cloud", xp: 250 },
      { title: "Project: Full-Stack Task Manager", description: "Build a complete task management app with user auth, database, and deployment", xp: 400 },
    ],
  },

  // LEVEL 5: WEB DEVELOPMENT MASTER (mapped to ADVANCED in DB)
  {
    id: "webdev-master",
    title: "Web Development: Professional Mastery",
    level: "ADVANCED" as CourseLevel,
    ageGroup: "AGES_15_18" as AgeGroup,
    totalXp: 5500,
    estimatedHours: 55,
    language: "WEB_DEVELOPMENT" as Language,
    description:
      "Master professional web development! Learn TypeScript, advanced state management, testing, CI/CD, performance optimization, and industry best practices used by top companies.",
    lessons: [
      { title: "TypeScript Fundamentals", description: "Add static typing to JavaScript for safer, more maintainable code", xp: 250 },
      { title: "TypeScript with React", description: "Build type-safe React applications with TypeScript", xp: 280 },
      { title: "Advanced React Patterns", description: "Higher-order components, render props, compound components, and custom hooks", xp: 300 },
      { title: "State Management: Context & Reducers", description: "Manage complex state with useContext and useReducer", xp: 280 },
      { title: "State Management: Redux Toolkit", description: "Implement global state management for large applications", xp: 300 },
      { title: "React Query & Data Fetching", description: "Advanced data fetching, caching, and server state management", xp: 280 },
      { title: "Testing: Unit Tests with Jest", description: "Write unit tests to ensure your code works correctly", xp: 280 },
      { title: "Testing: React Testing Library", description: "Test React components with user-focused testing strategies", xp: 300 },
      { title: "Testing: E2E with Cypress", description: "Write end-to-end tests that simulate real user behavior", xp: 280 },
      { title: "API Design Best Practices", description: "Design RESTful APIs that are intuitive and scalable", xp: 250 },
      { title: "Database Optimization", description: "Indexing, query optimization, and database performance tuning", xp: 280 },
      { title: "Authentication: OAuth & Social Login", description: "Implement third-party authentication (Google, GitHub, etc.)", xp: 300 },
      { title: "Security Best Practices", description: "Protect against XSS, CSRF, SQL injection, and other vulnerabilities", xp: 300 },
      { title: "Performance Optimization", description: "Lazy loading, code splitting, memoization, and web vitals", xp: 300 },
      { title: "CI/CD Pipelines", description: "Automate testing and deployment with GitHub Actions", xp: 280 },
      { title: "Docker & Containerization", description: "Package your applications in containers for consistent deployment", xp: 300 },
      { title: "System Design Fundamentals", description: "Architecture patterns, scalability, and designing for growth", xp: 320 },
      { title: "Real-time Features: WebSockets", description: "Add real-time updates with WebSockets and Socket.io", xp: 280 },
      { title: "GraphQL Introduction", description: "Query and mutate data efficiently with GraphQL", xp: 280 },
      { title: "Final Project: Production-Ready App", description: "Build a complete, tested, production-ready full-stack application with CI/CD", xp: 500 },
    ],
  },
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

async function main() {
  console.log("🌱 Seeding Web Development courses...\n");

  for (const courseData of webDevCourses) {
    const { lessons, id, ...courseFields } = courseData;

    // Generate slug from title
    const baseSlug = slugify(courseFields.title);
    let slug = baseSlug;
    let counter = 1;

    // Check if slug exists and make unique if needed
    while (true) {
      const exists = await prisma.course.findUnique({ where: { slug } });
      if (!exists) break;
      slug = `${baseSlug}-${counter++}`;
    }

    console.log(`📚 Creating course: ${courseFields.title}`);

    // Create course
    const course = await prisma.course.create({
      data: {
        ...courseFields,
        slug,
        isPublished: true,
        orderIndex: webDevCourses.indexOf(courseData),
      },
    });

    console.log(`   ✅ Course created with ID: ${course.id}`);
    console.log(`   📝 Adding ${lessons.length} lessons...`);

    // Create lessons for this course
    for (let i = 0; i < lessons.length; i++) {
      const lessonData = lessons[i];
      const lessonSlug = slugify(lessonData.title);

      await prisma.lesson.create({
        data: {
          courseId: course.id,
          title: lessonData.title,
          slug: lessonSlug,
          description: lessonData.description,
          xpReward: lessonData.xp,
          orderIndex: i,
          isPublished: true,
        },
      });
    }

    console.log(`   ✅ ${lessons.length} lessons created\n`);
  }

  console.log("🎉 Web Development courses seeded successfully!");
  console.log("\n📊 Summary:");
  console.log("===========");
  console.log(`Total courses created: ${webDevCourses.length}`);
  console.log(`Total lessons created: ${webDevCourses.reduce((acc, c) => acc + c.lessons.length, 0)}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
