import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixUlrichAdmin() {
  console.log('\n=== Fixing ulrich@ourcodingkiddos.com Role ===\n');

  const email = 'ulrich@ourcodingkiddos.com';

  // Check current user
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      accountStatus: true,
    },
  });

  if (!user) {
    console.log(`❌ User ${email} not found`);
    console.log('\nCreating ADMIN account...');

    await prisma.user.create({
      data: {
        email,
        name: 'Ulrich',
        role: 'ADMIN',
        accountStatus: 'APPROVED',
        emailVerified: new Date(),
      },
    });

    console.log(`✅ Created ADMIN account: ${email}\n`);
  } else {
    console.log('📋 Current User:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Status: ${user.accountStatus}\n`);

    if (user.role !== 'ADMIN') {
      console.log(`Updating role from ${user.role} to ADMIN...`);

      await prisma.user.update({
        where: { email },
        data: {
          role: 'ADMIN',
          accountStatus: 'APPROVED',
        },
      });

      console.log(`✅ Updated ${email} to ADMIN role\n`);
    } else {
      console.log(`✅ User is already an ADMIN\n`);
    }
  }

  // Check if this user is assigned to any classes as instructor
  const classCount = await prisma.classSession.count({
    where: { instructorEmail: email },
  });

  if (classCount > 0) {
    console.log(`⚠️  Warning: ${email} is assigned to ${classCount} classes as instructor`);
    console.log('   These should be reassigned to an actual instructor account\n');

    // Reassign to demo instructor
    const result = await prisma.classSession.updateMany({
      where: { instructorEmail: email },
      data: { instructorEmail: 'demo.instructor@example.com' },
    });

    console.log(`✅ Reassigned ${result.count} classes to demo.instructor@example.com\n`);
  }

  console.log('✅ Done!\n');
  console.log('Summary:');
  console.log(`   ${email} is now an ADMIN`);
  console.log(`   Not assigned to any classes as instructor`);

  await prisma.$disconnect();
}

fixUlrichAdmin().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
