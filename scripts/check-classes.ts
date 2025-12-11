import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkClasses() {
  console.log('\n=== Checking ClassSession data ===\n');

  const classes = await prisma.classSession.findMany({
    select: {
      id: true,
      title: true,
      instructorEmail: true,
      programId: true,
      startTime: true,
      status: true,
      sessionType: true,
      language: true,
      ageGroup: true,
    },
    orderBy: { startTime: 'desc' },
    take: 20,
  });

  console.log(`Found ${classes.length} classes:\n`);

  classes.forEach((cls, i) => {
    console.log(`${i + 1}. ${cls.title}`);
    console.log(`   ID: ${cls.id}`);
    console.log(`   Instructor Email: ${cls.instructorEmail || 'UNASSIGNED'}`);
    console.log(`   Program ID: ${cls.programId || 'NO PROGRAM (standalone)'}`);
    console.log(`   Start Time: ${cls.startTime.toISOString()}`);
    console.log(`   Status: ${cls.status}`);
    console.log(`   Session Type: ${cls.sessionType}`);
    console.log(`   Language: ${cls.language}`);
    console.log(`   Age Group: ${cls.ageGroup}`);
    console.log('');
  });

  // Check programs too
  console.log('\n=== Checking Program data ===\n');

  const programs = await prisma.program.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      isPublished: true,
      startDate: true,
      endDate: true,
      _count: {
        select: { classSessions: true }
      }
    },
  });

  console.log(`Found ${programs.length} programs:\n`);

  programs.forEach((prog, i) => {
    console.log(`${i + 1}. ${prog.title} (${prog.slug})`);
    console.log(`   ID: ${prog.id}`);
    console.log(`   Published: ${prog.isPublished}`);
    console.log(`   Start Date: ${prog.startDate?.toISOString() || 'Not set'}`);
    console.log(`   End Date: ${prog.endDate?.toISOString() || 'Not set'}`);
    console.log(`   Class Sessions: ${prog._count.classSessions}`);
    console.log('');
  });

  await prisma.$disconnect();
}

checkClasses().catch(console.error);
