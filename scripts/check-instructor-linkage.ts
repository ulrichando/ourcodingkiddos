import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkInstructorLinkage() {
  try {
    console.log('=== Checking Instructor-Student Linkage ===\n');

    // Find Demo Parent
    const demoParent = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { contains: 'demo.parent', mode: 'insensitive' } },
          { email: { contains: 'lizzy', mode: 'insensitive' } },
          { email: { contains: 'talisiaaa', mode: 'insensitive' } }
        ]
      },
      include: {
        parentProfile: {
          include: {
            children: {
              include: {
                programEnrollments: {
                  include: {
                    program: true
                  }
                }
              }
            }
          }
        }
      }
    });

    console.log('Parent Found:', demoParent?.email);
    console.log('Has Parent Profile:', !!demoParent?.parentProfile);
    console.log('Number of Children:', demoParent?.parentProfile?.children?.length || 0);

    if (demoParent?.parentProfile?.children) {
      for (const child of demoParent.parentProfile.children) {
        console.log(`\nChild: ${child.name} (${child.id})`);
        console.log(`Program Enrollments: ${child.programEnrollments.length}`);

        for (const enrollment of child.programEnrollments) {
          console.log(`  - Program: ${enrollment.program.title}`);
          console.log(`    Status: ${enrollment.status}`);
          console.log(`    Program ID: ${enrollment.programId}`);
        }

        // Get program IDs
        const programIds = child.programEnrollments.map(e => e.programId);

        if (programIds.length > 0) {
          console.log(`\n  Looking for class sessions for programs: ${programIds.join(', ')}`);

          // Find class sessions for these programs
          const classSessions = await prisma.classSession.findMany({
            where: {
              programId: { in: programIds }
            },
            select: {
              id: true,
              title: true,
              instructorEmail: true,
              programId: true,
              status: true
            }
          });

          console.log(`  Found ${classSessions.length} class sessions`);

          for (const session of classSessions) {
            console.log(`    - ${session.title}`);
            console.log(`      Instructor: ${session.instructorEmail}`);
            console.log(`      Status: ${session.status}`);
            console.log(`      Program ID: ${session.programId}`);
          }
        } else {
          console.log('  No program enrollments found!');
        }
      }
    }

    // Also check for demo.instructor
    console.log('\n\n=== Demo Instructor Details ===');
    const demoInstructor = await prisma.user.findFirst({
      where: {
        email: { contains: 'demo.instructor', mode: 'insensitive' }
      }
    });

    console.log('Instructor Found:', demoInstructor?.email);
    console.log('Instructor Name:', demoInstructor?.name);

    // Check what class sessions this instructor has
    const instructorSessions = await prisma.classSession.findMany({
      where: {
        instructorEmail: demoInstructor?.email
      },
      include: {
        program: true
      }
    });

    console.log(`\nInstructor has ${instructorSessions.length} class sessions:`);
    for (const session of instructorSessions) {
      console.log(`  - ${session.title}`);
      console.log(`    Program: ${session.program?.title || 'No program linked'}`);
      console.log(`    Status: ${session.status}`);
    }

  } catch (error) {
    console.error('Error checking linkage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkInstructorLinkage();
