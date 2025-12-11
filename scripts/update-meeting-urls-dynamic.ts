import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateMeetingUrlsDynamic() {
  console.log('\n=== Updating Meeting URLs to Dynamic Format ===\n');

  // For each class session, generate unique meeting URLs
  // Format: https://meet.google.com/xxx-xxxx-xxx (Google generates these)
  // Or use named rooms: meet.ourcodingkiddos.com/program-session-number

  console.log('📋 Current approach:');
  console.log('   - Meeting URLs are set as generic room names');
  console.log('   - Format: meet.ourcodingkiddos.com/[program-type]');
  console.log('   - Any instructor with @ourcodingkiddos.com can host');
  console.log('   - Instructor is assigned separately in the class\n');

  // Update to use more specific meeting rooms per class session
  const introClasses = await prisma.classSession.findMany({
    where: {
      title: { contains: 'Introduction to Programming' },
      status: 'SCHEDULED',
    },
    orderBy: { startTime: 'asc' },
  });

  const jsClasses = await prisma.classSession.findMany({
    where: {
      title: { contains: 'JavaScript Game Development' },
      status: 'SCHEDULED',
    },
    orderBy: { startTime: 'asc' },
  });

  console.log('Updating Introduction to Programming classes...');
  for (let i = 0; i < introClasses.length; i++) {
    const cls = introClasses[i];
    const sessionNum = i + 1;
    // Use unique room names per session for better organization
    const meetingUrl = `https://meet.google.com/intro-prog-session-${sessionNum.toString().padStart(2, '0')}`;

    await prisma.classSession.update({
      where: { id: cls.id },
      data: { meetingUrl },
    });
  }
  console.log(`✅ Updated ${introClasses.length} classes\n`);

  console.log('Updating JavaScript Game Development classes...');
  for (let i = 0; i < jsClasses.length; i++) {
    const cls = jsClasses[i];
    const sessionNum = i + 1;
    const meetingUrl = `https://meet.google.com/js-game-session-${sessionNum.toString().padStart(2, '0')}`;

    await prisma.classSession.update({
      where: { id: cls.id },
      data: { meetingUrl },
    });
  }
  console.log(`✅ Updated ${jsClasses.length} classes\n`);

  console.log('📊 Summary:');
  console.log('   - Introduction to Programming: Unique URLs per session');
  console.log('   - JavaScript Game Development: Unique URLs per session');
  console.log('   - Format: meet.google.com/[program]-session-[XX]');
  console.log('   - Instructor assignment: Separate from meeting URL\n');

  console.log('💡 How it works:');
  console.log('   1. When you hire an instructor:');
  console.log('      - Create Google Workspace account: teacher@ourcodingkiddos.com');
  console.log('      - Add them to the platform with that email');
  console.log('      - Assign them to specific classes');
  console.log('   2. The instructor logs in with Google SSO');
  console.log('   3. They can host meetings using the Google Meet links');
  console.log('   4. Google Workspace handles authentication and permissions\n');

  console.log('✅ Meeting URLs updated to dynamic format!');

  await prisma.$disconnect();
}

updateMeetingUrlsDynamic().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
