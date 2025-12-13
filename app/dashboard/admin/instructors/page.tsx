"use client";

import AdminLayout from "../../../../components/admin/AdminLayout";
import { useEffect, useState } from "react";
import {  Users,
  Clock,
  Star,
  DollarSign,
  Calendar,
  TrendingUp,
  BookOpen,
  Video,
  CheckCircle,
  ChevronRight,
  Search,
  RefreshCw,
  Mail,
  BarChart3,
  Award,
} from "lucide-react";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




type Instructor = {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  stats: {
    totalSessions: number;
    completedSessions: number;
    totalStudents: number;
    totalHours: number;
    revenue: number;
    avgRating: number;
    reviewCount: number;
  };
  specialties: string[];
  availability: {
    available: boolean;
    nextSlot?: string;
  };
};

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "students" | "sessions" | "rating" | "revenue">("sessions");

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/instructors");
      if (!res.ok) throw new Error("Failed to load instructors");
      const data = await res.json();
      setInstructors(data.instructors || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredInstructors = instructors
    .filter((instructor) => {
      if (!searchTerm) return true;
      return (
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "students":
          return b.stats.totalStudents - a.stats.totalStudents;
        case "sessions":
          return b.stats.totalSessions - a.stats.totalSessions;
        case "rating":
          return b.stats.avgRating - a.stats.avgRating;
        case "revenue":
          return b.stats.revenue - a.stats.revenue;
        default:
          return 0;
      }
    });

  // Aggregate stats
  const totalStats = {
    instructors: instructors.length,
    totalSessions: instructors.reduce((sum, i) => sum + i.stats.totalSessions, 0),
    totalStudents: instructors.reduce((sum, i) => sum + i.stats.totalStudents, 0),
    totalRevenue: instructors.reduce((sum, i) => sum + i.stats.revenue, 0),
    avgRating:
      instructors.length > 0
        ? instructors.reduce((sum, i) => sum + i.stats.avgRating, 0) / instructors.length
        : 0,
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Instructors</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Instructor Performance
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Track instructor metrics, ratings, and session history
            </p>
          </div>
          <button
            onClick={fetchInstructors}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {totalStats.instructors}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Instructors</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {totalStats.totalSessions}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Sessions</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {totalStats.totalStudents}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Students Taught</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {totalStats.avgRating.toFixed(1)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Avg Rating</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  ${(totalStats.totalRevenue / 100).toLocaleString()}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value="sessions">Sort by Sessions</option>
              <option value="students">Sort by Students</option>
              <option value="rating">Sort by Rating</option>
              <option value="revenue">Sort by Revenue</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Instructors Grid */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Loading instructors...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        ) : filteredInstructors.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <Award className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-600 dark:text-slate-400">No instructors found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstructors.map((instructor) => (
              <div
                key={instructor.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {instructor.avatar ? (
                      <img
                        src={instructor.avatar}
                        alt={instructor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg">
                        {instructor.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {instructor.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {instructor.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      instructor.availability.available
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {instructor.availability.available ? "Available" : "Busy"}
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                      <Video className="w-4 h-4" />
                      <span className="text-xs">Sessions</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {instructor.stats.totalSessions}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">Students</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {instructor.stats.totalStudents}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Hours</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {instructor.stats.totalHours}h
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs">Revenue</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      ${(instructor.stats.revenue / 100).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= instructor.stats.avgRating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-300 dark:text-slate-600"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {instructor.stats.avgRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {instructor.stats.reviewCount} reviews
                  </span>
                </div>

                {/* Specialties */}
                {instructor.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {instructor.specialties.slice(0, 3).map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/dashboard/admin/instructors/${instructor.id}`}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-1"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={`mailto:${instructor.email}`}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
