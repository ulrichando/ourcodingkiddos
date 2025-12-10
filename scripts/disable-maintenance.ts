import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function disableMaintenanceMode() {
  try {
    const settings = await prisma.platformSettings.upsert({
      where: { id: 'default' },
      update: { maintenanceMode: false },
      create: { id: 'default', maintenanceMode: false },
    });

    console.log('✅ Maintenance mode disabled successfully!');
    console.log('Settings:', settings);
  } catch (error) {
    console.error('❌ Error disabling maintenance mode:', error);
  } finally {
    await prisma.$disconnect();
  }
}

disableMaintenanceMode();
