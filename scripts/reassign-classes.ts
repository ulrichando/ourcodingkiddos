import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function reassignClasses() {
  console.log('\n=== Reassigning Classes ===\n');

  // Update all classes from instructor@ourcodingkiddos.com to demo.instructor@example.com
  const result = await prisma.classSession.updateMany({
    where: {
      instructorEmail: 'instructor@ourcodingkiddos.com',
    },
    data: {
      instructorEmail: 'demo.instructor@example.com',
    },
  });

  console.log(`✅ Reassigned ${result.count} classes from instructor@ourcodingkiddos.com to demo.instructor@example.com`);

  // Verify
  const demoInstructorClasses = await prisma.classSession.count({
    where: {
      instructorEmail: 'demo.instructor@example.com',
    },
  });

  console.log(`\n📊 Total classes assigned to demo.instructor@example.com: ${demoInstructorClasses}\n`);

  await prisma.$disconnect();
}

reassignClasses().catch(console.error);
