import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setupUlrichInstructor() {
  console.log('\n=== Setting Up Ulrich Instructor Account ===\n');

  const email = 'ulrich@ourcodingkiddos.com';
  const name = 'Ulrich';

  // Check if user already exists
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    console.log(`✅ User ${email} already exists (ID: ${user.id})`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Status: ${user.accountStatus}\n`);

    // Update role to INSTRUCTOR if not already
    if (user.role !== 'INSTRUCTOR') {
      user = await prisma.user.update({
        where: { email },
        data: {
          role: 'INSTRUCTOR',
          accountStatus: 'APPROVED',
        },
      });
      console.log(`✅ Updated role to INSTRUCTOR and approved account\n`);
    }
  } else {
    // Create new instructor account
    const hashedPassword = await bcrypt.hash('OurCodingKiddos2025!', 10);

    user = await prisma.user.create({
      data: {
        email,
        name,
        role: 'INSTRUCTOR',
        accountStatus: 'APPROVED',
        hashedPassword,
        emailVerified: new Date(),
      },
    });

    console.log(`✅ Created new instructor account:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: OurCodingKiddos2025!`);
    console.log(`   Role: INSTRUCTOR`);
    console.log(`   Status: APPROVED\n`);
    console.log(`⚠️  Please change the password after first login!\n`);
  }

  // Reassign all classes from demo instructor to Ulrich
  const updatedClasses = await prisma.classSession.updateMany({
    where: {
      instructorEmail: 'demo.instructor@example.com',
    },
    data: {
      instructorEmail: email,
      instructorId: user.id,
    },
  });

  console.log(`✅ Reassigned ${updatedClasses.count} classes to ${email}\n`);

  // Summary
  const classes = await prisma.classSession.findMany({
    where: {
      instructorEmail: email,
      status: 'SCHEDULED',
    },
    select: {
      id: true,
      title: true,
      startTime: true,
      programId: true,
    },
    orderBy: { startTime: 'asc' },
  });

  console.log(`📊 Total classes assigned to ${email}: ${classes.length}`);

  // Group by program
  const introClasses = classes.filter(c => c.title.includes('Introduction to Programming'));
  const jsClasses = classes.filter(c => c.title.includes('JavaScript Game Development'));

  console.log(`   - Introduction to Programming: ${introClasses.length} classes`);
  console.log(`   - JavaScript Game Development: ${jsClasses.length} classes\n`);

  console.log('✅ Setup complete! Ulrich can now log in with:');
  console.log(`   Email: ${email}`);
  console.log(`   - Use Google Workspace SSO (recommended)`);
  console.log(`   - Or use password: OurCodingKiddos2025! (change after first login)`);

  await prisma.$disconnect();
}

setupUlrichInstructor().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
