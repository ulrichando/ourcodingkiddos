import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPublishedPrograms() {
  try {
    console.log('=== Testing Published Programs Query ===\n');

    // Simulate the API query
    const programs = await prisma.program.findMany({
      where: {
        isPublished: true
      },
      include: {
        enrollments: {
          where: {
            status: { in: ["ACTIVE", "PENDING_PAYMENT"] }
          }
        },
        classSessions: {
          where: {
            status: { in: ["SCHEDULED", "IN_PROGRESS"] }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            instructorEmail: true
          }
        }
      },
      orderBy: {
        title: 'asc'
      }
    });

    console.log(`Found ${programs.length} published programs\n`);

    for (const program of programs) {
      console.log(`Program: ${program.title}`);
      console.log(`  ID: ${program.id}`);
      console.log(`  Published: ${program.isPublished ? 'Yes' : 'No'}`);
      console.log(`  Enrollments: ${program.enrollments.length}`);
      console.log(`  Current Instructor: ${program.classSessions[0]?.instructorEmail || 'None'}`);
      console.log('');
    }

    // Get instructor details for programs that have assigned instructors
    const instructorEmails = programs
      .map(p => p.classSessions[0]?.instructorEmail)
      .filter(Boolean) as string[];

    console.log(`Instructor emails to fetch: ${instructorEmails.join(', ') || 'NONE'}`);

    const instructors = await prisma.user.findMany({
      where: {
        email: { in: instructorEmails },
        role: "INSTRUCTOR"
      },
      select: {
        email: true,
        name: true
      }
    });

    const instructorMap = new Map(instructors.map(i => [i.email, i]));

    // Transform programs to include current instructor info
    const transformedPrograms = programs.map(program => {
      const instructorEmail = program.classSessions[0]?.instructorEmail;
      const instructor = instructorEmail ? instructorMap.get(instructorEmail) : null;

      return {
        id: program.id,
        title: program.title,
        description: program.description,
        enrollmentCount: program.enrollments.length,
        currentInstructor: instructor ? {
          email: instructor.email,
          name: instructor.name || instructor.email
        } : null
      };
    });

    console.log('\n=== Final API Response ===');
    console.log(JSON.stringify({ programs: transformedPrograms }, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPublishedPrograms();
