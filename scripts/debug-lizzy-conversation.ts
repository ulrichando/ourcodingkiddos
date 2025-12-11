import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugLizzyConversation() {
  try {
    console.log('=== Debugging Lizzy Conversation ===\n');

    // Find the Lizzy conversation
    const lizzyConv = await prisma.conversation.findFirst({
      where: {
        participants: {
          some: {
            OR: [
              { userName: { contains: 'Lizzy', mode: 'insensitive' } },
              { userEmail: { contains: 'lizzy', mode: 'insensitive' } }
            ]
          }
        }
      },
      include: {
        participants: true,
        messages: true
      }
    });

    if (!lizzyConv) {
      console.log('No conversation found with Lizzy');
      return;
    }

    console.log('Conversation ID:', lizzyConv.id);
    console.log('Title:', lizzyConv.title);
    console.log('Type:', lizzyConv.type);
    console.log('\nParticipants:');

    lizzyConv.participants.forEach(p => {
      console.log(`  ID: ${p.id}`);
      console.log(`  Name: ${p.userName}`);
      console.log(`  Email: "${p.userEmail}"`);
      console.log(`  Email (lowercase): "${p.userEmail.toLowerCase()}"`);
      console.log(`  Role: ${p.userRole}`);
      console.log(`  Conversation ID: ${p.conversationId}`);
      console.log('');
    });

    console.log('Messages:', lizzyConv.messages.length);

    // Now simulate the DELETE query with demo.instructor@example.com
    const testEmail = 'demo.instructor@example.com';
    console.log(`\n=== Testing DELETE authorization for: ${testEmail} ===\n`);

    const authTest = await prisma.conversation.findFirst({
      where: {
        id: lizzyConv.id,
        participants: {
          some: {
            userEmail: testEmail.toLowerCase()
          }
        }
      }
    });

    if (authTest) {
      console.log('✓ Authorization check PASSED - User is a participant');
    } else {
      console.log('✗ Authorization check FAILED - User is NOT found as participant');

      // Check with exact email matches
      console.log('\nChecking exact email matches:');
      for (const p of lizzyConv.participants) {
        console.log(`  "${p.userEmail}" === "${testEmail.toLowerCase()}" ? ${p.userEmail === testEmail.toLowerCase()}`);
        console.log(`  "${p.userEmail.toLowerCase()}" === "${testEmail.toLowerCase()}" ? ${p.userEmail.toLowerCase() === testEmail.toLowerCase()}`);
      }
    }

    // Check for any special characters or whitespace
    console.log('\n=== Checking for hidden characters ===');
    lizzyConv.participants.forEach(p => {
      console.log(`Email: "${p.userEmail}"`);
      console.log(`  Length: ${p.userEmail.length}`);
      console.log(`  Char codes: ${Array.from(p.userEmail).map(c => c.charCodeAt(0)).join(', ')}`);
      console.log(`  Has spaces: ${p.userEmail.includes(' ')}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error debugging Lizzy conversation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugLizzyConversation();
