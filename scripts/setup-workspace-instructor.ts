import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupWorkspaceInstructor() {
  console.log('\n=== Setting Up Google Workspace Instructor ===\n');

  const instructorEmail = 'instructor@ourcodingkiddos.com';
  const instructorName = 'Our Coding Kiddos Instructor';

  // Check if this user exists
  let user = await prisma.user.findUnique({
    where: { email: instructorEmail },
  });

  if (user) {
    console.log(`✅ User ${instructorEmail} already exists (ID: ${user.id})`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Status: ${user.accountStatus}\n`);

    // Make sure role is INSTRUCTOR and account is APPROVED
    if (user.role !== 'INSTRUCTOR' || user.accountStatus !== 'APPROVED') {
      user = await prisma.user.update({
        where: { email: instructorEmail },
        data: {
          role: 'INSTRUCTOR',
          accountStatus: 'APPROVED',
        },
      });
      console.log(`✅ Updated to INSTRUCTOR role with APPROVED status\n`);
    }
  } else {
    // Create new instructor with Google Workspace email
    console.log(`Creating new instructor account: ${instructorEmail}`);
    user = await prisma.user.create({
      data: {
        email: instructorEmail,
        name: instructorName,
        role: 'INSTRUCTOR',
        accountStatus: 'APPROVED',
        emailVerified: new Date(),
      },
    });
    console.log(`✅ Created instructor account\n`);
  }

  // Reassign all classes from demo instructor to this account
  const updatedClasses = await prisma.classSession.updateMany({
    where: {
      instructorEmail: 'demo.instructor@example.com',
    },
    data: {
      instructorEmail: instructorEmail,
      instructorId: user.id,
    },
  });

  console.log(`✅ Reassigned ${updatedClasses.count} classes to ${instructorEmail}\n`);

  // Summary
  const classes = await prisma.classSession.findMany({
    where: {
      instructorEmail: instructorEmail,
      status: 'SCHEDULED',
    },
    select: {
      programId: true,
    },
  });

  const introClasses = classes.filter(c => c.programId);
  const jsClasses = classes.filter(c => c.programId);

  console.log(`📊 Summary:`);
  console.log(`   Email: ${instructorEmail}`);
  console.log(`   Total Classes: ${classes.length}`);
  console.log(`   Meeting URLs: Company domain (meet.ourcodingkiddos.com)\n`);

  console.log('✅ Setup Complete!\n');
  console.log('📋 Next Steps:');
  console.log('   1. The instructor can now log in with Google OAuth');
  console.log(`   2. Use the "Sign in with Google" button`);
  console.log(`   3. Use the ${instructorEmail} Google Workspace account`);
  console.log('   4. No password needed - Google SSO handles authentication');
  console.log('   5. This account can also generate Google Meet links\n');

  console.log('💡 Benefits:');
  console.log('   ✓ Single Google Workspace account for both login and meetings');
  console.log('   ✓ No need to share passwords');
  console.log('   ✓ Professional company email');
  console.log('   ✓ Integrated with Google Workspace');
  console.log('   ✓ Can use Google Calendar for scheduling');

  await prisma.$disconnect();
}

setupWorkspaceInstructor().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
