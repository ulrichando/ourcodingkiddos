import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyNoOrphanedEmails() {
  console.log('\n=== Verifying No Orphaned Emails ===\n');

  const instructorOld = await prisma.classSession.count({
    where: { instructorEmail: 'instructor@ourcodingkiddos.com' },
  });

  const testOld = await prisma.classSession.count({
    where: { instructorEmail: 'test@ourcodingkiddos.com' },
  });

  const demoInstructor = await prisma.classSession.count({
    where: { instructorEmail: 'demo.instructor@example.com' },
  });

  console.log('Classes with instructor@ourcodingkiddos.com:', instructorOld);
  console.log('Classes with test@ourcodingkiddos.com:', testOld);
  console.log('Classes with demo.instructor@example.com:', demoInstructor);
  console.log('');

  if (instructorOld === 0 && testOld === 0) {
    console.log('✅ All orphaned email references have been removed!');
  } else {
    console.log('❌ Still have orphaned email references');
  }

  await prisma.$disconnect();
}

verifyNoOrphanedEmails().catch(console.error);
