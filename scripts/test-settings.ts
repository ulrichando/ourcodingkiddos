import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testSettings() {
  try {
    console.log('Testing settings...');

    const settings = await prisma.platformSettings.findUnique({
      where: { id: 'default' }
    });

    console.log('Settings found:', settings);

    if (!settings) {
      console.log('Creating default settings...');
      const newSettings = await prisma.platformSettings.create({
        data: { id: 'default' }
      });
      console.log('Created:', newSettings);
    }

    console.log('✅ Test successful!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSettings();
