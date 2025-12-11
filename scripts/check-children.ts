import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkChildren() {
  try {
    const parents = await prisma.user.findMany({
      where: { role: 'PARENT' },
      include: {
        parentProfile: {
          include: {
            children: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    console.log('=== Parents and Their Children ===\n');
    for (const parent of parents) {
      console.log(`Parent: ${parent.name} (${parent.email})`);
      if (parent.parentProfile) {
        console.log(`Children: ${parent.parentProfile.children.length}`);
        for (const child of parent.parentProfile.children) {
          console.log(`  - ${child.name}`);
          console.log(`    Email: ${child.user?.email || 'NO EMAIL'}`);
          console.log(`    ID: ${child.id}`);
        }
      } else {
        console.log('No parent profile found');
      }
      console.log('');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkChildren();
