#!/bin/bash

# Script to apply dark mode classes systematically across all pages
# This applies the established pattern from existing dark mode implementations

echo "Applying dark mode classes to all pages..."

# Define the dark mode replacement patterns
# Format: "pattern|replacement"

declare -a patterns=(
  # Main backgrounds
  "bg-white\([^-]\)|bg-white dark:bg-slate-800\1"
  "bg-slate-50\([^-]\)|bg-slate-50 dark:bg-slate-900\1"
  "bg-slate-100\([^-]\)|bg-slate-100 dark:bg-slate-700\1"
  "bg-slate-200\([^-]\)|bg-slate-200 dark:bg-slate-600\1"

  # Text colors
  "text-slate-900\([^-]\)|text-slate-900 dark:text-slate-100\1"
  "text-slate-800\([^-]\)|text-slate-800 dark:text-slate-200\1"
  "text-slate-700\([^-]\)|text-slate-700 dark:text-slate-300\1"
  "text-slate-600\([^-]\)|text-slate-600 dark:text-slate-400\1"
  "text-slate-500\([^-]\)|text-slate-500 dark:text-slate-400\1"

  # Borders
  "border-slate-200\([^-]\)|border-slate-200 dark:border-slate-700\1"
  "border-slate-300\([^-]\)|border-slate-300 dark:border-slate-600\1"
  "border-slate-100\([^-]\)|border-slate-100 dark:border-slate-600\1"

  # Backgrounds for badges/tags
  "bg-purple-100\([^-]\)|bg-purple-100 dark:bg-purple-900/30\1"
  "bg-blue-100\([^-]\)|bg-blue-100 dark:bg-blue-900/30\1"
  "bg-green-100\([^-]\)|bg-green-100 dark:bg-green-900/30\1"
  "bg-amber-100\([^-]\)|bg-amber-100 dark:bg-amber-900/30\1"
  "bg-pink-100\([^-]\)|bg-pink-100 dark:bg-pink-900/30\1"
  "bg-orange-100\([^-]\)|bg-orange-100 dark:bg-orange-900/30\1"

  # Text for badges/tags
  "text-purple-700\([^-]\)|text-purple-700 dark:text-purple-400\1"
  "text-blue-700\([^-]\)|text-blue-700 dark:text-blue-400\1"
  "text-green-700\([^-]\)|text-green-700 dark:text-green-400\1"
  "text-amber-700\([^-]\)|text-amber-700 dark:text-amber-400\1"
  "text-pink-700\([^-]\)|text-pink-700 dark:text-pink-400\1"
  "text-orange-700\([^-]\)|text-orange-700 dark:text-orange-400\1"
)

# List of files to process (excluding already processed ones)
files_to_process=(
  "app/dashboard/parent/page.tsx"
  "app/dashboard/student/page.tsx"
  "app/dashboard/admin/courses/page.tsx"
  "app/dashboard/admin/sessions/page.tsx"
  "app/dashboard/admin/reports/page.tsx"
  "app/dashboard/admin/finance/page.tsx"
  "app/dashboard/admin/users/page.tsx"
  "app/dashboard/admin/instructors/page.tsx"
  "app/dashboard/instructor/content/page.tsx"
  "app/dashboard/instructor/create-class/page.tsx"
  "app/dashboard/instructor/students/page.tsx"
  "app/dashboard/parent/add-student/page.tsx"
  "app/lessons/[id]/page.tsx"
  "app/schedule/page.tsx"
  "app/pricing/page.tsx"
  "app/playground/page.tsx"
  "app/subscription/page.tsx"
  "app/checkout/page.tsx"
  "app/certificates/page.tsx"
  "app/certificates/[id]/page.tsx"
  "app/notifications/page.tsx"
  "app/contact/page.tsx"
  "app/privacy/page.tsx"
  "app/terms/page.tsx"
  "app/cookies/page.tsx"
  "app/courses/[slug]/page.tsx"
)

echo "This is a DRY RUN. Would process ${#files_to_process[@]} files."
echo "Manual review and editing is recommended for best results."
