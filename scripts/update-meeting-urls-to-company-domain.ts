import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateMeetingUrls() {
  console.log('\n=== Updating Meeting URLs to Company Domain ===\n');

  // Update all classes to use company domain instead of personal Google Meet links
  const introClasses = await prisma.classSession.updateMany({
    where: {
      title: { contains: 'Introduction to Programming' },
    },
    data: {
      meetingUrl: 'https://meet.ourcodingkiddos.com/intro-programming',
    },
  });

  const jsClasses = await prisma.classSession.updateMany({
    where: {
      title: { contains: 'JavaScript Game Development' },
    },
    data: {
      meetingUrl: 'https://meet.ourcodingkiddos.com/js-game-dev',
    },
  });

  console.log(`✅ Updated ${introClasses.count} Introduction to Programming classes`);
  console.log(`✅ Updated ${jsClasses.count} JavaScript Game Development classes\n`);

  console.log('All classes now use company domain meeting URLs:');
  console.log('  - Introduction to Programming: https://meet.ourcodingkiddos.com/intro-programming');
  console.log('  - JavaScript Game Development: https://meet.ourcodingkiddos.com/js-game-dev\n');

  console.log('💡 Benefits of using company domain:');
  console.log('  ✓ Professional appearance');
  console.log('  ✓ Branded experience for students and parents');
  console.log('  ✓ Better control and security');
  console.log('  ✓ Consistent with enterprise standards');
  console.log('  ✓ Easier to manage and track usage');

  await prisma.$disconnect();
}

updateMeetingUrls().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
