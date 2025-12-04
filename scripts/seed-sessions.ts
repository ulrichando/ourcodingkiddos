import prisma from "../lib/prisma";

/**
 * Seeds upcoming class sessions for the curriculum schedule
 */

async function seedSessions() {
  console.log("📅 Seeding Class Sessions...\n");

  // Get dates for the next few weeks
  const now = new Date();
  const getNextDate = (daysFromNow: number, hour: number, minute: number = 0) => {
    const date = new Date(now);
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  const sessions = [
    // Week 1 - Starting this week
    {
      title: "Intro to Scratch - Session 1",
      description: "Learn the basics of visual programming with Scratch",
      sessionType: "GROUP",
      language: "GAME_DEVELOPMENT",
      ageGroup: "AGES_7_10",
      startTime: getNextDate(2, 16, 0), // 4:00 PM
      durationMinutes: 55,
      maxStudents: 6,
      enrolledCount: 3,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "Python Basics for Kids",
      description: "Introduction to Python programming for young coders",
      sessionType: "GROUP",
      language: "PYTHON",
      ageGroup: "AGES_7_10",
      startTime: getNextDate(2, 17, 0), // 5:00 PM
      durationMinutes: 55,
      maxStudents: 6,
      enrolledCount: 4,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "Web Development Fundamentals",
      description: "Build your first website with HTML & CSS",
      sessionType: "GROUP",
      language: "WEB_DEVELOPMENT",
      ageGroup: "AGES_11_14",
      startTime: getNextDate(3, 16, 30), // 4:30 PM
      durationMinutes: 55,
      maxStudents: 6,
      enrolledCount: 5,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "Roblox Game Creator Workshop",
      description: "Create your own Roblox game from scratch",
      sessionType: "WORKSHOP",
      language: "ROBLOX",
      ageGroup: "AGES_7_10",
      startTime: getNextDate(3, 10, 0), // 10:00 AM (weekend)
      durationMinutes: 90,
      maxStudents: 8,
      enrolledCount: 6,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "JavaScript & Interactive Web",
      description: "Add interactivity to your websites with JavaScript",
      sessionType: "GROUP",
      language: "JAVASCRIPT",
      ageGroup: "AGES_11_14",
      startTime: getNextDate(4, 17, 0), // 5:00 PM
      durationMinutes: 55,
      maxStudents: 6,
      enrolledCount: 2,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },

    // Week 2
    {
      title: "Python Programming I",
      description: "Learn Python from the ground up",
      sessionType: "GROUP",
      language: "PYTHON",
      ageGroup: "AGES_11_14",
      startTime: getNextDate(7, 16, 0), // 4:00 PM
      durationMinutes: 55,
      maxStudents: 6,
      enrolledCount: 4,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "AI & Machine Learning Explorer",
      description: "Introduction to artificial intelligence concepts",
      sessionType: "GROUP",
      language: "AI_ML",
      ageGroup: "AGES_15_18",
      startTime: getNextDate(8, 18, 0), // 6:00 PM
      durationMinutes: 90,
      maxStudents: 5,
      enrolledCount: 3,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "Full-Stack Web Development",
      description: "Build complete web applications with React & Node.js",
      sessionType: "GROUP",
      language: "WEB_DEVELOPMENT",
      ageGroup: "AGES_15_18",
      startTime: getNextDate(9, 17, 30), // 5:30 PM
      durationMinutes: 75,
      maxStudents: 5,
      enrolledCount: 4,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "Intro to Programming (High School)",
      description: "College-prep programming fundamentals with Python",
      sessionType: "GROUP",
      language: "PYTHON",
      ageGroup: "AGES_15_18",
      startTime: getNextDate(9, 16, 0), // 4:00 PM
      durationMinutes: 55,
      maxStudents: 5,
      enrolledCount: 2,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "Python Game Development",
      description: "Build games with Python and Pygame",
      sessionType: "GROUP",
      language: "PYTHON",
      ageGroup: "AGES_7_10",
      startTime: getNextDate(10, 16, 0), // 4:00 PM
      durationMinutes: 55,
      maxStudents: 6,
      enrolledCount: 5,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },

    // Week 3
    {
      title: "Advanced Roblox Development",
      description: "Advanced Lua scripting and game mechanics",
      sessionType: "GROUP",
      language: "ROBLOX",
      ageGroup: "AGES_7_10",
      startTime: getNextDate(14, 16, 30), // 4:30 PM
      durationMinutes: 55,
      maxStudents: 6,
      enrolledCount: 4,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "Data Science with Python",
      description: "Analyze data with Pandas and visualization",
      sessionType: "GROUP",
      language: "PYTHON",
      ageGroup: "AGES_15_18",
      startTime: getNextDate(15, 18, 0), // 6:00 PM
      durationMinutes: 55,
      maxStudents: 5,
      enrolledCount: 3,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "Mobile App Development",
      description: "Build mobile apps with React Native",
      sessionType: "GROUP",
      language: "MOBILE_DEVELOPMENT",
      ageGroup: "AGES_11_14",
      startTime: getNextDate(16, 17, 0), // 5:00 PM
      durationMinutes: 75,
      maxStudents: 5,
      enrolledCount: 3,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "Cybersecurity Basics Workshop",
      description: "Introduction to ethical hacking and security",
      sessionType: "WORKSHOP",
      language: "CAREER_PREP",
      ageGroup: "AGES_15_18",
      startTime: getNextDate(17, 10, 0), // 10:00 AM (weekend)
      durationMinutes: 120,
      maxStudents: 8,
      enrolledCount: 5,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "Competitive Programming Practice",
      description: "Algorithm practice for coding competitions",
      sessionType: "GROUP",
      language: "PYTHON",
      ageGroup: "AGES_11_14",
      startTime: getNextDate(18, 17, 0), // 5:00 PM
      durationMinutes: 75,
      maxStudents: 5,
      enrolledCount: 4,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },

    // Special workshops
    {
      title: "Summer Coding Camp Info Session",
      description: "Learn about our upcoming summer coding camps",
      sessionType: "WORKSHOP",
      language: "CAREER_PREP",
      ageGroup: "AGES_7_10",
      startTime: getNextDate(10, 11, 0), // 11:00 AM (weekend)
      durationMinutes: 60,
      maxStudents: 20,
      enrolledCount: 8,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "Parent & Child Coding Hour",
      description: "A fun coding session for parents and kids together",
      sessionType: "WORKSHOP",
      language: "GAME_DEVELOPMENT",
      ageGroup: "AGES_7_10",
      startTime: getNextDate(17, 14, 0), // 2:00 PM (weekend)
      durationMinutes: 60,
      maxStudents: 10,
      enrolledCount: 6,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "Cloud Architecture Deep Dive",
      description: "Advanced AWS concepts and architecture patterns",
      sessionType: "GROUP",
      language: "CAREER_PREP",
      ageGroup: "AGES_15_18",
      startTime: getNextDate(21, 18, 0), // 6:00 PM
      durationMinutes: 90,
      maxStudents: 4,
      enrolledCount: 2,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "AI Project Showcase",
      description: "Students present their AI/ML projects",
      sessionType: "WORKSHOP",
      language: "AI_ML",
      ageGroup: "AGES_15_18",
      startTime: getNextDate(24, 17, 0), // 5:00 PM
      durationMinutes: 90,
      maxStudents: 15,
      enrolledCount: 10,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
    {
      title: "Web Development Project Day",
      description: "Work on your web projects with instructor support",
      sessionType: "WORKSHOP",
      language: "WEB_DEVELOPMENT",
      ageGroup: "AGES_11_14",
      startTime: getNextDate(24, 10, 0), // 10:00 AM (weekend)
      durationMinutes: 180,
      maxStudents: 12,
      enrolledCount: 7,
      priceCents: 0,
      status: "SCHEDULED",
      instructorEmail: "instructor@ourcodingkiddos.com",
    },
  ];

  // Delete existing scheduled sessions (for clean re-seed)
  await prisma.classSession.deleteMany({
    where: {
      status: "SCHEDULED",
      startTime: { gte: now },
    },
  });

  for (const session of sessions) {
    const created = await prisma.classSession.create({
      data: {
        title: session.title,
        description: session.description,
        sessionType: session.sessionType as any,
        language: session.language as any,
        ageGroup: session.ageGroup as any,
        startTime: session.startTime,
        durationMinutes: session.durationMinutes,
        maxStudents: session.maxStudents,
        enrolledCount: session.enrolledCount,
        priceCents: session.priceCents,
        status: session.status as any,
        instructorEmail: session.instructorEmail,
      },
    });

    const dateStr = session.startTime.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const timeStr = session.startTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    console.log(`✅ ${dateStr} ${timeStr.padStart(8)} | ${session.ageGroup.padEnd(10)} | ${session.title}`);
  }

  console.log(`\n✨ Created ${sessions.length} class sessions!\n`);

  console.log("📊 Sessions by Age Group:");
  const ages710 = sessions.filter(s => s.ageGroup === "AGES_7_10").length;
  const ages1114 = sessions.filter(s => s.ageGroup === "AGES_11_14").length;
  const ages1518 = sessions.filter(s => s.ageGroup === "AGES_15_18").length;
  console.log(`  Ages 7-10:  ${ages710} sessions`);
  console.log(`  Ages 11-14: ${ages1114} sessions`);
  console.log(`  Ages 15-18: ${ages1518} sessions\n`);
}

seedSessions()
  .catch((e) => {
    console.error("Error seeding sessions:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
