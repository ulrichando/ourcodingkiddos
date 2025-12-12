"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {  FileText,
  Video,
  Plus,
  Search,
  ChevronRight,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import InstructorLayout from "../../../../components/instructor/InstructorLayout";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




type ContentItem = {
  id: string;
  title: string;
  type: "lesson" | "quiz" | "video";
  course: string;
  updatedAt: string;
};

export default function InstructorContentPage() {
  const { data: session } = useSession();
  const isDemoAccount = session?.user?.email?.includes("demo") || session?.user?.email?.endsWith("@example.com");

  const [content, setContent] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, show empty state since content management API isn't built yet
    setLoading(false);
    setContent([]);
  }, []);

  const filteredContent = content.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return FileText;
      case "quiz":
        return BookOpen;
      case "video":
        return Video;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lesson":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      case "quiz":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
      case "video":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <InstructorLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Demo Account Banner */}
        {isDemoAccount && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200">Demo Account</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                You&apos;re logged in as <span className="font-mono">{session?.user?.email}</span>. This is a demo account for testing purposes.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Home / Content</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Content Management</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your course content, lessons, and resources</p>
          </div>
          <button
            className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md font-semibold shadow"
            onClick={() => alert("Content creation feature coming soon!")}
          >
            <Plus className="h-4 w-4" /> Add Content
          </button>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-700">
            <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search content..."
              className="w-full outline-none text-sm text-slate-700 dark:text-slate-300 bg-transparent placeholder:text-slate-500 dark:placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-slate-500 dark:text-slate-400">Loading content...</p>
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-8 text-center">
            <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No Content Yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Start creating lessons, quizzes, and video content for your courses.
            </p>
            <button
              className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md font-semibold"
              onClick={() => alert("Content creation feature coming soon!")}
            >
              <Plus className="h-4 w-4" /> Create Your First Content
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.map((item) => {
              const Icon = getTypeIcon(item.type);
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className={`h-10 w-10 rounded-xl flex items-center justify-center ${getTypeColor(item.type)}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.course}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Updated {new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Links</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/dashboard/instructor"
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
            >
              <BookOpen className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dashboard</span>
            </Link>
            <Link
              href="/dashboard/instructor/students"
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
            >
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">My Students</span>
            </Link>
            <Link
              href="/courses"
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
            >
              <Video className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Browse Courses</span>
            </Link>
          </div>
        </div>
      </div>
    </InstructorLayout>
  );
}
