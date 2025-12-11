import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDemoInstructor() {
  const user = await prisma.user.findUnique({
    where: { email: 'demo.instructor@example.com' },
    select: {
      email: true,
      name: true,
      role: true,
      accountStatus: true,
      hashedPassword: true,
      accounts: {
        select: {
          provider: true,
        },
      },
    },
  });

  if (user) {
    console.log('\nDemo Instructor Account:');
    console.log('  Email:', user.email);
    console.log('  Name:', user.name);
    console.log('  Role:', user.role);
    console.log('  Status:', user.accountStatus);
    console.log('  Has Password:', !!user.hashedPassword);
    console.log('  OAuth Providers:', user.accounts.map(a => a.provider).join(', ') || 'None');
    console.log('');
    console.log('To log in:');
    if (user.hashedPassword) {
      console.log('  - Use email/password login');
      console.log('  - Email: demo.instructor@example.com');
      console.log('  - Password: (whatever you set during creation)');
    }
    if (user.accounts.length > 0) {
      console.log('  - Use OAuth login with:', user.accounts.map(a => a.provider).join(', '));
    }
    if (!user.hashedPassword && user.accounts.length === 0) {
      console.log('  ⚠️  No login method configured! Need to add password or OAuth.');
    }
  } else {
    console.log('Demo instructor account not found!');
  }

  await prisma.$disconnect();
}

checkDemoInstructor().catch(console.error);
