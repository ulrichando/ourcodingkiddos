import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkInstructor() {
  const instructor = await prisma.user.findUnique({
    where: { email: 'instructor@ourcodingkiddos.com' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      accountStatus: true,
      createdAt: true,
      image: true,
    },
  });

  if (instructor) {
    console.log('\nFound instructor account:');
    console.log('  Email:', instructor.email);
    console.log('  Name:', instructor.name || 'Not set');
    console.log('  Role:', instructor.role);
    console.log('  Status:', instructor.accountStatus);
    console.log('  Created:', instructor.createdAt.toISOString());
    console.log('  Has image:', !!instructor.image);
    console.log('');

    // Check if this instructor has any classes
    const classCount = await prisma.classSession.count({
      where: { instructorEmail: 'instructor@ourcodingkiddos.com' },
    });
    console.log('Classes assigned to this instructor:', classCount);
  } else {
    console.log('\nNo user found with email: instructor@ourcodingkiddos.com');
  }

  await prisma.$disconnect();
}

checkInstructor().catch(console.error);
