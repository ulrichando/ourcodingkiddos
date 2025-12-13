import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map of files and their depth for logger import
const filesToUpdate = {
  'app/api/students/route.ts': { depth: 3, errors: ['console.error("[students] create failed", err)'] },
  'app/api/students/activity/route.ts': { depth: 4, errors: ['console.error("[students/activity] Error:", error)'] },
  'app/api/students/[id]/route.ts': { depth: 4, errors: ['console.error("[students/[id]] PATCH error:", error)', 'console.error("[students/[id]] DELETE error:", error)'] },
  'app/api/students/[id]/badges/route.ts': { depth: 5, errors: ['console.error("GET /api/students/[id]/badges error:", error)'] },
  'app/api/students/[id]/profile/route.ts': { depth: 5, errors: ['console.error("[students/[id]/profile] GET error:", error)', 'console.error("[students/[id]/profile] PUT error:", error)'] },
  'app/api/students/[id]/progress/route.ts': { depth: 5, errors: ['console.error("[students/[id]/progress] Error:", error)'] },
  'app/api/students/[id]/stats/route.ts': { depth: 5, errors: ['console.error("[students/[id]/stats] Error:", error)'] },
  'app/api/student/assignments/route.ts': { depth: 4, errors: ['console.error("[student/assignments] Error:", error)'] },
  'app/api/student/badges/route.ts': { depth: 4, errors: ['console.error("GET /api/student/badges error:", error)'] },
  'app/api/student/classes/route.ts': { depth: 4, errors: ['console.error("[student/classes] Error:", error)'] },
  'app/api/student/stats/route.ts': { depth: 4, errors: ['console.error("GET /api/student/stats error:", error)'] },
  'app/api/blog/route.ts': { depth: 3, errors: ['console.error("Error fetching blog posts:", error)', 'console.error("Error creating blog post:", error)'] },
  'app/api/blog/[id]/route.ts': { depth: 4, errors: ['console.error("Error fetching blog post:", error)', 'console.error("Error updating blog post:", error)', 'console.error("Error deleting blog post:", error)'] },
  'app/api/courses/route.ts': { depth: 3, errors: ['console.error("GET /api/courses error", error)', 'console.error("POST /api/courses error", error)'], logs: ['console.log("=== GET /api/courses ===");', 'console.log("Timestamp:", new Date().toISOString());', 'console.log("Filters:", { level, language, ageGroup, published });', 'console.log(`✓ Fetched ${courses.length} courses from database`);', 'courses.forEach(c => console.log(`  - ${c.title}: isPublished=${c.isPublished}`));'] },
  'app/api/courses/[id]/route.ts': { depth: 4, errors: ['console.error("GET /api/courses/:id error", error)', 'console.error("PATCH /api/courses/:id error", error)', 'console.error("DELETE /api/courses/:id error", error)'] },
  'app/api/programs/route.ts': { depth: 3, errors: ['console.error("Error fetching programs:", error)', 'console.error("Error creating program:", error)'] },
  'app/api/programs/[id]/route.ts': { depth: 4, errors: ['console.error("Error fetching program:", error)', 'console.error("Error updating program:", error)', 'console.error("Error deleting program:", error)'] },
  'app/api/programs/[id]/enroll/route.ts': { depth: 5, errors: ['console.error("Error creating enrollment:", error)', 'console.error("Error fetching enrollments:", error)'] },
};

function updateFile(filePath, config) {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Add logger import if not present
  if (!content.includes('import { logger }')) {
    const loggerPath = '../'.repeat(config.depth) + 'lib/logger';

    // Find the position after the last import
    const lines = content.split('\n');
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }

    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, `import { logger } from "${loggerPath}";`);
      content = lines.join('\n');
      modified = true;
      console.log(`✓ Added logger import to ${filePath}`);
    }
  }

  // Replace console.error with logger calls
  if (config.errors) {
    config.errors.forEach(errorPattern => {
      if (content.includes(errorPattern)) {
        // Extract the message and determine the appropriate logger method
        const matches = errorPattern.match(/console\.error\(["']([^"']+)["']\s*,\s*error\)/);
        if (matches) {
          const message = matches[1];
          let replacement;

          // Determine if it's a DB error or general error
          if (message.toLowerCase().includes('fetch') ||
              message.toLowerCase().includes('create') ||
              message.toLowerCase().includes('update') ||
              message.toLowerCase().includes('delete')) {
            replacement = `logger.db.error("${message}", error)`;
          } else {
            replacement = `logger.error("API", "${message}", error)`;
          }

          content = content.replace(errorPattern, replacement);
          modified = true;
          console.log(`✓ Updated error logging in ${filePath}: ${message}`);
        }
      }
    });
  }

  // Remove or comment out debug console.log statements
  if (config.logs) {
    config.logs.forEach(logPattern => {
      if (content.includes(logPattern)) {
        content = content.replace(logPattern, `// ${logPattern}`);
        modified = true;
        console.log(`✓ Commented out debug log in ${filePath}`);
      }
    });
  }

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated ${filePath}\n`);
  } else {
    console.log(`⏭️  No changes needed for ${filePath}\n`);
  }
}

// Process all files
Object.entries(filesToUpdate).forEach(([file, config]) => {
  updateFile(file, config);
});

console.log('\n✅ All files processed!');
