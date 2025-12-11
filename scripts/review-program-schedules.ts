import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function reviewProgramSchedules() {
  console.log('\n=== Reviewing Program Schedules ===\n');

  // Get all published programs
  const programs = await prisma.program.findMany({
    where: {
      isPublished: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      startDate: true,
      endDate: true,
      sessionCount: true,
    },
    orderBy: { title: 'asc' },
  });

  console.log(`Found ${programs.length} published programs:\n`);

  for (const program of programs) {
    console.log(`\n📚 Program: ${program.title}`);
    console.log(`   Description: ${program.description}`);
    console.log(`   Sessions: ${program.sessionCount}`);
    console.log(`   Start Date: ${program.startDate?.toISOString().split('T')[0] || 'Not set'}`);
    console.log(`   End Date: ${program.endDate?.toISOString().split('T')[0] || 'Not set'}`);

    // Get all classes for this program
    const classes = await prisma.classSession.findMany({
      where: {
        programId: program.id,
        status: 'SCHEDULED',
      },
      select: {
        id: true,
        title: true,
        startTime: true,
        durationMinutes: true,
        instructorEmail: true,
        enrolledCount: true,
        maxStudents: true,
      },
      orderBy: { startTime: 'asc' },
    });

    console.log(`   \n   📅 Classes (${classes.length}):`);

    if (classes.length === 0) {
      console.log('      No classes scheduled for this program');
    } else {
      // Group by day of week
      const classesByDay: { [key: string]: typeof classes } = {};

      classes.forEach((cls) => {
        const dayOfWeek = cls.startTime.toLocaleDateString('en-US', { weekday: 'long' });
        if (!classesByDay[dayOfWeek]) {
          classesByDay[dayOfWeek] = [];
        }
        classesByDay[dayOfWeek].push(cls);
      });

      Object.entries(classesByDay).forEach(([day, dayClasses]) => {
        console.log(`\n      ${day}:`);
        dayClasses.forEach((cls) => {
          const time = cls.startTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
          const date = cls.startTime.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
          console.log(`         - ${cls.title}`);
          console.log(`           ${date} at ${time} (${cls.durationMinutes} mins)`);
          console.log(`           Instructor: ${cls.instructorEmail || 'Unassigned'}`);
          console.log(`           Students: ${cls.enrolledCount}/${cls.maxStudents || '∞'}`);
        });
      });

      // Summary by day
      console.log(`\n   📊 Summary by Day:`);
      Object.entries(classesByDay).forEach(([day, dayClasses]) => {
        const times = dayClasses.map(c =>
          c.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        );
        console.log(`      ${day}: ${dayClasses.length} class(es) - ${[...new Set(times)].join(', ')}`);
      });
    }

    console.log('\n   ' + '─'.repeat(60));
  }

  await prisma.$disconnect();
}

reviewProgramSchedules().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
