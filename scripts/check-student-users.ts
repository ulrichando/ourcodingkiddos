import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStudentUsers() {
  try {
    const students = await prisma.studentProfile.findMany({
      include: {
        user: true
      }
    });

    console.log('=== Students and Their User Accounts ===\n');
    for (const student of students) {
      console.log(`Student: ${student.name || 'Unnamed'}`);
      console.log(`  Student ID: ${student.id}`);
      console.log(`  User ID: ${student.userId}`);

      if (student.user) {
        console.log(`  User Email: ${student.user.email}`);
        console.log(`  User Role: ${student.user.role}`);
      } else {
        console.log(`  User: NOT FOUND`);
      }
      console.log('');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStudentUsers();
