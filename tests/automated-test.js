/**
 * Automated Test Suite for Our Coding Kiddos Platform
 *
 * Tests:
 * 1. Database connectivity
 * 2. API endpoints
 * 3. Page accessibility
 * 4. Server Actions structure
 */

const BASE_URL = 'http://localhost:3000';

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  console.log('\n🧪 Running Automated Tests...\n');
  console.log('='.repeat(60));

  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
  }

  console.log('='.repeat(60));
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('🎉 All tests passed! System is ready for production.\n');
  } else {
    console.log('⚠️  Some tests failed. Please review the errors above.\n');
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Test 1: Courses API returns data
test('Courses API returns data', async () => {
  const response = await fetch(`${BASE_URL}/api/courses`);
  if (!response.ok) throw new Error(`Status: ${response.status}`);

  const json = await response.json();
  if (json.status !== 'ok') throw new Error('API status not ok');
  if (!Array.isArray(json.data)) throw new Error('Data is not an array');
  if (json.data.length === 0) throw new Error('No courses found');
});

// Test 2: Courses API returns correct structure
test('Courses API returns correct structure', async () => {
  const response = await fetch(`${BASE_URL}/api/courses`);
  const json = await response.json();

  const course = json.data[0];
  if (!course.id) throw new Error('Course missing id');
  if (!course.title) throw new Error('Course missing title');
  if (typeof course.isPublished !== 'boolean') throw new Error('Course missing isPublished');
  if (!Array.isArray(course.lessons)) throw new Error('Course missing lessons array');
});

// Test 3: Courses API has published and unpublished
test('Database has published and unpublished courses', async () => {
  const response = await fetch(`${BASE_URL}/api/courses`);
  const json = await response.json();

  const published = json.data.filter(c => c.isPublished);
  const unpublished = json.data.filter(c => !c.isPublished);

  if (published.length === 0) throw new Error('No published courses found');
  if (unpublished.length === 0) throw new Error('No unpublished courses found');

  console.log(`   📊 ${published.length} published, ${unpublished.length} unpublished`);
});

// Test 4: Courses API has debug info
test('Courses API includes debug information', async () => {
  const response = await fetch(`${BASE_URL}/api/courses`);
  const json = await response.json();

  if (!json._debug) throw new Error('Missing debug info');
  if (!json._debug.timestamp) throw new Error('Missing debug timestamp');
  if (typeof json._debug.count !== 'number') throw new Error('Missing debug count');
});

// Test 5: Public pages are accessible
test('Public pages are accessible', async () => {
  const pages = ['/', '/courses', '/schedule'];

  for (const page of pages) {
    const response = await fetch(`${BASE_URL}${page}`);
    if (!response.ok) throw new Error(`${page} returned ${response.status}`);
  }
});

// Test 6: Admin courses page loads
test('Admin courses page is accessible', async () => {
  const response = await fetch(`${BASE_URL}/dashboard/admin/courses`);
  if (!response.ok) throw new Error(`Status: ${response.status}`);

  const html = await response.text();
  if (!html.includes('DOCTYPE') && !html.includes('html')) {
    throw new Error('Invalid HTML response');
  }
});

// Test 7: Server Actions file exists
test('Server Actions file structure is valid', async () => {
  const fs = require('fs');
  const path = require('path');

  const actionsPath = path.join(__dirname, '../app/dashboard/admin/courses/actions.ts');
  if (!fs.existsSync(actionsPath)) throw new Error('actions.ts not found');

  const content = fs.readFileSync(actionsPath, 'utf8');
  if (!content.includes("'use server'")) throw new Error("Missing 'use server' directive");
  if (!content.includes('toggleCoursePublishStatus')) throw new Error('Missing toggleCoursePublishStatus function');
  if (!content.includes('revalidatePath')) throw new Error('Missing revalidatePath');
});

// Test 8: CoursesList component exists
test('CoursesList server component exists', async () => {
  const fs = require('fs');
  const path = require('path');

  const listPath = path.join(__dirname, '../app/dashboard/admin/courses/CoursesList.tsx');
  if (!fs.existsSync(listPath)) throw new Error('CoursesList.tsx not found');

  const content = fs.readFileSync(listPath, 'utf8');
  if (content.includes('"use client"')) throw new Error('CoursesList should be a server component');
  if (!content.includes('prisma.course.findMany')) throw new Error('Missing database query');
  if (!content.includes('getServerSession')) throw new Error('Missing authentication');
});

// Test 9: CoursesClient component exists
test('CoursesClient component exists', async () => {
  const fs = require('fs');
  const path = require('path');

  const clientPath = path.join(__dirname, '../app/dashboard/admin/courses/CoursesClient.tsx');
  if (!fs.existsSync(clientPath)) throw new Error('CoursesClient.tsx not found');

  const content = fs.readFileSync(clientPath, 'utf8');
  if (!content.includes("'use client'")) throw new Error('CoursesClient must be a client component');
  if (!content.includes('handleTogglePublish')) throw new Error('Missing toggle function');
  if (!content.includes('initialCourses')) throw new Error('Missing initialCourses prop');
});

// Test 10: Page uses Suspense
test('Page.tsx uses Suspense pattern', async () => {
  const fs = require('fs');
  const path = require('path');

  const pagePath = path.join(__dirname, '../app/dashboard/admin/courses/page.tsx');
  if (!fs.existsSync(pagePath)) throw new Error('page.tsx not found');

  const content = fs.readFileSync(pagePath, 'utf8');
  if (!content.includes('Suspense')) throw new Error('Missing Suspense');
  if (!content.includes('CoursesList')) throw new Error('Missing CoursesList import');
  if (!content.includes("dynamic = 'force-dynamic'")) throw new Error('Missing cache config');
});

// Test 11: Notification system exists
test('Student notification system exists', async () => {
  const fs = require('fs');
  const path = require('path');

  const studentsPath = path.join(__dirname, '../app/api/students/route.ts');
  if (!fs.existsSync(studentsPath)) throw new Error('students route not found');

  const content = fs.readFileSync(studentsPath, 'utf8');
  if (!content.includes('createNotification')) throw new Error('Missing notification call');
  if (!content.includes('Student Added Successfully')) throw new Error('Missing success notification');
});

// Run all tests
runTests();
