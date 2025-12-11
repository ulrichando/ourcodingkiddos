import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkClassDates() {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  console.log('\n=== Checking Class Dates ===');
  console.log('Current time:', now.toISOString());
  console.log('One hour ago:', oneHourAgo.toISOString());
  console.log('');

  const allClasses = await prisma.classSession.findMany({
    where: {
      instructorEmail: 'demo.instructor@example.com',
      status: 'SCHEDULED',
    },
    select: {
      id: true,
      title: true,
      startTime: true,
    },
    orderBy: { startTime: 'asc' },
  });

  console.log('Total classes for demo.instructor@example.com:', allClasses.length);
  console.log('');

  const futureClasses = allClasses.filter(c => c.startTime >= oneHourAgo);
  const pastClasses = allClasses.filter(c => c.startTime < oneHourAgo);

  console.log('Classes within API range (>= 1 hour ago):', futureClasses.length);
  console.log('Classes in the past (< 1 hour ago):', pastClasses.length);
  console.log('');

  if (futureClasses.length > 0) {
    console.log('Next 5 upcoming classes:');
    futureClasses.slice(0, 5).forEach(c => {
      const daysFromNow = Math.ceil((c.startTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      console.log('  -', c.title);
      console.log('    Date:', c.startTime.toISOString().split('T')[0]);
      console.log('    Days from now:', daysFromNow);
    });
  }

  if (pastClasses.length > 0) {
    console.log('');
    console.log('⚠️  Past classes (filtered out by API):', pastClasses.length);
    pastClasses.slice(0, 3).forEach(c => {
      console.log('  -', c.title, '|', c.startTime.toISOString().split('T')[0]);
    });
  }

  await prisma.$disconnect();
}

checkClassDates().catch(console.error);
