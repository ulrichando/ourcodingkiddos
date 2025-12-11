import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPrograms() {
  try {
    console.log('=== All Programs ===\n');

    const programs = await prisma.program.findMany({
      include: {
        enrollments: {
          where: {
            status: { in: ["ACTIVE", "PENDING_PAYMENT"] }
          }
        },
        classSessions: {
          where: {
            status: { in: ["SCHEDULED", "IN_PROGRESS"] }
          }
        }
      },
      orderBy: {
        title: 'asc'
      }
    });

    console.log(`Found ${programs.length} programs total\n`);

    for (const program of programs) {
      console.log(`Program: ${program.title}`);
      console.log(`  ID: ${program.id}`);
      console.log(`  Published: ${program.isPublished ? 'Yes' : 'No'}`);
      console.log(`  Enrollments: ${program.enrollments.length}`);
      console.log(`  Class Sessions: ${program.classSessions.length}`);
      if (program.classSessions.length > 0) {
        for (const session of program.classSessions) {
          console.log(`    - ${session.instructorEmail} (${session.status})`);
        }
      }
      console.log('');
    }

    // Check what the API would return
    console.log('=== What API Returns ===\n');
    const apiPrograms = programs.map(program => {
      const instructorEmail = program.classSessions[0]?.instructorEmail;
      return {
        id: program.id,
        title: program.title,
        enrollmentCount: program.enrollments.length,
        currentInstructor: instructorEmail || null
      };
    });

    console.log(JSON.stringify(apiPrograms, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPrograms();
