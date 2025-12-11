import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function investigateConversations() {
  try {
    console.log('=== Investigating Conversations ===\n');

    // Find all conversations
    const conversations = await prisma.conversation.findMany({
      include: {
        participants: {
          select: {
            userEmail: true,
            userName: true,
            userRole: true
          }
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    });

    console.log(`Total conversations found: ${conversations.length}\n`);

    for (const conv of conversations) {
      console.log(`--- Conversation ID: ${conv.id} ---`);
      console.log(`Title: ${conv.title}`);
      console.log(`Type: ${conv.type}`);
      console.log(`Created: ${conv.createdAt}`);
      console.log(`Last Message: ${conv.lastMessageAt}`);
      console.log(`Message Count: ${conv._count.messages}`);
      console.log(`Participants (${conv.participants.length}):`);

      conv.participants.forEach((p, idx) => {
        console.log(`  ${idx + 1}. ${p.userName || 'Unknown'} (${p.userEmail}) - ${p.userRole}`);
      });

      console.log('');
    }

    // Look specifically for conversations involving "Lizzy"
    console.log('\n=== Conversations with "Lizzy" in participant names ===\n');

    const lizzyConvs = conversations.filter(c =>
      c.participants.some(p =>
        p.userName?.toLowerCase().includes('lizzy') ||
        p.userEmail?.toLowerCase().includes('lizzy')
      )
    );

    if (lizzyConvs.length === 0) {
      console.log('No conversations found with "Lizzy" in participant names or emails.');
    } else {
      lizzyConvs.forEach(conv => {
        console.log(`Conversation ID: ${conv.id}`);
        console.log(`Title: ${conv.title}`);
        console.log(`Participants:`);
        conv.participants.forEach(p => {
          console.log(`  - ${p.userName} (${p.userEmail}) - ${p.userRole}`);
        });
        console.log('');
      });
    }

    // Look for "Demo Parent" conversations
    console.log('\n=== Conversations with "Demo Parent" ===\n');

    const demoConvs = conversations.filter(c =>
      c.participants.some(p =>
        p.userName?.toLowerCase().includes('demo') ||
        p.userEmail?.toLowerCase().includes('demo')
      )
    );

    if (demoConvs.length === 0) {
      console.log('No conversations found with "Demo" in participant names or emails.');
    } else {
      demoConvs.forEach(conv => {
        console.log(`Conversation ID: ${conv.id}`);
        console.log(`Title: ${conv.title}`);
        console.log(`Participants:`);
        conv.participants.forEach(p => {
          console.log(`  - ${p.userName} (${p.userEmail}) - ${p.userRole}`);
        });
        console.log('');
      });
    }

  } catch (error) {
    console.error('Error investigating conversations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

investigateConversations();
