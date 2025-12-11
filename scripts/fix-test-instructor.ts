import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTestInstructor() {
  const testClasses = await prisma.classSession.findMany({
    where: { instructorEmail: 'test@ourcodingkiddos.com' },
    select: {
      id: true,
      title: true,
      startTime: true,
    },
  });

  console.log('\nClasses assigned to test@ourcodingkiddos.com:', testClasses.length);
  testClasses.forEach(c => {
    console.log('  -', c.title, '|', c.startTime.toISOString().split('T')[0]);
  });

  // Fix them
  if (testClasses.length > 0) {
    const result = await prisma.classSession.updateMany({
      where: { instructorEmail: 'test@ourcodingkiddos.com' },
      data: { instructorEmail: 'demo.instructor@example.com' },
    });
    console.log('\n✅ Reassigned', result.count, 'classes to demo.instructor@example.com');
  }

  await prisma.$disconnect();
}

checkTestInstructor().catch(console.error);
