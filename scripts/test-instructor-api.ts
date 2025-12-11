import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simulate the exact API logic
async function testInstructorAPI() {
  const email = 'demo.instructor@example.com';
  const includeFrom = new Date(Date.now() - 60 * 60 * 1000);
  const now = new Date();

  console.log('\n=== Testing Instructor Classes API Logic ===');
  console.log('Instructor email:', email);
  console.log('Include from:', includeFrom.toISOString());
  console.log('');

  // Get currently running programs
  const runningPrograms = await prisma.program.findMany({
    where: {
      isPublished: true,
      OR: [
        {
          AND: [
            { startDate: { lte: now } },
            { endDate: { gte: now } },
          ],
        },
        {
          startDate: { lte: now },
          endDate: null,
        },
        {
          startDate: null,
          endDate: null,
        },
      ],
    },
    select: { id: true, title: true },
  });

  const runningProgramIds = runningPrograms.map(p => p.id);
  console.log('Running programs:', runningPrograms.length);
  runningPrograms.forEach(p => console.log('  -', p.title));
  console.log('');

  // Fetch classes
  const sessions = await prisma.classSession.findMany({
    where: {
      status: "SCHEDULED",
      startTime: { gte: includeFrom },
      OR: [
        { programId: { in: runningProgramIds } },
        { instructorEmail: email },
      ],
    },
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      title: true,
      startTime: true,
      instructorEmail: true,
      programId: true,
    },
  });

  console.log('Classes returned by API:', sessions.length);
  console.log('');

  if (sessions.length > 0) {
    console.log('First 10 classes:');
    sessions.slice(0, 10).forEach(s => {
      console.log('  -', s.title);
      console.log('    Date:', s.startTime.toISOString().split('T')[0]);
      console.log('    Instructor:', s.instructorEmail);
      console.log('    ProgramID:', s.programId || 'standalone');
    });
  } else {
    console.log('❌ NO CLASSES RETURNED!');
    console.log('');
    console.log('Debugging - checking each OR condition separately:');

    const byProgram = await prisma.classSession.count({
      where: {
        status: "SCHEDULED",
        startTime: { gte: includeFrom },
        programId: { in: runningProgramIds },
      },
    });

    const byInstructor = await prisma.classSession.count({
      where: {
        status: "SCHEDULED",
        startTime: { gte: includeFrom },
        instructorEmail: email,
      },
    });

    console.log('  - By running program:', byProgram);
    console.log('  - By instructor email:', byInstructor);
  }

  await prisma.$disconnect();
}

testInstructorAPI().catch(console.error);
