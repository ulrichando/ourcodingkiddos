import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixInstructorAssignment() {
  console.log('\n=== Fixing Instructor Assignment ===\n');

  // Revert instructor back to demo.instructor@example.com
  const instructorEmail = 'demo.instructor@example.com';

  // Get the demo instructor user
  let demoInstructor = await prisma.user.findUnique({
    where: { email: instructorEmail },
  });

  if (!demoInstructor) {
    console.log('Creating demo instructor account...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('DemoInstructor2025!', 10);

    demoInstructor = await prisma.user.create({
      data: {
        email: instructorEmail,
        name: 'Demo Instructor',
        role: 'INSTRUCTOR',
        accountStatus: 'APPROVED',
        hashedPassword,
        emailVerified: new Date(),
      },
    });
    console.log(`✅ Created demo instructor account\n`);
  }

  // Update all classes to use demo instructor but keep company meeting URLs
  const updated = await prisma.classSession.updateMany({
    where: {
      OR: [
        { instructorEmail: 'ulrich@ourcodingkiddos.com' },
        { instructorEmail: 'demo.instructor@example.com' },
      ],
    },
    data: {
      instructorEmail: instructorEmail,
      instructorId: demoInstructor.id,
    },
  });

  console.log(`✅ Updated ${updated.count} classes`);
  console.log(`   Instructor: ${instructorEmail}`);
  console.log(`   Meeting URLs remain with company domain\n`);

  // Verify the setup
  const classes = await prisma.classSession.findMany({
    where: {
      instructorEmail: instructorEmail,
      status: 'SCHEDULED',
    },
    select: {
      id: true,
      title: true,
      instructorEmail: true,
      meetingUrl: true,
    },
    take: 3,
  });

  console.log('📋 Sample classes:');
  classes.forEach(cls => {
    console.log(`   - ${cls.title}`);
    console.log(`     Instructor: ${cls.instructorEmail}`);
    console.log(`     Meeting: ${cls.meetingUrl}\n`);
  });

  console.log('✅ Configuration:');
  console.log('   Instructor account: demo.instructor@example.com');
  console.log('   Meeting generation: ulrich@ourcodingkiddos.com (Google Workspace)');
  console.log('   Meeting domain: meet.ourcodingkiddos.com');

  await prisma.$disconnect();
}

fixInstructorAssignment().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
