import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testContactsAPI() {
  try {
    // Test with demo parent
    const parentEmail = 'demo.parent@example.com';

    const parent = await prisma.user.findUnique({
      where: { email: parentEmail },
      include: {
        parentProfile: {
          include: {
            children: {
              include: {
                programEnrollments: {
                  where: {
                    status: { in: ["ACTIVE", "PENDING_PAYMENT"] }
                  }
                }
              }
            }
          }
        }
      }
    });

    console.log('=== Testing Contacts API Logic ===\n');
    console.log(`Parent: ${parent?.name} (${parent?.email})`);
    console.log(`Has Parent Profile: ${!!parent?.parentProfile}`);

    if (!parent?.parentProfile) {
      console.log('NO PARENT PROFILE - API would return empty contacts');
      return;
    }

    console.log(`\nChildren: ${parent.parentProfile.children.length}`);

    const contacts: any[] = [];

    // Test children lookup
    for (const child of parent.parentProfile.children) {
      console.log(`\nProcessing child: ${child.name}`);
      console.log(`  Child userId: ${child.userId}`);

      const studentUser = await prisma.user.findUnique({
        where: { id: child.userId },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true
        }
      });

      console.log(`  Found student user: ${!!studentUser}`);
      if (studentUser) {
        console.log(`    Email: ${studentUser.email}`);
        console.log(`    Name: ${studentUser.name}`);
        console.log(`    Role: ${studentUser.role}`);

        if (studentUser.email) {
          contacts.push({
            id: studentUser.id,
            email: studentUser.email,
            name: studentUser.name || child.name || "Student",
            type: "student",
            role: studentUser.role,
            image: studentUser.image,
            relationship: "Child"
          });
          console.log(`    ✓ Added to contacts`);
        } else {
          console.log(`    ✗ No email - skipped`);
        }
      }
    }

    // Test instructor lookup
    const programIds = parent.parentProfile.children.flatMap(
      child => child.programEnrollments.map(e => e.programId)
    );

    console.log(`\nProgram IDs: ${programIds.join(', ') || 'NONE'}`);

    if (programIds.length > 0) {
      const classSessions = await prisma.classSession.findMany({
        where: {
          programId: { in: programIds },
          status: { in: ["SCHEDULED", "IN_PROGRESS"] }
        },
        select: {
          instructorEmail: true
        },
        distinct: ["instructorEmail"]
      });

      console.log(`Found ${classSessions.length} class sessions with instructors`);

      let instructorEmails = classSessions
        .map(s => s.instructorEmail)
        .filter(Boolean) as string[];

      console.log(`Instructor emails: ${instructorEmails.join(', ') || 'NONE'}`);

      if (instructorEmails.length > 0) {
        const instructors = await prisma.user.findMany({
          where: {
            email: { in: instructorEmails },
            role: "INSTRUCTOR",
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        });

        for (const instructor of instructors) {
          contacts.push({
            id: instructor.id,
            email: instructor.email,
            name: instructor.name,
            type: "instructor",
            role: "INSTRUCTOR",
            image: instructor.image,
            relationship: "Instructor"
          });
        }
        console.log(`Added ${instructors.length} instructors to contacts`);
      } else {
        console.log('No instructors found - using fallback');
        const allInstructors = await prisma.user.findMany({
          where: { role: "INSTRUCTOR" },
          select: { id: true, name: true, email: true, image: true }
        });

        for (const instructor of allInstructors) {
          contacts.push({
            id: instructor.id,
            email: instructor.email,
            name: instructor.name,
            type: "instructor",
            role: "INSTRUCTOR",
            image: instructor.image,
            relationship: "Instructor"
          });
        }
        console.log(`Added ${allInstructors.length} instructors (fallback)`);
      }
    }

    console.log(`\n=== FINAL CONTACTS ===`);
    console.log(`Total contacts: ${contacts.length}`);
    console.log(`Children: ${contacts.filter(c => c.type === 'student').length}`);
    console.log(`Instructors: ${contacts.filter(c => c.type === 'instructor').length}`);

    console.log('\nContacts:');
    for (const contact of contacts) {
      console.log(`  - ${contact.name} (${contact.email}) [${contact.type}]`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testContactsAPI();
