import prisma from "../lib/prisma";

async function seedSampleContent() {
  console.log("🌱 Seeding sample content...");

  // Get or create an admin user for authoring
  let adminUser = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: "admin@ourcodingkiddos.com",
        name: "Admin",
        role: "ADMIN",
      },
    });
    console.log("✅ Created admin user");
  }

  // Get or create a student profile for projects
  let studentProfile = await prisma.studentProfile.findFirst();

  if (!studentProfile) {
    const studentUser = await prisma.user.create({
      data: {
        email: "student@example.com",
        name: "Alex Johnson",
        role: "STUDENT",
      },
    });
    studentProfile = await prisma.studentProfile.create({
      data: {
        userId: studentUser.id,
        name: "Alex Johnson",
        ageGroup: "AGES_11_14",
        currentLevel: 5,
      },
    });
    console.log("✅ Created student profile");
  }

  // Create 2 Blog Posts
  const blogPost1 = await prisma.blogPost.upsert({
    where: { slug: "getting-started-with-python-for-kids" },
    update: {},
    create: {
      title: "Getting Started with Python: A Fun Guide for Kids",
      slug: "getting-started-with-python-for-kids",
      excerpt: "Python is one of the best programming languages for beginners. Learn why it's perfect for young coders and how to get started today!",
      content: `# Getting Started with Python: A Fun Guide for Kids

Python is like the friendly neighbor of programming languages - it's welcoming, easy to understand, and incredibly powerful!

## Why Python is Perfect for Kids

1. **Easy to Read**: Python code looks almost like English
2. **No Complicated Syntax**: Unlike other languages, Python doesn't use confusing brackets everywhere
3. **Instant Results**: You can see your code work right away
4. **Fun Projects**: Make games, animations, and even simple AI!

## Your First Python Program

Here's the classic "Hello World" program:

\`\`\`python
print("Hello, World!")
\`\`\`

That's it! Just one line and you've written your first program.

## Fun Project Ideas

- **Number Guessing Game**: The computer picks a number and you try to guess it
- **Simple Calculator**: Add, subtract, multiply, and divide
- **Mad Libs Generator**: Create funny stories with user input
- **Rock Paper Scissors**: Play against the computer

## Next Steps

1. Install Python on your computer
2. Try the interactive Python shell
3. Write your first few programs
4. Join one of our Python courses!

Happy coding! 🐍`,
      featuredImage: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
      authorEmail: adminUser.email,
      authorName: adminUser.name || "Admin",
      authorRole: "ADMIN",
      category: "TUTORIAL",
      tags: ["python", "beginners", "kids coding", "tutorial"],
      isPublished: true,
      isFeatured: true,
      viewCount: 156,
      publishedAt: new Date("2024-11-15"),
    },
  });
  console.log("✅ Created blog post 1:", blogPost1.title);

  const blogPost2 = await prisma.blogPost.upsert({
    where: { slug: "student-spotlight-emma-builds-weather-app" },
    update: {},
    create: {
      title: "Student Spotlight: Emma's Amazing Weather App",
      slug: "student-spotlight-emma-builds-weather-app",
      excerpt: "Meet Emma, a 12-year-old coder who built her own weather application using JavaScript and APIs. Her story will inspire you!",
      content: `# Student Spotlight: Emma's Amazing Weather App

We're thrilled to feature Emma, one of our outstanding students who has been learning to code with us for just 6 months!

## Meet Emma

Emma is a 12-year-old from Seattle who started coding because she wanted to "make cool stuff on the computer." Little did she know, she'd be building full applications in no time!

## The Weather App Project

Emma's weather app does some amazing things:

- **Real-time Weather Data**: Shows current temperature, humidity, and conditions
- **5-Day Forecast**: Plan your week with accurate predictions
- **Beautiful UI**: Custom-designed interface with weather icons
- **Location Search**: Look up weather anywhere in the world

## How She Built It

Emma used skills she learned in our Web Development program:

1. **HTML & CSS** for the structure and styling
2. **JavaScript** for the functionality
3. **Weather API** to fetch real data
4. **Local Storage** to save favorite locations

## Emma's Advice for New Coders

> "Don't be afraid to make mistakes! Every error message is just the computer trying to help you learn. And when your code finally works, it feels amazing!" - Emma

## What's Next?

Emma is now learning React and plans to add more features to her app, including weather alerts and a dark mode theme.

**Congratulations, Emma! We can't wait to see what you build next!** 🌟`,
      featuredImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      authorEmail: adminUser.email,
      authorName: adminUser.name || "Admin",
      authorRole: "ADMIN",
      category: "STUDENT_SPOTLIGHT",
      tags: ["student spotlight", "javascript", "web development", "projects"],
      isPublished: true,
      isFeatured: false,
      viewCount: 89,
      publishedAt: new Date("2024-11-20"),
    },
  });
  console.log("✅ Created blog post 2:", blogPost2.title);

  // Create 2 Student Projects
  const project1 = await prisma.studentProject.upsert({
    where: { id: "sample-project-1" },
    update: {},
    create: {
      id: "sample-project-1",
      studentProfileId: studentProfile.id,
      title: "Space Invaders Game",
      description: "A classic Space Invaders arcade game built with Python and Pygame. Features multiple levels, power-ups, and a high score system. This was my first game project and I learned so much about game loops, collision detection, and sprite animation!",
      githubUrl: "https://github.com/alexj/space-invaders",
      demoUrl: "https://replit.com/@alexj/space-invaders",
      thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
      language: "PYTHON",
      tags: ["game", "pygame", "arcade", "python"],
      isPublished: true,
      isApproved: true,
      isFeatured: true,
      viewCount: 234,
    },
  });
  console.log("✅ Created project 1:", project1.title);

  const project2 = await prisma.studentProject.upsert({
    where: { id: "sample-project-2" },
    update: {},
    create: {
      id: "sample-project-2",
      studentProfileId: studentProfile.id,
      title: "Personal Portfolio Website",
      description: "My personal portfolio website showcasing my coding projects and achievements. Built with HTML, CSS, and JavaScript. Features a responsive design, smooth animations, and a contact form. I'm really proud of the dark mode toggle I implemented!",
      githubUrl: "https://github.com/alexj/portfolio",
      demoUrl: "https://alexj-portfolio.netlify.app",
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      language: "HTML",
      tags: ["portfolio", "web development", "html", "css", "javascript"],
      isPublished: true,
      isApproved: true,
      isFeatured: false,
      viewCount: 127,
    },
  });
  console.log("✅ Created project 2:", project2.title);

  // Get or create a parent user for commenting
  let parentUser = await prisma.user.findFirst({
    where: { role: "PARENT" },
  });

  if (!parentUser) {
    parentUser = await prisma.user.create({
      data: {
        email: "parent@example.com",
        name: "Sarah Miller",
        role: "PARENT",
      },
    });
    console.log("✅ Created parent user");
  }

  // Create a comment on blog post 1
  const comment = await prisma.comment.upsert({
    where: { id: "sample-comment-1" },
    update: {},
    create: {
      id: "sample-comment-1",
      content: "This is such a helpful guide! My son just started learning Python and this article gave him some great project ideas. He's already working on the number guessing game. Thank you for making coding accessible and fun for kids! 🎉",
      authorEmail: parentUser.email,
      authorName: parentUser.name || "Parent",
      authorRole: "PARENT",
      blogPostId: blogPost1.id,
      isApproved: true,
    },
  });
  console.log("✅ Created comment on blog post");

  // Create a like on the comment
  await prisma.like.upsert({
    where: {
      userEmail_commentId: {
        userEmail: adminUser.email,
        commentId: comment.id,
      },
    },
    update: {},
    create: {
      userEmail: adminUser.email,
      commentId: comment.id,
    },
  });
  console.log("✅ Created like on comment");

  // Also create a like on the blog post
  await prisma.like.upsert({
    where: {
      userEmail_blogPostId: {
        userEmail: parentUser.email,
        blogPostId: blogPost1.id,
      },
    },
    update: {},
    create: {
      userEmail: parentUser.email,
      blogPostId: blogPost1.id,
    },
  });
  console.log("✅ Created like on blog post");

  // Create a like on project 1
  await prisma.like.upsert({
    where: {
      userEmail_studentProjectId: {
        userEmail: parentUser.email,
        studentProjectId: project1.id,
      },
    },
    update: {},
    create: {
      userEmail: parentUser.email,
      studentProjectId: project1.id,
    },
  });
  console.log("✅ Created like on project");

  console.log("\n✨ Sample content seeding complete!");
  console.log("\nCreated:");
  console.log("  - 2 Blog posts (1 featured)");
  console.log("  - 2 Student projects (1 featured)");
  console.log("  - 1 Comment with a like");
  console.log("  - Additional likes on blog post and project");
}

seedSampleContent()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
