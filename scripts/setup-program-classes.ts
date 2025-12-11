import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupProgramClasses() {
  console.log('\n=== Setting Up Program Classes ===\n');

  // Get the programs
  const introProgram = await prisma.program.findFirst({
    where: { title: 'Introduction to Programming' },
  });

  const jsGameProgram = await prisma.program.findFirst({
    where: { title: 'JavaScript Game Development' },
  });

  if (!introProgram || !jsGameProgram) {
    console.log('❌ Programs not found!');
    return;
  }

  console.log(`✅ Found programs:`);
  console.log(`   - ${introProgram.title} (ID: ${introProgram.id})`);
  console.log(`   - ${jsGameProgram.title} (ID: ${jsGameProgram.id})`);

  const instructorEmail = 'demo.instructor@example.com';

  // Delete all existing classes to start fresh
  const deleted = await prisma.classSession.deleteMany({
    where: { instructorEmail },
  });
  console.log(`\n🗑️  Deleted ${deleted.count} existing classes\n`);

  // Get program start dates
  const introStartDate = introProgram.startDate || new Date('2025-08-30');
  const jsGameStartDate = jsGameProgram.startDate || new Date('2025-08-02');

  // Find the first Saturday after the start date for Intro to Programming
  const firstIntroSaturday = new Date(introStartDate);
  while (firstIntroSaturday.getDay() !== 6) { // 6 = Saturday
    firstIntroSaturday.setDate(firstIntroSaturday.getDate() + 1);
  }

  // Find the first Sunday after the start date for JavaScript Game Development
  const firstJSSunday = new Date(jsGameStartDate);
  while (firstJSSunday.getDay() !== 0) { // 0 = Sunday
    firstJSSunday.setDate(firstJSSunday.getDate() + 1);
  }

  console.log(`📅 Intro to Programming - First Saturday: ${firstIntroSaturday.toISOString().split('T')[0]}`);
  console.log(`📅 JavaScript Game Development - First Sunday: ${firstJSSunday.toISOString().split('T')[0]}\n`);

  // Create classes for Introduction to Programming (12 sessions on Saturdays)
  console.log(`Creating ${introProgram.sessionCount} classes for Introduction to Programming...`);
  const introClasses = [];
  for (let i = 0; i < introProgram.sessionCount; i++) {
    const sessionDate = new Date(firstIntroSaturday);
    sessionDate.setDate(sessionDate.getDate() + (i * 7)); // Every Saturday
    sessionDate.setHours(9, 0, 0, 0); // 9:00 AM

    const classSession = await prisma.classSession.create({
      data: {
        title: `Introduction to Programming - Session ${i + 1}`,
        description: 'Learn programming fundamentals with Python',
        instructorEmail,
        programId: introProgram.id,
        sessionType: 'GROUP',
        language: 'PYTHON',
        ageGroup: 'AGES_15_18',
        startTime: sessionDate,
        durationMinutes: 120, // 2 hours (9 AM - 11 AM)
        maxStudents: 15,
        enrolledCount: 0,
        meetingUrl: 'https://meet.ourcodingkiddos.com/intro-programming',
        status: 'SCHEDULED',
      },
    });
    introClasses.push(classSession);
  }
  console.log(`✅ Created ${introClasses.length} Saturday classes (9 AM - 11 AM)\n`);

  // Create classes for JavaScript Game Development (16 sessions on Sundays)
  console.log(`Creating ${jsGameProgram.sessionCount} classes for JavaScript Game Development...`);
  const jsClasses = [];
  for (let i = 0; i < jsGameProgram.sessionCount; i++) {
    const sessionDate = new Date(firstJSSunday);
    sessionDate.setDate(sessionDate.getDate() + (i * 7)); // Every Sunday
    sessionDate.setHours(9, 0, 0, 0); // 9:00 AM

    const classSession = await prisma.classSession.create({
      data: {
        title: `JavaScript Game Development - Session ${i + 1}`,
        description: 'Build awesome games while learning JavaScript',
        instructorEmail,
        programId: jsGameProgram.id,
        sessionType: 'GROUP',
        language: 'JAVASCRIPT',
        ageGroup: 'AGES_11_14',
        startTime: sessionDate,
        durationMinutes: 120, // 2 hours (9 AM - 11 AM)
        maxStudents: 12,
        enrolledCount: 0,
        meetingUrl: 'https://meet.ourcodingkiddos.com/js-game-dev',
        status: 'SCHEDULED',
      },
    });
    jsClasses.push(classSession);
  }
  console.log(`✅ Created ${jsClasses.length} Sunday classes (9 AM - 11 AM)\n`);

  // Summary
  console.log('📊 SUMMARY:\n');
  console.log(`Introduction to Programming (Saturdays, 9 AM - 11 AM):`);
  console.log(`   First class: ${introClasses[0].startTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
  console.log(`   Last class:  ${introClasses[introClasses.length - 1].startTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
  console.log(`   Total: ${introClasses.length} sessions\n`);

  console.log(`JavaScript Game Development (Sundays, 9 AM - 11 AM):`);
  console.log(`   First class: ${jsClasses[0].startTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
  console.log(`   Last class:  ${jsClasses[jsClasses.length - 1].startTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
  console.log(`   Total: ${jsClasses.length} sessions\n`);

  console.log(`✅ All classes have been created and assigned to demo.instructor@example.com`);

  await prisma.$disconnect();
}

setupProgramClasses().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
