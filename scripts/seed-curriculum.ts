import prisma from "../lib/prisma";

/**
 * Comprehensive curriculum seed script
 * Creates a structured learning path similar to CodeWizards HQ with:
 * - Coder Level I (Beginner)
 * - Coder Level II (Intermediate)
 * - Coder Level III (Advanced)
 * Each level has courses for different age groups and subjects
 */

async function seedCurriculum() {
  console.log("🎓 Seeding Comprehensive Curriculum...\n");

  const programs = [
    // ============================================
    // CODER LEVEL I - BEGINNER (Foundation)
    // ============================================

    // Ages 7-10 - Level I
    {
      title: "Intro to Coding with Scratch",
      slug: "intro-coding-scratch-7-10",
      description: `Start your coding journey with Scratch, the world's most popular visual programming language for kids! This beginner-friendly program introduces fundamental coding concepts through colorful blocks and instant visual feedback.

Students will learn to think like programmers as they create interactive stories, animations, and simple games. No prior experience needed - just curiosity and creativity!

Perfect for young minds who are new to coding and want to build confidence before moving to text-based programming.`,
      shortDescription: "Learn coding fundamentals through fun visual programming with Scratch. Create games and animations!",
      thumbnailUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
      language: "GAME_DEVELOPMENT",
      ageGroup: "AGES_7_10",
      level: "BEGINNER",
      sessionCount: 12,
      sessionDuration: 55,
      priceCents: 29900,
      originalPriceCents: 39900,
      features: [
        "12 live sessions (55 min each)",
        "Small class sizes (max 6 students)",
        "Create 5+ projects",
        "No prior experience needed",
        "Certificate of completion",
        "Recorded sessions access",
        "Parent progress reports",
      ],
      curriculum: [
        { title: "Welcome to Scratch", description: "Interface basics, sprites, and your first animation" },
        { title: "Motion & Looks", description: "Making characters move and change appearance" },
        { title: "Events & Control", description: "Interactive programs that respond to input" },
        { title: "Sound & Music", description: "Adding audio to bring creations to life" },
        { title: "Variables & Scoring", description: "Keeping track of points and lives" },
        { title: "Capstone Project", description: "Design and build your own game!" },
      ],
      isFeatured: true,
      isPublished: true,
      orderIndex: 1,
    },
    {
      title: "Python Basics for Young Coders",
      slug: "python-basics-young-coders",
      description: `Take the first step into real programming with Python! Designed specifically for ages 7-10, this program introduces text-based coding through fun, age-appropriate projects.

Students learn Python fundamentals including variables, loops, and conditionals while creating interactive programs, simple games, and cool animations using Turtle graphics.

Our patient instructors make coding accessible and enjoyable, building confidence one line of code at a time.`,
      shortDescription: "Your child's first text-based programming language. Learn Python through fun projects!",
      thumbnailUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
      language: "PYTHON",
      ageGroup: "AGES_7_10",
      level: "BEGINNER",
      sessionCount: 12,
      sessionDuration: 55,
      priceCents: 29900,
      originalPriceCents: 39900,
      features: [
        "12 live sessions (55 min each)",
        "Small class sizes (max 6 students)",
        "Turtle graphics projects",
        "Simple game creation",
        "Certificate of completion",
        "Recorded sessions access",
        "Homework help available",
      ],
      curriculum: [
        { title: "Hello Python!", description: "First programs, print statements, variables" },
        { title: "Turtle Graphics", description: "Drawing shapes and colorful patterns" },
        { title: "User Input", description: "Interactive programs that ask questions" },
        { title: "Making Decisions", description: "If/else statements and conditionals" },
        { title: "Loops & Patterns", description: "Repeating actions to create art" },
        { title: "Capstone Project", description: "Build an interactive game or art program" },
      ],
      isFeatured: true,
      isPublished: true,
      orderIndex: 2,
    },
    {
      title: "Roblox Game Creator",
      slug: "roblox-game-creator-beginner",
      description: `Turn your child's love for Roblox into real game development skills! This exciting program teaches the fundamentals of game creation using Roblox Studio.

Students aged 7-10 will learn 3D world building, basic scripting with Lua, and game design principles while creating their own playable games. It's the perfect blend of creativity and coding!

Watch your child transform from a player into a creator!`,
      shortDescription: "Create your own Roblox games! Learn game design and basic Lua scripting.",
      thumbnailUrl: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=800",
      language: "ROBLOX",
      ageGroup: "AGES_7_10",
      level: "BEGINNER",
      sessionCount: 12,
      sessionDuration: 55,
      priceCents: 34900,
      originalPriceCents: 44900,
      features: [
        "12 live sessions (55 min each)",
        "Small class sizes (max 6 students)",
        "Build 3 complete games",
        "Publish to Roblox platform",
        "Certificate of completion",
        "Recorded sessions access",
        "Game design fundamentals",
      ],
      curriculum: [
        { title: "Roblox Studio Basics", description: "Interface, tools, and navigation" },
        { title: "Building Worlds", description: "Terrain, parts, and environment design" },
        { title: "Properties & Physics", description: "Making objects interactive" },
        { title: "Intro to Lua Scripts", description: "Your first lines of code" },
        { title: "Game Mechanics", description: "Collectibles, checkpoints, win conditions" },
        { title: "Capstone Project", description: "Create and publish your own game!" },
      ],
      isFeatured: true,
      isPublished: true,
      orderIndex: 3,
    },

    // Ages 11-14 - Level I
    {
      title: "Web Development Fundamentals",
      slug: "web-development-fundamentals-11-14",
      description: `Discover how websites are built! This foundational program teaches HTML and CSS - the core technologies behind every website you visit.

Perfect for middle schoolers with little or no coding experience. Students will build real, functional websites while learning professional web development practices.

By the end of the program, each student will have created their own multi-page website to share with the world!`,
      shortDescription: "Build your first websites with HTML & CSS. No prior experience needed!",
      thumbnailUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800",
      language: "WEB_DEVELOPMENT",
      ageGroup: "AGES_11_14",
      level: "BEGINNER",
      sessionCount: 12,
      sessionDuration: 55,
      priceCents: 29900,
      originalPriceCents: 39900,
      features: [
        "12 live sessions (55 min each)",
        "Small class sizes (max 6 students)",
        "Build 3+ websites",
        "Deploy to the internet",
        "Certificate of completion",
        "Recorded sessions access",
        "Code review & feedback",
      ],
      curriculum: [
        { title: "HTML Structure", description: "Tags, elements, and page structure" },
        { title: "Text & Links", description: "Headings, paragraphs, navigation" },
        { title: "Images & Media", description: "Adding visual content to pages" },
        { title: "CSS Styling", description: "Colors, fonts, and visual design" },
        { title: "Layout & Positioning", description: "Flexbox and page layouts" },
        { title: "Capstone Project", description: "Build and deploy your own website!" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 4,
    },
    {
      title: "Python Programming I",
      slug: "python-programming-1-11-14",
      description: `Master the fundamentals of Python, the world's most popular programming language! This program is designed for middle schoolers ready to dive into real text-based programming.

Students learn core programming concepts through hands-on projects including games, utilities, and creative applications. Python's clean syntax makes it the perfect first "real" programming language.

Build a strong foundation for future studies in computer science, data science, or software development.`,
      shortDescription: "Learn Python from the ground up. Build games, apps, and real programs!",
      thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
      language: "PYTHON",
      ageGroup: "AGES_11_14",
      level: "BEGINNER",
      sessionCount: 12,
      sessionDuration: 55,
      priceCents: 29900,
      originalPriceCents: 39900,
      features: [
        "12 live sessions (55 min each)",
        "Small class sizes (max 6 students)",
        "5+ coding projects",
        "Game development intro",
        "Certificate of completion",
        "Recorded sessions access",
        "Homework help available",
      ],
      curriculum: [
        { title: "Python Essentials", description: "Variables, data types, operators" },
        { title: "User Interaction", description: "Input/output and string formatting" },
        { title: "Conditionals", description: "If/elif/else decision making" },
        { title: "Loops", description: "For and while loops, iteration" },
        { title: "Functions", description: "Creating reusable code blocks" },
        { title: "Capstone Project", description: "Build a complete Python application!" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 5,
    },

    // Ages 15-18 - Level I
    {
      title: "Introduction to Programming",
      slug: "intro-programming-15-18",
      description: `A comprehensive introduction to programming for high schoolers! Learn the fundamentals of computer science through Python, preparing you for AP Computer Science and college-level courses.

This program covers essential concepts including algorithms, data structures basics, and problem-solving techniques used by professional developers.

Perfect for students considering a future in tech, engineering, or any field that values computational thinking.`,
      shortDescription: "College-prep programming fundamentals. Perfect for AP CS preparation!",
      thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
      language: "PYTHON",
      ageGroup: "AGES_15_18",
      level: "BEGINNER",
      sessionCount: 12,
      sessionDuration: 55,
      priceCents: 34900,
      originalPriceCents: 44900,
      features: [
        "12 live sessions (55 min each)",
        "Small class sizes (max 5 students)",
        "AP CS concepts introduction",
        "Problem-solving focus",
        "Certificate of completion",
        "Recorded sessions access",
        "College prep guidance",
      ],
      curriculum: [
        { title: "Computational Thinking", description: "Problem solving and algorithm design" },
        { title: "Python Fundamentals", description: "Syntax, variables, data types" },
        { title: "Control Flow", description: "Conditionals and loops" },
        { title: "Functions & Modules", description: "Code organization and reuse" },
        { title: "Data Structures Intro", description: "Lists, dictionaries, basic complexity" },
        { title: "Capstone Project", description: "Solve a real-world problem with code!" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 6,
    },

    // ============================================
    // CODER LEVEL II - INTERMEDIATE (Builder)
    // ============================================

    // Ages 7-10 - Level II
    {
      title: "Python Game Development",
      slug: "python-game-dev-7-10",
      description: `Take your Python skills to the next level by building real games! This intermediate program is for students who have completed Python Basics or have equivalent experience.

Using Pygame, students will create classic arcade games with graphics, sound, and player controls. It's coding with a purpose that keeps young learners engaged and excited!

Perfect follow-up to our Python Basics program.`,
      shortDescription: "Build real games with Python and Pygame! For students with Python experience.",
      thumbnailUrl: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=800",
      language: "PYTHON",
      ageGroup: "AGES_7_10",
      level: "INTERMEDIATE",
      sessionCount: 12,
      sessionDuration: 55,
      priceCents: 34900,
      originalPriceCents: 44900,
      features: [
        "12 live sessions (55 min each)",
        "Small class sizes (max 6 students)",
        "Build 3 complete games",
        "Pygame graphics library",
        "Certificate of completion",
        "Recorded sessions access",
        "Game design principles",
      ],
      curriculum: [
        { title: "Pygame Setup", description: "Windows, colors, and game loops" },
        { title: "Drawing & Animation", description: "Shapes, sprites, and movement" },
        { title: "User Input", description: "Keyboard and mouse controls" },
        { title: "Collision Detection", description: "Making objects interact" },
        { title: "Sound & Score", description: "Audio and keeping track of progress" },
        { title: "Capstone Project", description: "Design your own arcade game!" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 7,
    },
    {
      title: "Advanced Roblox Development",
      slug: "advanced-roblox-dev-7-10",
      description: `Level up your Roblox game development skills! This intermediate program dives deeper into Lua scripting and advanced game mechanics.

Students will learn professional techniques including data persistence, multiplayer features, and monetization. Build more complex and polished games that can compete on the Roblox platform!

Prerequisite: Roblox Game Creator or equivalent experience.`,
      shortDescription: "Advanced Lua scripting and complex game mechanics for experienced Roblox creators.",
      thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
      language: "ROBLOX",
      ageGroup: "AGES_7_10",
      level: "INTERMEDIATE",
      sessionCount: 12,
      sessionDuration: 55,
      priceCents: 39900,
      originalPriceCents: 49900,
      features: [
        "12 live sessions (55 min each)",
        "Small class sizes (max 6 students)",
        "Advanced Lua scripting",
        "Multiplayer features",
        "Data persistence",
        "Certificate of completion",
        "Recorded sessions access",
      ],
      curriculum: [
        { title: "Advanced Lua", description: "Tables, functions, and modules" },
        { title: "Events & Remote", description: "Client-server communication" },
        { title: "Data Stores", description: "Saving player progress" },
        { title: "UI Design", description: "Professional game interfaces" },
        { title: "Game Polish", description: "Effects, sounds, and optimization" },
        { title: "Capstone Project", description: "Build a multiplayer game experience!" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 8,
    },

    // Ages 11-14 - Level II
    {
      title: "JavaScript & Interactive Web",
      slug: "javascript-interactive-web-11-14",
      description: `Bring your websites to life with JavaScript! This intermediate program teaches the programming language that powers interactive web experiences.

Building on HTML/CSS knowledge, students will learn to create dynamic content, handle user events, and build web applications. From animations to games to utility apps - if you can imagine it, you can code it!

Prerequisite: Web Development Fundamentals or equivalent.`,
      shortDescription: "Add interactivity to websites with JavaScript. Build apps, games, and more!",
      thumbnailUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
      language: "JAVASCRIPT",
      ageGroup: "AGES_11_14",
      level: "INTERMEDIATE",
      sessionCount: 12,
      sessionDuration: 55,
      priceCents: 34900,
      originalPriceCents: 44900,
      features: [
        "12 live sessions (55 min each)",
        "Small class sizes (max 6 students)",
        "DOM manipulation mastery",
        "Interactive web apps",
        "Certificate of completion",
        "Recorded sessions access",
        "Code review & feedback",
      ],
      curriculum: [
        { title: "JavaScript Basics", description: "Variables, functions, and data types" },
        { title: "The DOM", description: "Selecting and modifying page elements" },
        { title: "Events", description: "Responding to user interactions" },
        { title: "Dynamic Content", description: "Creating and updating elements" },
        { title: "Web Storage", description: "Saving data in the browser" },
        { title: "Capstone Project", description: "Build an interactive web application!" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 9,
    },
    {
      title: "Python Programming II",
      slug: "python-programming-2-11-14",
      description: `Advance your Python skills to the next level! This program covers intermediate concepts including object-oriented programming, file handling, and API basics.

Students will tackle more complex projects and learn professional coding practices. Perfect preparation for advanced courses or self-directed learning.

Prerequisite: Python Programming I or equivalent experience.`,
      shortDescription: "Object-oriented programming, file handling, and advanced Python concepts.",
      thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
      language: "PYTHON",
      ageGroup: "AGES_11_14",
      level: "INTERMEDIATE",
      sessionCount: 12,
      sessionDuration: 55,
      priceCents: 34900,
      originalPriceCents: 44900,
      features: [
        "12 live sessions (55 min each)",
        "Small class sizes (max 6 students)",
        "Object-oriented programming",
        "File handling & APIs",
        "Certificate of completion",
        "Recorded sessions access",
        "Advanced projects",
      ],
      curriculum: [
        { title: "Advanced Functions", description: "Args, kwargs, and decorators intro" },
        { title: "Object-Oriented Basics", description: "Classes and objects" },
        { title: "OOP Continued", description: "Inheritance and encapsulation" },
        { title: "File Handling", description: "Reading, writing, and processing files" },
        { title: "APIs & JSON", description: "Getting data from web services" },
        { title: "Capstone Project", description: "Build a complete Python application!" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 10,
    },

    // Ages 15-18 - Level II
    {
      title: "Full-Stack Web Development",
      slug: "fullstack-web-dev-15-18",
      description: `Build complete web applications from front to back! This comprehensive program covers modern web development including React, Node.js, and database fundamentals.

Students will learn the skills used by professional web developers, building portfolio-worthy projects. Perfect for those considering careers in software development.

Prerequisite: Introduction to Programming or equivalent.`,
      shortDescription: "Modern web development with React and Node.js. Build full applications!",
      thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      language: "WEB_DEVELOPMENT",
      ageGroup: "AGES_15_18",
      level: "INTERMEDIATE",
      sessionCount: 18,
      sessionDuration: 75,
      priceCents: 54900,
      originalPriceCents: 69900,
      features: [
        "18 live sessions (75 min each)",
        "Small class sizes (max 5 students)",
        "React fundamentals",
        "Node.js & Express",
        "Database basics",
        "Certificate of completion",
        "Portfolio projects",
      ],
      curriculum: [
        { title: "Modern JavaScript", description: "ES6+, async/await, modules" },
        { title: "React Basics", description: "Components, props, and state" },
        { title: "React Advanced", description: "Hooks, routing, and forms" },
        { title: "Node.js & Express", description: "Building server-side applications" },
        { title: "Databases", description: "SQL/NoSQL and data persistence" },
        { title: "Capstone Project", description: "Deploy a full-stack application!" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 11,
    },
    {
      title: "Data Science with Python",
      slug: "data-science-python-15-18",
      description: `Explore the world of data science! Learn to analyze, visualize, and draw insights from data using Python's powerful data science ecosystem.

Students will work with real datasets, create visualizations, and learn the fundamentals of statistical analysis. Essential skills for careers in data science, business analytics, and research.

Prerequisite: Introduction to Programming or equivalent.`,
      shortDescription: "Analyze and visualize data with Python, Pandas, and Matplotlib.",
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      language: "PYTHON",
      ageGroup: "AGES_15_18",
      level: "INTERMEDIATE",
      sessionCount: 12,
      sessionDuration: 55,
      priceCents: 44900,
      originalPriceCents: 54900,
      features: [
        "12 live sessions (55 min each)",
        "Small class sizes (max 5 students)",
        "Real-world datasets",
        "Data visualization",
        "Statistical analysis basics",
        "Certificate of completion",
        "Portfolio projects",
      ],
      curriculum: [
        { title: "Data Science Intro", description: "NumPy and array operations" },
        { title: "Pandas Fundamentals", description: "DataFrames and data manipulation" },
        { title: "Data Cleaning", description: "Handling missing data and outliers" },
        { title: "Visualization", description: "Matplotlib and Seaborn charts" },
        { title: "Analysis Techniques", description: "Statistics and correlation" },
        { title: "Capstone Project", description: "Analyze a real-world dataset!" },
      ],
      isFeatured: true,
      isPublished: true,
      orderIndex: 12,
    },

    // ============================================
    // CODER LEVEL III - ADVANCED (Creator)
    // ============================================

    // Ages 11-14 - Level III
    {
      title: "Advanced Game Development",
      slug: "advanced-game-dev-11-14",
      description: `Master game development with advanced JavaScript techniques! This program teaches professional game development patterns using HTML5 Canvas and modern frameworks.

Students will build complex games with physics engines, particle systems, and advanced AI. Learn the techniques used in commercial game development.

Prerequisite: JavaScript & Interactive Web or equivalent.`,
      shortDescription: "Professional game development with physics, AI, and advanced graphics.",
      thumbnailUrl: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800",
      language: "GAME_DEVELOPMENT",
      ageGroup: "AGES_11_14",
      level: "ADVANCED",
      sessionCount: 16,
      sessionDuration: 75,
      priceCents: 49900,
      originalPriceCents: 64900,
      features: [
        "16 live sessions (75 min each)",
        "Small class sizes (max 5 students)",
        "Physics engines",
        "Particle systems",
        "Game AI basics",
        "Certificate of completion",
        "Portfolio-ready games",
      ],
      curriculum: [
        { title: "Game Architecture", description: "State machines and game loops" },
        { title: "Physics", description: "Velocity, acceleration, collision" },
        { title: "Particle Systems", description: "Effects and visual polish" },
        { title: "Tile Maps", description: "Level design and world building" },
        { title: "Game AI", description: "Pathfinding and enemy behavior" },
        { title: "Capstone Project", description: "Build a complete polished game!" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 13,
    },
    {
      title: "Mobile App Development",
      slug: "mobile-app-dev-11-14",
      description: `Create real mobile apps! Learn to build cross-platform applications that run on both iOS and Android using React Native.

Students will build and publish their own apps, learning UI design, navigation, and mobile-specific features. A great stepping stone to professional app development.

Prerequisite: JavaScript & Interactive Web or equivalent.`,
      shortDescription: "Build real mobile apps for iOS and Android with React Native.",
      thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
      language: "MOBILE_DEVELOPMENT",
      ageGroup: "AGES_11_14",
      level: "ADVANCED",
      sessionCount: 16,
      sessionDuration: 75,
      priceCents: 54900,
      originalPriceCents: 69900,
      features: [
        "16 live sessions (75 min each)",
        "Small class sizes (max 5 students)",
        "React Native framework",
        "Cross-platform development",
        "App store publishing",
        "Certificate of completion",
        "Portfolio-ready apps",
      ],
      curriculum: [
        { title: "React Native Basics", description: "Components and styling" },
        { title: "Navigation", description: "Screens, tabs, and stacks" },
        { title: "Data & State", description: "Managing app data" },
        { title: "Device Features", description: "Camera, location, sensors" },
        { title: "Backend Integration", description: "APIs and databases" },
        { title: "Capstone Project", description: "Build and publish your app!" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 14,
    },

    // Ages 15-18 - Level III
    {
      title: "AI & Machine Learning",
      slug: "ai-machine-learning-15-18",
      description: `Dive into the future of technology! This advanced program covers the fundamentals of artificial intelligence and machine learning using Python and TensorFlow.

Students will build real AI projects including image classifiers, chatbots, and predictive models. Perfect preparation for college-level AI courses or careers in tech.

Prerequisite: Data Science with Python or equivalent.`,
      shortDescription: "Build AI models and machine learning applications. The future starts here!",
      thumbnailUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      language: "AI_ML",
      ageGroup: "AGES_15_18",
      level: "ADVANCED",
      sessionCount: 24,
      sessionDuration: 90,
      priceCents: 79900,
      originalPriceCents: 99900,
      features: [
        "24 live sessions (90 min each)",
        "Small class sizes (max 4 students)",
        "TensorFlow & PyTorch intro",
        "Neural networks",
        "Computer vision",
        "NLP basics",
        "Certificate of completion",
        "Career mentorship",
      ],
      curriculum: [
        { title: "ML Fundamentals", description: "Supervised learning, algorithms" },
        { title: "Neural Networks", description: "Building and training networks" },
        { title: "Deep Learning", description: "CNNs and advanced architectures" },
        { title: "Computer Vision", description: "Image classification and detection" },
        { title: "NLP", description: "Text analysis and generation" },
        { title: "Capstone Project", description: "Build an AI application!" },
      ],
      isFeatured: true,
      isPublished: true,
      orderIndex: 15,
    },
    {
      title: "DevOps & Software Engineering",
      slug: "devops-software-engineering-15-18",
      description: `Learn professional software engineering practices! This program covers version control, testing, CI/CD, and cloud deployment - skills every professional developer needs.

Students will learn to work like a professional development team, using Git, Docker, and cloud services. Perfect for those serious about careers in software engineering.

Prerequisite: Full-Stack Web Development or equivalent.`,
      shortDescription: "Professional development practices: Git, Docker, CI/CD, and cloud deployment.",
      thumbnailUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800",
      language: "CAREER_PREP",
      ageGroup: "AGES_15_18",
      level: "ADVANCED",
      sessionCount: 16,
      sessionDuration: 75,
      priceCents: 54900,
      originalPriceCents: 69900,
      features: [
        "16 live sessions (75 min each)",
        "Small class sizes (max 5 students)",
        "Git & GitHub mastery",
        "Docker containerization",
        "CI/CD pipelines",
        "Cloud deployment",
        "Certificate of completion",
        "Career guidance",
      ],
      curriculum: [
        { title: "Git Mastery", description: "Branches, merges, workflows" },
        { title: "Testing", description: "Unit tests, integration tests" },
        { title: "Docker", description: "Containers and images" },
        { title: "CI/CD", description: "Automated testing and deployment" },
        { title: "Cloud Services", description: "AWS/GCP basics, deployment" },
        { title: "Capstone Project", description: "Deploy a production application!" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 16,
    },
    {
      title: "Capstone: Tech Portfolio",
      slug: "capstone-tech-portfolio-15-18",
      description: `Showcase your skills with a professional portfolio! This capstone program guides students through building a comprehensive tech portfolio with multiple projects.

Work with a mentor to plan, build, and present projects that demonstrate your abilities. Perfect for college applications, internships, or starting your tech career.

For students who have completed multiple advanced courses.`,
      shortDescription: "Build a professional portfolio for college applications and careers.",
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      language: "CAREER_PREP",
      ageGroup: "AGES_15_18",
      level: "ADVANCED",
      sessionCount: 12,
      sessionDuration: 90,
      priceCents: 59900,
      originalPriceCents: 79900,
      features: [
        "12 live sessions (90 min each)",
        "1-on-1 mentorship",
        "Portfolio website",
        "3+ showcase projects",
        "Interview preparation",
        "Certificate of completion",
        "LinkedIn optimization",
        "Resume review",
      ],
      curriculum: [
        { title: "Portfolio Planning", description: "Strategy and project selection" },
        { title: "Project Development", description: "Guided project building" },
        { title: "Code Quality", description: "Best practices and documentation" },
        { title: "Portfolio Website", description: "Building your online presence" },
        { title: "Presentation Skills", description: "Talking about your work" },
        { title: "Career Preparation", description: "Interviews, applications, next steps" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 17,
    },

    // ============================================
    // CODER LEVEL IV - EXPERT (Innovator)
    // ============================================

    // Ages 11-14 - Level IV
    {
      title: "Full-Stack JavaScript Mastery",
      slug: "fullstack-js-mastery-11-14",
      description: `Become a full-stack JavaScript developer! This expert-level program covers advanced React patterns, Node.js backends, and database integration for building production-ready applications.

Students will architect and build complete applications from scratch, learning professional development workflows, testing, and deployment.

Prerequisite: Advanced Game Development or Mobile App Development.`,
      shortDescription: "Master full-stack development with React, Node.js, and databases.",
      thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      language: "WEB_DEVELOPMENT",
      ageGroup: "AGES_11_14",
      level: "EXPERT",
      sessionCount: 20,
      sessionDuration: 75,
      priceCents: 69900,
      originalPriceCents: 89900,
      features: [
        "20 live sessions (75 min each)",
        "Small class sizes (max 4 students)",
        "Advanced React patterns",
        "Backend development",
        "Database design",
        "Authentication systems",
        "Certificate of completion",
        "Portfolio projects",
      ],
      curriculum: [
        { title: "Advanced React", description: "Context, hooks, state management" },
        { title: "API Design", description: "RESTful services, GraphQL intro" },
        { title: "Database Design", description: "SQL, relationships, queries" },
        { title: "Authentication", description: "User systems, JWT, OAuth" },
        { title: "Testing & Quality", description: "Unit tests, integration tests" },
        { title: "Capstone Project", description: "Build a production-ready app!" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 18,
    },
    {
      title: "Competitive Programming",
      slug: "competitive-programming-11-14",
      description: `Sharpen your problem-solving skills for coding competitions! Learn algorithms, data structures, and techniques used in competitive programming contests.

Prepare for competitions like USACO, CodeForces, and LeetCode challenges. Perfect for students who want to excel at technical interviews and programming competitions.

Prerequisite: Python Programming II or equivalent algorithmic experience.`,
      shortDescription: "Master algorithms and data structures for coding competitions.",
      thumbnailUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800",
      language: "PYTHON",
      ageGroup: "AGES_11_14",
      level: "EXPERT",
      sessionCount: 16,
      sessionDuration: 75,
      priceCents: 59900,
      originalPriceCents: 74900,
      features: [
        "16 live sessions (75 min each)",
        "Small class sizes (max 5 students)",
        "Algorithm mastery",
        "Competition strategies",
        "Practice contests",
        "Certificate of completion",
        "USACO preparation",
      ],
      curriculum: [
        { title: "Time Complexity", description: "Big O analysis, optimization" },
        { title: "Sorting & Searching", description: "Binary search, sorting algorithms" },
        { title: "Dynamic Programming", description: "Memoization, tabulation" },
        { title: "Graph Algorithms", description: "BFS, DFS, shortest paths" },
        { title: "Advanced Techniques", description: "Greedy, divide and conquer" },
        { title: "Mock Competitions", description: "Timed practice contests" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 19,
    },

    // Ages 15-18 - Level IV
    {
      title: "Cloud Architecture & AWS",
      slug: "cloud-architecture-aws-15-18",
      description: `Master cloud computing with Amazon Web Services! Learn to design, deploy, and manage scalable applications in the cloud.

This expert program covers EC2, S3, Lambda, databases, and infrastructure as code. Prepare for AWS certifications while building real cloud applications.

Prerequisite: DevOps & Software Engineering or equivalent.`,
      shortDescription: "Design and deploy scalable cloud applications with AWS.",
      thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      language: "CAREER_PREP",
      ageGroup: "AGES_15_18",
      level: "EXPERT",
      sessionCount: 18,
      sessionDuration: 90,
      priceCents: 79900,
      originalPriceCents: 99900,
      features: [
        "18 live sessions (90 min each)",
        "Small class sizes (max 4 students)",
        "AWS Free Tier projects",
        "Infrastructure as Code",
        "Serverless architecture",
        "Certificate of completion",
        "AWS cert preparation",
      ],
      curriculum: [
        { title: "Cloud Fundamentals", description: "AWS services overview, IAM" },
        { title: "Compute & Storage", description: "EC2, S3, EBS, Lambda" },
        { title: "Databases", description: "RDS, DynamoDB, ElastiCache" },
        { title: "Networking", description: "VPC, security groups, load balancing" },
        { title: "Infrastructure as Code", description: "CloudFormation, Terraform intro" },
        { title: "Capstone Project", description: "Deploy a scalable cloud application!" },
      ],
      isFeatured: true,
      isPublished: true,
      orderIndex: 20,
    },
    {
      title: "Advanced AI & Deep Learning",
      slug: "advanced-ai-deep-learning-15-18",
      description: `Push the boundaries of AI! This expert program dives deep into neural network architectures, reinforcement learning, and cutting-edge AI techniques.

Build sophisticated AI systems including transformers, GANs, and autonomous agents. Perfect for students serious about AI research or industry careers.

Prerequisite: AI & Machine Learning or equivalent.`,
      shortDescription: "Advanced neural networks, transformers, and reinforcement learning.",
      thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
      language: "AI_ML",
      ageGroup: "AGES_15_18",
      level: "EXPERT",
      sessionCount: 24,
      sessionDuration: 90,
      priceCents: 99900,
      originalPriceCents: 129900,
      features: [
        "24 live sessions (90 min each)",
        "Small class sizes (max 3 students)",
        "PyTorch deep dive",
        "Transformer models",
        "Reinforcement learning",
        "Research paper reading",
        "Certificate of completion",
        "Publication guidance",
      ],
      curriculum: [
        { title: "Advanced Architectures", description: "ResNets, attention mechanisms" },
        { title: "Transformers", description: "BERT, GPT, vision transformers" },
        { title: "Generative AI", description: "GANs, VAEs, diffusion models" },
        { title: "Reinforcement Learning", description: "Q-learning, policy gradients" },
        { title: "MLOps", description: "Model deployment, monitoring" },
        { title: "Research Project", description: "Original AI research!" },
      ],
      isFeatured: true,
      isPublished: true,
      orderIndex: 21,
    },
    {
      title: "Blockchain & Web3 Development",
      slug: "blockchain-web3-dev-15-18",
      description: `Enter the world of decentralized applications! Learn to build on blockchain platforms, create smart contracts, and develop Web3 applications.

Master Solidity, Ethereum development, and DeFi concepts while building real decentralized applications. Perfect for students interested in the future of the web.

Prerequisite: Full-Stack Web Development or equivalent.`,
      shortDescription: "Build decentralized apps with Ethereum and smart contracts.",
      thumbnailUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
      language: "WEB_DEVELOPMENT",
      ageGroup: "AGES_15_18",
      level: "EXPERT",
      sessionCount: 16,
      sessionDuration: 90,
      priceCents: 74900,
      originalPriceCents: 94900,
      features: [
        "16 live sessions (90 min each)",
        "Small class sizes (max 4 students)",
        "Solidity programming",
        "Smart contract development",
        "DeFi fundamentals",
        "NFT creation",
        "Certificate of completion",
      ],
      curriculum: [
        { title: "Blockchain Fundamentals", description: "Distributed systems, consensus" },
        { title: "Ethereum & Solidity", description: "Smart contract basics" },
        { title: "Advanced Contracts", description: "Security, gas optimization" },
        { title: "DeFi Concepts", description: "DEXs, lending, tokens" },
        { title: "Frontend Integration", description: "Web3.js, wallet connection" },
        { title: "Capstone Project", description: "Launch your own dApp!" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 22,
    },

    // ============================================
    // CODER LEVEL V - MASTER (Industry-Ready)
    // ============================================

    // Ages 15-18 - Level V
    {
      title: "System Design & Architecture",
      slug: "system-design-architecture-15-18",
      description: `Learn to design systems that scale! This master-level program teaches the architecture patterns used by top tech companies like Google, Netflix, and Amazon.

Cover distributed systems, microservices, caching, and scalability patterns. Essential knowledge for senior engineering roles and technical interviews.

Prerequisite: Cloud Architecture & AWS or equivalent experience.`,
      shortDescription: "Design scalable systems like the pros at top tech companies.",
      thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
      language: "CAREER_PREP",
      ageGroup: "AGES_15_18",
      level: "MASTER",
      sessionCount: 16,
      sessionDuration: 90,
      priceCents: 89900,
      originalPriceCents: 119900,
      features: [
        "16 live sessions (90 min each)",
        "1-on-1 mentorship",
        "Real-world case studies",
        "Interview preparation",
        "Architecture documentation",
        "Certificate of completion",
        "Industry mentors",
      ],
      curriculum: [
        { title: "Scalability Basics", description: "Load balancing, caching, CDNs" },
        { title: "Database Scaling", description: "Sharding, replication, consistency" },
        { title: "Microservices", description: "Service design, communication" },
        { title: "Message Queues", description: "Async processing, event-driven" },
        { title: "Case Studies", description: "Twitter, Uber, Netflix designs" },
        { title: "Design Interviews", description: "Practice system design problems" },
      ],
      isFeatured: true,
      isPublished: true,
      orderIndex: 23,
    },
    {
      title: "AI Research & Publication",
      slug: "ai-research-publication-15-18",
      description: `Contribute to the field of AI! This master program guides students through conducting original AI research and preparing for academic publication.

Work with experienced mentors on cutting-edge problems in machine learning, computer vision, or NLP. Perfect for students targeting top CS programs or research careers.

Prerequisite: Advanced AI & Deep Learning.`,
      shortDescription: "Conduct original AI research and prepare for academic publication.",
      thumbnailUrl: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=800",
      language: "AI_ML",
      ageGroup: "AGES_15_18",
      level: "MASTER",
      sessionCount: 24,
      sessionDuration: 90,
      priceCents: 129900,
      originalPriceCents: 159900,
      features: [
        "24 live sessions (90 min each)",
        "1-on-1 research mentorship",
        "Literature review guidance",
        "Experiment design",
        "Paper writing workshop",
        "Conference submission support",
        "Industry connections",
      ],
      curriculum: [
        { title: "Research Methods", description: "Finding and evaluating papers" },
        { title: "Problem Selection", description: "Identifying research questions" },
        { title: "Experiment Design", description: "Reproducibility, baselines" },
        { title: "Implementation", description: "Building your research system" },
        { title: "Paper Writing", description: "Academic writing, LaTeX" },
        { title: "Presentation", description: "Defending your research" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 24,
    },
    {
      title: "Startup Engineering",
      slug: "startup-engineering-15-18",
      description: `Build like a startup! Learn the engineering practices, tools, and mindset needed to launch and scale a tech startup.

Cover rapid prototyping, MVP development, growth engineering, and the technical decisions that make or break startups. Includes mentorship from startup founders.

Prerequisite: Full-Stack Web Development + DevOps or equivalent.`,
      shortDescription: "Learn to build, launch, and scale like a tech startup.",
      thumbnailUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
      language: "CAREER_PREP",
      ageGroup: "AGES_15_18",
      level: "MASTER",
      sessionCount: 18,
      sessionDuration: 90,
      priceCents: 99900,
      originalPriceCents: 129900,
      features: [
        "18 live sessions (90 min each)",
        "Startup founder mentors",
        "MVP development",
        "Growth engineering",
        "Pitch preparation",
        "Certificate of completion",
        "Investor introductions",
      ],
      curriculum: [
        { title: "Startup Mindset", description: "Move fast, validate ideas" },
        { title: "MVP Development", description: "Build the smallest viable product" },
        { title: "Tech Stack Decisions", description: "Choosing the right tools" },
        { title: "Growth Engineering", description: "Analytics, A/B testing, virality" },
        { title: "Scaling Challenges", description: "Technical debt, hiring, ops" },
        { title: "Capstone", description: "Launch your own startup project!" },
      ],
      isFeatured: false,
      isPublished: true,
      orderIndex: 25,
    },
    {
      title: "Cybersecurity & Ethical Hacking",
      slug: "cybersecurity-ethical-hacking-15-18",
      description: `Become a security expert! Learn offensive and defensive security techniques used by cybersecurity professionals and ethical hackers.

Cover penetration testing, vulnerability assessment, secure coding, and incident response. Prepare for careers in cybersecurity or certifications like CompTIA Security+.

Prerequisite: DevOps & Software Engineering or equivalent.`,
      shortDescription: "Master offensive and defensive cybersecurity techniques.",
      thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
      language: "CAREER_PREP",
      ageGroup: "AGES_15_18",
      level: "MASTER",
      sessionCount: 20,
      sessionDuration: 90,
      priceCents: 94900,
      originalPriceCents: 119900,
      features: [
        "20 live sessions (90 min each)",
        "Hands-on CTF challenges",
        "Penetration testing labs",
        "Secure coding practices",
        "Certificate of completion",
        "Security+ prep",
        "Industry tools training",
      ],
      curriculum: [
        { title: "Security Fundamentals", description: "CIA triad, threat modeling" },
        { title: "Network Security", description: "Protocols, firewalls, monitoring" },
        { title: "Web Security", description: "OWASP Top 10, XSS, SQLi" },
        { title: "Penetration Testing", description: "Reconnaissance, exploitation" },
        { title: "Secure Development", description: "Code review, SAST/DAST" },
        { title: "Incident Response", description: "Detection, analysis, recovery" },
      ],
      isFeatured: true,
      isPublished: true,
      orderIndex: 26,
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
    console.log(`✅ ${created.level.padEnd(12)} | ${created.ageGroup.padEnd(10)} | ${created.title}`);
  }

  console.log("\n✨ Curriculum seeding complete!");
  console.log("\n📊 Summary:");
  console.log("  BEGINNER (Level I):      6 programs");
  console.log("  INTERMEDIATE (Level II): 6 programs");
  console.log("  ADVANCED (Level III):    5 programs");
  console.log("  EXPERT (Level IV):       5 programs");
  console.log("  MASTER (Level V):        4 programs");
  console.log("  ─────────────────────────────────");
  console.log("  Total:                  26 programs\n");

  console.log("📝 Age Group Distribution:");
  console.log("  Ages 7-10:   5 programs");
  console.log("  Ages 11-14:  8 programs");
  console.log("  Ages 15-18: 13 programs\n");
}

seedCurriculum()
  .catch((e) => {
    console.error("Error seeding curriculum:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
