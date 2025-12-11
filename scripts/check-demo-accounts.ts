import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDemoAccounts() {
  // Find all users with 'demo' or 'example.com' in their email
  const demoUsers = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: 'demo' } },
        { email: { contains: 'example.com' } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      accountStatus: true,
      createdAt: true,
    },
    orderBy: { role: 'asc' },
  });

  console.log('\n=== Demo Accounts ===\n');
  console.log(`Total demo accounts found: ${demoUsers.length}`);
  console.log('');

  const byRole: Record<string, typeof demoUsers> = {};

  demoUsers.forEach(user => {
    if (!byRole[user.role]) {
      byRole[user.role] = [];
    }
    byRole[user.role].push(user);
  });

  Object.entries(byRole).forEach(([role, users]) => {
    console.log(`${role} accounts (${users.length}):`);
    users.forEach(user => {
      console.log(`  - ${user.email}`);
      console.log(`    Name: ${user.name || 'Not set'}`);
      console.log(`    Status: ${user.accountStatus}`);
      console.log(`    Created: ${user.createdAt.toISOString().split('T')[0]}`);
      console.log('');
    });
  });

  await prisma.$disconnect();
}

checkDemoAccounts().catch(console.error);
