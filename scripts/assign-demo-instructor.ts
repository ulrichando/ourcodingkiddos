import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function assignDemoInstructor() {
  try {
    console.log('=== Assigning Demo Instructor to Demo Program ===\n');

    // Find Demo Student's program enrollment
    const demoStudent = await prisma.studentProfile.findFirst({
      where: {
        name: { contains: 'Demo Student', mode: 'insensitive' }
      },
      include: {
        programEnrollments: {
          where: {
            status: { in: ['ACTIVE', 'PENDING_PAYMENT'] }
          },
          include: {
            program: true
          }
        }
      }
    });

    if (!demoStudent || demoStudent.programEnrollments.length === 0) {
      console.log('❌ No active program enrollment found for Demo Student');
      return;
    }

    const enrollment = demoStudent.programEnrollments[0];
    const program = enrollment.program;

    console.log(`Found program: ${program.title} (${program.id})`);

    // Find Demo Instructor
    const demoInstructor = await prisma.user.findFirst({
      where: {
        email: { contains: 'demo.instructor', mode: 'insensitive' }
      }
    });

    if (!demoInstructor) {
      console.log('❌ Demo Instructor not found');
      return;
    }

    console.log(`Found instructor: ${demoInstructor.name} (${demoInstructor.email})`);

    // Check for existing class session
    const existingSession = await prisma.classSession.findFirst({
      where: {
        programId: program.id,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
      }
    });

    if (existingSession) {
      console.log(`\nUpdating existing class session...`);
      await prisma.classSession.update({
        where: { id: existingSession.id },
        data: {
          instructorEmail: demoInstructor.email,
          updatedAt: new Date()
        }
      });
      console.log('✅ Updated existing class session');
    } else {
      console.log(`\nCreating new class session...`);
      const newSession = await prisma.classSession.create({
        data: {
          title: `${program.title} - Class Session`,
          programId: program.id,
          instructorEmail: demoInstructor.email,
          sessionType: 'ONE_ON_ONE',
          language: 'JAVASCRIPT',
          ageGroup: 'AGES_7_10',
          startTime: new Date(),
          durationMinutes: (program.durationInMonths || 1) * 4 * 60,
          status: 'SCHEDULED',
          meetingUrl: null
        }
      });
      console.log(`✅ Created class session: ${newSession.id}`);
    }

    // Verify the assignment
    console.log('\n=== Verifying Assignment ===');
    const verification = await prisma.classSession.findFirst({
      where: {
        programId: program.id,
        instructorEmail: demoInstructor.email,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
      }
    });

    if (verification) {
      console.log('✅ Assignment verified successfully!');
      console.log(`   Program: ${program.title}`);
      console.log(`   Instructor: ${demoInstructor.email}`);
      console.log(`   Status: ${verification.status}`);
    } else {
      console.log('❌ Assignment verification failed');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

assignDemoInstructor();
