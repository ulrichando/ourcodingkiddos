import prisma from "../lib/prisma";

async function seedPrograms() {
  console.log("🌱 Seeding programs...");

  const programs = [
    {
      title: "Python Fundamentals for Kids",
      slug: "python-fundamentals-kids",
      description: `Introduce your child to the world of programming with Python, one of the most beginner-friendly and widely-used languages! This comprehensive program is designed specifically for young learners aged 7-10.

Through fun, interactive lessons, students will learn the basics of coding including variables, loops, conditionals, and functions. They'll create exciting projects like simple games, animations, and interactive stories.

Our experienced instructors use a hands-on approach, ensuring every child gets personalized attention and builds confidence in their coding abilities.`,
      shortDescription: "A fun introduction to Python programming for young learners with interactive projects and games.",
      thumbnailUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
      language: "PYTHON",
      ageGroup: "AGES_7_10",
      level: "BEGINNER",
      sessionCount: 12,
      sessionDuration: 60,
      priceCents: 29900, // $299
      originalPriceCents: 39900, // $399
      features: [
        "12 live online sessions (1 hour each)",
        "Small class sizes (max 6 students)",
        "Hands-on coding projects",
        "Certificate of completion",
        "Access to recorded sessions",
        "Parent progress reports",
        "1-on-1 support available"
      ],
      curriculum: [
        { week: "1-2", topic: "Introduction to Python & First Programs", description: "Setting up, print statements, basic input/output" },
        { week: "3-4", topic: "Variables & Data Types", description: "Numbers, strings, and storing information" },
        { week: "5-6", topic: "Making Decisions with Conditionals", description: "If/else statements, comparison operators" },
        { week: "7-8", topic: "Loops & Repetition", description: "For loops, while loops, creating patterns" },
        { week: "9-10", topic: "Functions & Organization", description: "Creating reusable code blocks" },
        { week: "11-12", topic: "Final Project", description: "Build your own interactive game!" }
      ],
      isFeatured: true,
      isPublished: true,
      orderIndex: 1,
    },
    {
      title: "Web Development Bootcamp",
      slug: "web-development-bootcamp",
      description: `Transform your child into a web creator! This comprehensive bootcamp teaches HTML, CSS, and JavaScript - the building blocks of every website on the internet.

Perfect for curious minds aged 11-14 who want to build their own websites, games, and interactive web applications. Students will learn to design beautiful layouts, add stunning styles, and bring their creations to life with JavaScript.

By the end of this program, each student will have built their own portfolio website showcasing their projects - a real accomplishment they can share with friends and family!`,
      shortDescription: "Learn HTML, CSS & JavaScript to build stunning websites and interactive web applications.",
      thumbnailUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800",
      language: "WEB_DEVELOPMENT",
      ageGroup: "AGES_11_14",
      level: "BEGINNER",
      sessionCount: 18,
      sessionDuration: 75,
      priceCents: 44900, // $449
      originalPriceCents: 59900, // $599
      features: [
        "18 live online sessions (75 min each)",
        "Small class sizes (max 6 students)",
        "Build 5+ real websites",
        "Personal portfolio website",
        "Certificate of completion",
        "Access to recorded sessions",
        "Code review & feedback",
        "Job-ready skills introduction"
      ],
      curriculum: [
        { week: "1-3", topic: "HTML Foundations", description: "Structure, elements, forms, semantic HTML" },
        { week: "4-6", topic: "CSS Styling Mastery", description: "Selectors, layouts, Flexbox, Grid, animations" },
        { week: "7-9", topic: "Responsive Design", description: "Mobile-first design, media queries" },
        { week: "10-12", topic: "JavaScript Basics", description: "Variables, functions, DOM manipulation" },
        { week: "13-15", topic: "Interactive Features", description: "Events, forms, local storage" },
        { week: "16-18", topic: "Portfolio Project", description: "Build and deploy your personal website" }
      ],
      isFeatured: true,
      isPublished: true,
      orderIndex: 2,
    },
    {
      title: "Roblox Game Development",
      slug: "roblox-game-development",
      description: `Turn screen time into learning time! If your child loves playing Roblox, they'll love learning to CREATE Roblox games even more.

This exciting program teaches Lua programming through Roblox Studio, the same tools used by professional game developers. Students aged 7-10 will learn game design principles, 3D modeling basics, and scripting while building their own playable games.

Watch your child go from player to creator as they design levels, add game mechanics, and even publish their games for friends to play!`,
      shortDescription: "Create your own Roblox games using Lua scripting and Roblox Studio.",
      thumbnailUrl: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=800",
      language: "ROBLOX",
      ageGroup: "AGES_7_10",
      level: "BEGINNER",
      sessionCount: 12,
      sessionDuration: 60,
      priceCents: 34900, // $349
      originalPriceCents: 44900, // $449
      features: [
        "12 live online sessions (1 hour each)",
        "Small class sizes (max 6 students)",
        "Build 3 complete games",
        "Learn Lua programming",
        "Game design fundamentals",
        "Certificate of completion",
        "Publish games to Roblox",
        "Access to recorded sessions"
      ],
      curriculum: [
        { week: "1-2", topic: "Roblox Studio Basics", description: "Interface, tools, building basics" },
        { week: "3-4", topic: "3D World Building", description: "Terrain, objects, environment design" },
        { week: "5-6", topic: "Introduction to Lua", description: "Variables, print, basic scripts" },
        { week: "7-8", topic: "Game Mechanics", description: "Player movement, scoring, collectibles" },
        { week: "9-10", topic: "Advanced Features", description: "GUIs, sounds, special effects" },
        { week: "11-12", topic: "Final Game Project", description: "Complete and publish your game!" }
      ],
      isFeatured: true,
      isPublished: true,
      orderIndex: 3,
    },
    {
      title: "AI & Machine Learning Explorer",
      slug: "ai-machine-learning-explorer",
      description: `Prepare your teen for the future of technology! This cutting-edge program introduces high school students to Artificial Intelligence and Machine Learning - the technologies reshaping our world.

Using Python and industry-standard tools, students will learn how AI systems work, train their own machine learning models, and build practical applications. From image recognition to natural language processing, this program covers the fundamentals every aspiring tech professional needs.

Perfect for students aged 15-18 who are ready for more advanced concepts and want to explore careers in tech, data science, or AI.`,
      shortDescription: "Explore artificial intelligence and build your own machine learning models with Python.",
      thumbnailUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      language: "AI_ML",
      ageGroup: "AGES_15_18",
      level: "INTERMEDIATE",
      sessionCount: 24,
      sessionDuration: 90,
      priceCents: 69900, // $699
      originalPriceCents: 89900, // $899
      features: [
        "24 live online sessions (90 min each)",
        "Small class sizes (max 5 students)",
        "Real-world AI projects",
        "Python & TensorFlow basics",
        "Certificate of completion",
        "Access to recorded sessions",
        "Career guidance included",
        "Portfolio-ready projects",
        "1-on-1 mentorship sessions"
      ],
      curriculum: [
        { week: "1-4", topic: "Python for AI", description: "NumPy, Pandas, data manipulation" },
        { week: "5-8", topic: "Machine Learning Fundamentals", description: "Supervised learning, classification, regression" },
        { week: "9-12", topic: "Neural Networks", description: "Deep learning basics, TensorFlow intro" },
        { week: "13-16", topic: "Computer Vision", description: "Image recognition, CNNs, practical applications" },
        { week: "17-20", topic: "Natural Language Processing", description: "Text analysis, chatbots, sentiment analysis" },
        { week: "21-24", topic: "Capstone Project", description: "Build and present your AI application" }
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 4,
    },
    {
      title: "JavaScript Game Development",
      slug: "javascript-game-development",
      description: `Level up your coding skills by building awesome games! This action-packed program teaches JavaScript through game development - the most engaging way to learn programming.

Students aged 11-14 will master JavaScript fundamentals while creating arcade classics, puzzle games, and their own original game designs. Using HTML5 Canvas and modern JavaScript, they'll learn the same techniques used by professional game developers.

Each session builds on the last, with students completing a new game or game feature every few weeks. By the end, they'll have a portfolio of games they've built from scratch!`,
      shortDescription: "Master JavaScript by building exciting browser-based games from scratch.",
      thumbnailUrl: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=800",
      language: "JAVASCRIPT",
      ageGroup: "AGES_11_14",
      level: "INTERMEDIATE",
      sessionCount: 16,
      sessionDuration: 75,
      priceCents: 39900, // $399
      originalPriceCents: 49900, // $499
      features: [
        "16 live online sessions (75 min each)",
        "Small class sizes (max 6 students)",
        "Build 4 complete games",
        "HTML5 Canvas graphics",
        "Game physics & collision",
        "Certificate of completion",
        "Access to recorded sessions",
        "Publish games online"
      ],
      curriculum: [
        { week: "1-2", topic: "JavaScript Refresher", description: "Variables, functions, objects, arrays" },
        { week: "3-4", topic: "Canvas Graphics", description: "Drawing, colors, shapes, animation loops" },
        { week: "5-6", topic: "Game Project 1: Pong", description: "Movement, collision, scoring" },
        { week: "7-8", topic: "Game Project 2: Snake", description: "Grid-based games, growing mechanics" },
        { week: "9-10", topic: "Sprite Animation", description: "Loading images, sprite sheets, animation" },
        { week: "11-12", topic: "Game Project 3: Platformer", description: "Gravity, jumping, level design" },
        { week: "13-14", topic: "Sound & Polish", description: "Audio, particles, game feel" },
        { week: "15-16", topic: "Final Game Project", description: "Design and build your own game!" }
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 5,
    },
  ];

  for (const program of programs) {
    const created = await prisma.program.upsert({
      where: { slug: program.slug },
      update: {
        title: program.title,
        description: program.description,
        shortDescription: program.shortDescription,
        thumbnailUrl: program.thumbnailUrl,
        language: program.language as any,
        ageGroup: program.ageGroup as any,
        level: program.level as any,
        sessionCount: program.sessionCount,
        sessionDuration: program.sessionDuration,
        priceCents: program.priceCents,
        originalPriceCents: program.originalPriceCents,
        features: program.features,
        curriculum: program.curriculum,
        isFeatured: program.isFeatured,
        isPublished: program.isPublished,
        orderIndex: program.orderIndex,
      },
      create: {
        title: program.title,
        slug: program.slug,
        description: program.description,
        shortDescription: program.shortDescription,
        thumbnailUrl: program.thumbnailUrl,
        language: program.language as any,
        ageGroup: program.ageGroup as any,
        level: program.level as any,
        sessionCount: program.sessionCount,
        sessionDuration: program.sessionDuration,
        priceCents: program.priceCents,
        originalPriceCents: program.originalPriceCents,
        features: program.features,
        curriculum: program.curriculum,
        isFeatured: program.isFeatured,
        isPublished: program.isPublished,
        orderIndex: program.orderIndex,
      },
    });
    console.log(`✅ Created program: ${created.title} - $${(created.priceCents / 100).toFixed(2)}`);
  }

  console.log("\n✨ Programs seeding complete!");
  console.log("\nCreated 5 programs:");
  console.log("  1. Python Fundamentals for Kids - $299 (Ages 7-10)");
  console.log("  2. Web Development Bootcamp - $449 (Ages 11-14)");
  console.log("  3. Roblox Game Development - $349 (Ages 7-10)");
  console.log("  4. AI & Machine Learning Explorer - $699 (Ages 15-18)");
  console.log("  5. JavaScript Game Development - $399 (Ages 11-14)");
}

seedPrograms()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
