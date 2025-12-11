import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function showAllUsers() {
  console.log('\n=== ALL USERS BY CATEGORY ===\n');

  // Get all users grouped by role
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      accountStatus: true,
      createdAt: true,
      lastSeen: true,
    },
    orderBy: [
      { role: 'asc' },
      { email: 'asc' },
    ],
  });

  // Separate demo and real users
  const demoUsers: typeof users = [];
  const realUsers: typeof users = [];

  users.forEach((user) => {
    if (user.email.includes('demo.') || user.email.includes('@example.com')) {
      demoUsers.push(user);
    } else {
      realUsers.push(user);
    }
  });

  // Group real users by role
  const byRole: Record<string, typeof users> = {
    ADMIN: [],
    SUPPORT: [],
    INSTRUCTOR: [],
    PARENT: [],
    STUDENT: [],
  };

  realUsers.forEach((user) => {
    byRole[user.role].push(user);
  });

  // Display by category
  for (const [role, userList] of Object.entries(byRole)) {
    if (userList.length === 0) continue;

    console.log(`\n📋 ${role} (${userList.length} users)`);
    console.log('─'.repeat(80));

    userList.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.email}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log(`   Status: ${user.accountStatus}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log(`   Last Seen: ${user.lastSeen ? user.lastSeen.toLocaleString() : 'Never'}`);
      console.log(`   ID: ${user.id}`);
    });
  }

  // Display demo accounts
  if (demoUsers.length > 0) {
    console.log('\n\n🎭 DEMO ACCOUNTS (For Testing)');
    console.log('─'.repeat(80));

    demoUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.email}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.accountStatus}`);
      console.log(`   Last Seen: ${user.lastSeen ? user.lastSeen.toLocaleString() : 'Never'}`);
    });
  }

  // Summary
  console.log('\n\n📊 SUMMARY');
  console.log('─'.repeat(80));
  console.log(`Total Users: ${users.length}`);
  console.log(`  Real Users: ${realUsers.length}`);
  console.log(`  Demo Users: ${demoUsers.length}`);
  console.log('\nReal Users by Role:');
  console.log(`  - Admins: ${byRole.ADMIN.length}`);
  console.log(`  - Support: ${byRole.SUPPORT.length}`);
  console.log(`  - Instructors: ${byRole.INSTRUCTOR.length}`);
  console.log(`  - Parents: ${byRole.PARENT.length}`);
  console.log(`  - Students: ${byRole.STUDENT.length}`);

  // Account status breakdown
  const statusBreakdown = realUsers.reduce((acc, user) => {
    acc[user.accountStatus] = (acc[user.accountStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\nReal Users by Status:');
  Object.entries(statusBreakdown).forEach(([status, count]) => {
    console.log(`  - ${status}: ${count}`);
  });

  console.log('\n');

  await prisma.$disconnect();
}

showAllUsers().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
