import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixParticipantEmails() {
  try {
    console.log('=== Checking for Invalid Participant Email Records ===\n');

    // Find all conversation participants
    const participants = await prisma.conversationParticipant.findMany({
      include: {
        conversation: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    console.log(`Total participants found: ${participants.length}\n`);

    // Check for invalid emails (emails that don't contain @)
    const invalidParticipants = participants.filter(p => !p.userEmail.includes('@'));

    if (invalidParticipants.length === 0) {
      console.log('✓ All participant records have valid email formats.\n');
    } else {
      console.log(`⚠ Found ${invalidParticipants.length} participant(s) with invalid email formats:\n`);

      for (const p of invalidParticipants) {
        console.log(`Participant ID: ${p.id}`);
        console.log(`  Conversation: ${p.conversation.id} (${p.conversation.title || 'Untitled'})`);
        console.log(`  Invalid Email: "${p.userEmail}"`);
        console.log(`  User Name: ${p.userName}`);
        console.log(`  User Role: ${p.userRole}`);

        // Try to find the correct email for this user
        if (p.userRole === 'INSTRUCTOR' && p.userName === 'Demo Instructor') {
          console.log(`  → Should probably be: demo.instructor@example.com`);

          // Update the record
          console.log(`  Updating record...`);
          await prisma.conversationParticipant.update({
            where: { id: p.id },
            data: {
              userEmail: 'demo.instructor@example.com'
            }
          });
          console.log(`  ✓ Updated successfully!\n`);
        } else {
          console.log(`  → Cannot auto-fix: Unable to determine correct email\n`);
        }
      }
    }

    // Show final state
    console.log('\n=== Final Participant State ===\n');
    const allParticipants = await prisma.conversationParticipant.findMany({
      include: {
        conversation: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    allParticipants.forEach(p => {
      console.log(`${p.userName} (${p.userEmail}) - ${p.userRole} in conversation ${p.conversationId}`);
    });

  } catch (error) {
    console.error('Error fixing participant emails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixParticipantEmails();
