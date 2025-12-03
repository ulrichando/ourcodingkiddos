import { PrismaClient } from '../generated/prisma-client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== ALL COURSES IN DATABASE ===\n');

  const allCourses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      language: true,
      level: true,
      ageGroup: true,
      isPublished: true,
      _count: { select: { lessons: true } }
    },
    orderBy: { language: 'asc' }
  });

  // Group by language
  const coursesByLanguage: Record<string, typeof allCourses> = {};
  for (const course of allCourses) {
    if (!coursesByLanguage[course.language]) {
      coursesByLanguage[course.language] = [];
    }
    coursesByLanguage[course.language].push(course);
  }

  for (const [lang, courses] of Object.entries(coursesByLanguage)) {
    console.log(`\n--- ${lang} (${courses.length} courses) ---`);
    for (const c of courses) {
      console.log(`  • ${c.title} [${c.level}] - ${c._count.lessons} lessons - ${c.isPublished ? '✅ Published' : '❌ Not Published'}`);
    }
  }

  console.log('\n\n=== ENGINEERING COURSES DETAIL ===\n');

  const engineeringCourses = await prisma.course.findMany({
    where: { language: 'ENGINEERING' },
    include: {
      lessons: {
        select: { id: true, title: true, orderIndex: true, isPublished: true },
        orderBy: { orderIndex: 'asc' }
      }
    }
  });

  if (engineeringCourses.length === 0) {
    console.log('❌ No engineering courses found in the database!');
  } else {
    for (const course of engineeringCourses) {
      console.log(`\n📚 ${course.title}`);
      console.log(`   Level: ${course.level} | Age: ${course.ageGroup} | Published: ${course.isPublished}`);
      console.log(`   Lessons (${course.lessons.length}):`);
      for (const lesson of course.lessons) {
        console.log(`     ${lesson.orderIndex}. ${lesson.title} ${lesson.isPublished ? '✅' : '❌'}`);
      }
    }
  }

  console.log('\n\n=== SUMMARY ===');
  console.log(`Total courses: ${allCourses.length}`);
  console.log(`Engineering courses: ${engineeringCourses.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
