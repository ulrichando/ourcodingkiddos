'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';
import { toggleCoursePublishStatus, deleteCourse } from './actions';

type Course = {
  id: string;
  title: string;
  description?: string | null;
  language: string;
  level: string;
  ageGroup: string;
  isPublished: boolean;
  totalXp?: number | null;
  _count?: {
    lessons: number;
  };
};

interface CoursesClientProps {
  initialCourses: Course[];
}

/**
 * Client Component: Handles all interactivity
 *
 * - Search and filters
 * - Publish/unpublish toggle
 * - Edit/View/Delete actions
 * - Optimistic UI updates
 */
export default function CoursesClient({ initialCourses }: CoursesClientProps) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updatingCourseId, setUpdatingCourseId] = useState<string | null>(null);

  // Filter courses based on search and filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      searchTerm === '' ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || course.language === filterLanguage;
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && course.isPublished) ||
      (filterStatus === 'draft' && !course.isPublished);
    return matchesSearch && matchesLanguage && matchesLevel && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: courses.length,
    published: courses.filter((c) => c.isPublished).length,
    draft: courses.filter((c) => !c.isPublished).length,
    totalLessons: courses.reduce((acc, c) => acc + (c._count?.lessons || 0), 0),
  };

  // Get unique values for filters
  const uniqueLanguages = Array.from(new Set(courses.map((c) => c.language)));
  const uniqueLevels = Array.from(new Set(courses.map((c) => c.level)));

  // Navigation handlers
  const handleViewCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  const handleEditCourse = (courseId: string) => {
    router.push(`/dashboard/admin/content?course=${courseId}`);
  };

  // Delete course handler with Server Action
  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log(`Deleting course: ${courseTitle} (${courseId})`);

      const result = await deleteCourse(courseId);

      if (result.success) {
        // Optimistically remove from UI
        setCourses(courses.filter((c) => c.id !== courseId));

        // Refresh to ensure consistency
        router.refresh();

        alert('Course deleted successfully!');
      } else {
        alert(`Failed to delete course: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Failed to delete course. Please try again.');
    }
  };

  // Toggle publish status with Server Action
  const handleTogglePublish = async (courseId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'publish' : 'unpublish';

    console.log("=== TOGGLE PUBLISH (SERVER ACTION) ===");
    console.log("Course ID:", courseId);
    console.log("Current Status:", currentStatus);
    console.log("New Status:", newStatus);

    // Prevent concurrent updates
    if (updatingCourseId) {
      console.log("Already updating a course, skipping");
      return;
    }

    setUpdatingCourseId(courseId);

    try {
      // Call server action (direct database update + revalidation)
      console.log("Calling server action...");
      const result = await toggleCoursePublishStatus(courseId, newStatus);

      if (result.success) {
        console.log("✓ Server action successful");

        // Optimistic UI update for instant feedback
        setCourses(prev =>
          prev.map(c =>
            c.id === courseId ? { ...c, isPublished: newStatus } : c
          )
        );

        // Refresh to get fresh server-rendered data
        // This ensures perfect consistency
        console.log("Calling router.refresh()...");
        router.refresh();

        console.log(`✓ Successfully ${action}ed course`);
        alert(`Course ${action}ed successfully!`);
      } else {
        console.error(`✗ Server action failed:`, result.error);
        alert(`Failed to ${action} course: ${result.error}`);
      }
    } catch (error) {
      console.error(`✗ Exception during ${action}:`, error);
      alert(`Failed to ${action} course. Please try again.`);
    } finally {
      setUpdatingCourseId(null);
      console.log("=== END TOGGLE PUBLISH ===\n");
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Courses</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Course Management
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Create, edit, and manage all courses and learning content
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/admin/content')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Total Courses</span>
            <BookOpen className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">All courses</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Published</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.published}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Live courses</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Drafts</span>
            <XCircle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.draft}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unpublished</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Total Lessons</span>
            <FileText className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.totalLessons}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across all courses</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          >
            <option value="all">All Languages</option>
            {uniqueLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          >
            <option value="all">All Levels</option>
            {uniqueLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-400" />
          <p className="text-slate-600 dark:text-slate-400 mb-2">No courses found</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      course.isPublished
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
                    }`}
                  >
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {course.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {course.description || 'No description'}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-2">
                  <p className="text-slate-500 dark:text-slate-400">Language</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{course.language}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-2">
                  <p className="text-slate-500 dark:text-slate-400">Level</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{course.level}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-2">
                  <p className="text-slate-500 dark:text-slate-400">Lessons</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {course._count?.lessons || 0}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCourse(course.id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleViewCourse(course.id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-lg text-sm transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleTogglePublish(course.id, course.isPublished)}
                  disabled={updatingCourseId === course.id}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    updatingCourseId === course.id
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                      : course.isPublished
                      ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/40'
                      : 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/40'
                  }`}
                >
                  {updatingCourseId === course.id ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      {course.isPublished ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      {course.isPublished ? 'Unpublish' : 'Publish'}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
