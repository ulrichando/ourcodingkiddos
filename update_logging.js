const fs = require('fs');
const path = require('path');

// Files to update with their relative paths from app/api
const files = [
  'students/route.ts',
  'students/activity/route.ts',
  'students/[id]/route.ts',
  'students/[id]/badges/route.ts',
  'students/[id]/profile/route.ts',
  'students/[id]/progress/route.ts',
  'students/[id]/stats/route.ts',
  'student/assignments/route.ts',
  'student/badges/route.ts',
  'student/classes/route.ts',
  'student/stats/route.ts',
  'blog/route.ts',
  'blog/[id]/route.ts',
  'courses/route.ts',
  'courses/[id]/route.ts',
  'programs/route.ts',
  'programs/[id]/route.ts',
  'programs/[id]/enroll/route.ts',
];

// Calculate relative path to lib/logger from each file
function getLoggerImportPath(filePath) {
  const depth = filePath.split('/').length - 1;
  return '../'.repeat(depth + 2) + 'lib/logger';
}

files.forEach(file => {
  const fullPath = path.join('c:/Users/ulric/OneDrive/Documents/ourcodingkiddos/app/api', file);

  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${file} - file not found`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const loggerImport = getLoggerImportPath(file);

  // Add logger import if not present
  if (!content.includes('import { logger }')) {
    // Find the last import statement
    const importLines = content.split('\n').filter(line => line.trim().startsWith('import '));
    if (importLines.length > 0) {
      const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
      const insertPos = content.indexOf('\n', lastImportIndex) + 1;
      content = content.slice(0, insertPos) + `import { logger } from "${loggerImport}";\n` + content.slice(insertPos);
    }
  }

  // Replace console.error with logger calls
  content = content.replace(/console\.error\(\["']([^\]"']+)["']\s*,?\s*error\s*\)/g, 'logger.db.error("$1", error)');
  content = content.replace(/console\.error\(["']([^"']+Error:?)["']\s*,?\s*error\s*\)/g, 'logger.db.error("$1", error)');
  content = content.replace(/console\.error\(["']([^"']+)["']\s*,?\s*error\s*\)/g, 'logger.error("API", "$1", error)');
  content = content.replace(/console\.error\(["']Error ([^"']+)["']\s*,?\s*error\s*\)/g, 'logger.error("API", "$1", error)');

  // Remove debug console.log statements (but keep them for now to review)
  // content = content.replace(/^\s*console\.log\([^)]*\);?\s*$/gm, '');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${file}`);
});

console.log('All files updated!');
