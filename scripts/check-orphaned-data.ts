import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkOrphanedData() {
  console.log('\n=== Checking for Orphaned Data ===\n');

  // Check all unique emails referenced in various tables
  const allUsers = await prisma.user.findMany({
    select: { email: true, role: true },
  });
  const userEmails = new Set(allUsers.map(u => u.email));

  console.log('Total users in database:', allUsers.length);
  console.log('');

  // 1. Check ClassSessions for non-existent instructors
  const classSessions = await prisma.classSession.findMany({
    select: { instructorEmail: true },
    distinct: ['instructorEmail'],
  });

  console.log('📋 ClassSession Instructor Emails:');
  const orphanedInstructors: string[] = [];
  classSessions.forEach(s => {
    if (s.instructorEmail && !userEmails.has(s.instructorEmail)) {
      orphanedInstructors.push(s.instructorEmail);
    }
  });
  if (orphanedInstructors.length > 0) {
    console.log('  ❌ Non-existent instructors:', orphanedInstructors);
  } else {
    console.log('  ✅ All instructor emails exist');
  }

  // 2. Check Bookings
  const bookings = await prisma.booking.findMany({
    select: {
      studentId: true,
      instructorId: true,
    },
  });

  const allUserIds = new Set((await prisma.user.findMany({ select: { id: true } })).map(u => u.id));
  const orphanedStudentIds = bookings.filter(b => !allUserIds.has(b.studentId)).map(b => b.studentId);
  const orphanedInstructorIds = bookings.filter(b => !allUserIds.has(b.instructorId)).map(b => b.instructorId);

  console.log('');
  console.log('📅 Bookings:');
  console.log('  Total bookings:', bookings.length);
  if (orphanedStudentIds.length > 0) {
    console.log('  ❌ Orphaned student IDs:', new Set(orphanedStudentIds).size);
  } else if (bookings.length > 0) {
    console.log('  ✅ All student IDs exist');
  }
  if (orphanedInstructorIds.length > 0) {
    console.log('  ❌ Orphaned instructor IDs:', new Set(orphanedInstructorIds).size);
  } else if (bookings.length > 0) {
    console.log('  ✅ All instructor IDs exist');
  }

  // 3. Check ProgramEnrollments
  const programEnrollments = await prisma.programEnrollment.findMany({
    select: {
      parentEmail: true,
      studentProfileId: true,
    },
  });

  const allStudentProfiles = new Set((await prisma.studentProfile.findMany({ select: { id: true } })).map(s => s.id));
  const orphanedParentEmails = programEnrollments.filter(e => !userEmails.has(e.parentEmail)).map(e => e.parentEmail);
  const orphanedStudentProfileIds = programEnrollments.filter(e => !allStudentProfiles.has(e.studentProfileId)).map(e => e.studentProfileId);

  console.log('');
  console.log('🎓 Program Enrollments:');
  console.log('  Total enrollments:', programEnrollments.length);
  if (orphanedParentEmails.length > 0) {
    console.log('  ❌ Orphaned parent emails:', new Set(orphanedParentEmails));
  } else if (programEnrollments.length > 0) {
    console.log('  ✅ All parent emails exist');
  }
  if (orphanedStudentProfileIds.length > 0) {
    console.log('  ❌ Orphaned student profile IDs:', new Set(orphanedStudentProfileIds).size);
  } else if (programEnrollments.length > 0) {
    console.log('  ✅ All student profile IDs exist');
  }

  // 4. Check Enrollments (course enrollments)
  const enrollments = await prisma.enrollment.findMany({
    select: { userId: true },
  });

  const orphanedEnrollmentUserIds = enrollments.filter(e => !allUserIds.has(e.userId)).map(e => e.userId);

  console.log('');
  console.log('📚 Course Enrollments:');
  console.log('  Total enrollments:', enrollments.length);
  if (orphanedEnrollmentUserIds.length > 0) {
    console.log('  ❌ Orphaned user IDs:', new Set(orphanedEnrollmentUserIds).size);
  } else if (enrollments.length > 0) {
    console.log('  ✅ All user IDs exist');
  }

  console.log('');
  await prisma.$disconnect();
}

checkOrphanedData().catch(console.error);
