import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Assign a company email to an approved instructor
 * This is used after approving an instructor application from a personal email
 */
async function assignInstructorCompanyEmail(
  currentEmail: string,
  companyEmail: string
) {
  console.log('\n=== Assigning Company Email to Instructor ===\n');

  // Validate company email
  if (!companyEmail.endsWith('@ourcodingkiddos.com')) {
    console.error('❌ Error: Company email must end with @ourcodingkiddos.com');
    return;
  }

  // Find the instructor with current email
  const instructor = await prisma.user.findUnique({
    where: { email: currentEmail },
    include: {
      accounts: true,
    },
  });

  if (!instructor) {
    console.error(`❌ Error: No user found with email ${currentEmail}`);
    return;
  }

  if (instructor.role !== 'INSTRUCTOR') {
    console.error(`❌ Error: User ${currentEmail} is not an instructor (role: ${instructor.role})`);
    return;
  }

  console.log(`📋 Current Instructor:`);
  console.log(`   Email: ${instructor.email}`);
  console.log(`   Name: ${instructor.name}`);
  console.log(`   Role: ${instructor.role}`);
  console.log(`   Status: ${instructor.accountStatus}`);
  console.log(`   Has Google OAuth: ${instructor.accounts.length > 0 ? 'Yes' : 'No'}\n`);

  // Check if company email is already taken
  const existingCompanyUser = await prisma.user.findUnique({
    where: { email: companyEmail },
  });

  if (existingCompanyUser) {
    console.error(`❌ Error: Company email ${companyEmail} is already in use`);
    return;
  }

  // Create new company email account
  console.log(`Creating new company email account: ${companyEmail}...`);

  const companyUser = await prisma.user.create({
    data: {
      email: companyEmail,
      name: instructor.name,
      role: 'INSTRUCTOR',
      accountStatus: 'APPROVED',
      emailVerified: new Date(),
      image: instructor.image,
    },
  });

  console.log(`✅ Created company email account\n`);

  // Transfer all classes from old account to new account
  const classesTransferred = await prisma.classSession.updateMany({
    where: { instructorEmail: currentEmail },
    data: {
      instructorEmail: companyEmail,
      instructorId: companyUser.id,
    },
  });

  console.log(`✅ Transferred ${classesTransferred.count} classes to company account\n`);

  // Update old account status to indicate they should use company email
  await prisma.user.update({
    where: { email: currentEmail },
    data: {
      accountStatus: 'REJECTED', // Block login from personal email
    },
  });

  console.log('✅ Updated old account status (personal email login blocked)\n');

  console.log('📊 Summary:');
  console.log(`   Old Email: ${currentEmail} (blocked)`);
  console.log(`   New Email: ${companyEmail} (active)`);
  console.log(`   Classes Transferred: ${classesTransferred.count}`);
  console.log(`   Status: APPROVED\n`);

  console.log('📋 Next Steps:');
  console.log(`   1. Create Google Workspace account: ${companyEmail}`);
  console.log(`   2. Instructor logs in with "Sign in with Google"`);
  console.log(`   3. Select ${companyEmail} Google Workspace account`);
  console.log(`   4. System links Google OAuth to company account`);
  console.log(`   5. Ready to teach!\n`);

  console.log('💡 Instructor will receive error if they try personal email:');
  console.log('   "Instructors must use a company email address (@ourcodingkiddos.com) to sign in."\n');

  await prisma.$disconnect();
}

// Example usage:
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Usage: npx tsx scripts/assign-instructor-company-email.ts <current-email> <company-email>');
  console.log('Example: npx tsx scripts/assign-instructor-company-email.ts teacher@gmail.com instructor@ourcodingkiddos.com');
  process.exit(1);
}

const [currentEmail, companyEmail] = args;
assignInstructorCompanyEmail(currentEmail, companyEmail).catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
