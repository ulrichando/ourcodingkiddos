import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addSoftDeleteFields() {
  try {
    console.log('Adding soft delete fields to Conversation table...');

    // Add deletedAt and deletedBy columns
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Conversation"
      ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "deletedBy" TEXT;
    `);

    console.log('✓ Successfully added soft delete fields!');
    console.log('  - deletedAt: TIMESTAMP');
    console.log('  - deletedBy: TEXT');

  } catch (error) {
    console.error('Error adding soft delete fields:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSoftDeleteFields();
