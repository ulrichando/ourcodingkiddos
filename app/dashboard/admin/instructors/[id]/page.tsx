"use client";

import { useState, useEffect, use } from "react";
import AdminLayout from "../../../../../components/admin/AdminLayout";
import Link from "next/link";
import {  Award,
  Mail,
  Calendar,
  Clock,
  Star,
  Users,
  Video,
  DollarSign,
  TrendingUp,
  ChevronLeft,
  BookOpen,
  CheckCircle,
  XCircle,
  BarChart3,
  Activity,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




type InstructorDetails = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedAt: string;
  stats: {
    totalSessions: number;
    completedSessions: number;
    cancelledSessions: number;
    totalStudents: number;
    activeStudents: number;
    totalHours: number;
    revenue: number;
    avgRating: number;
    reviewCount: number;
  };
  specialties: string[];
  certifications: string[];
  availability: {
    available: boolean;
    schedule: {
      day: string;
      slots: string[];
    }[];
  };
  recentSessions: {
    id: string;
    studentName: string;
    courseName: string;
    date: string;
    duration: number;
    status: "completed" | "cancelled" | "upcoming";
  }[];
  reviews: {
    id: string;
    studentName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  courses: {
    id: string;
    title: string;
    studentsEnrolled: number;
  }[];
};

export default function InstructorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [instructor, setInstructor] = useState<InstructorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "sessions" | "reviews" | "courses">("overview");

  useEffect(() => {
    fetchInstructorDetails();
  }, [id]);

  const fetchInstructorDetails = async () => {
    try {
      const res = await fetch(`/api/admin/instructors/${id}`);
      if (res.ok) {
        const data = await res.json();
        setInstructor(data.instructor);
      } else {
        setError("Failed to load instructor details");
      }
    } catch (err) {
      console.error("Error fetching instructor:", err);
      setError("Failed to load instructor details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-slate-500 dark:text-slate-400">Loading instructor details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !instructor) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <p className="text-red-700 dark:text-red-400">{error || "Instructor not found"}</p>
            <Link
              href="/dashboard/admin/instructors"
              className="mt-4 inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Instructors
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const completionRate = instructor.stats.totalSessions > 0
    ? Math.round((instructor.stats.completedSessions / instructor.stats.totalSessions) * 100)
    : 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "sessions", label: "Sessions", icon: Video },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "courses", label: "Courses", icon: BookOpen },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/admin/instructors"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Instructors</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Instructor Profile
            </h1>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {instructor.avatar ? (
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 dark:border-purple-800"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-purple-200 dark:border-purple-800">
                  {instructor.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {instructor.name}
                </h2>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  instructor.availability.available
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                }`}>
                  {instructor.availability.available ? "Available" : "Busy"}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                <a href={`mailto:${instructor.email}`} className="flex items-center gap-1 hover:text-purple-600">
                  <Mail className="w-4 h-4" /> {instructor.email}
                </a>
                {instructor.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" /> {instructor.phone}
                  </span>
                )}
                {instructor.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {instructor.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Joined {new Date(instructor.joinedAt).toLocaleDateString()}
                </span>
              </div>

              {instructor.bio && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {instructor.bio}
                </p>
              )}

              {/* Specialties */}
              {instructor.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {instructor.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stats Summary */}
            <div className="flex gap-6 md:flex-col md:items-end">
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center mb-1">
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
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {instructor.stats.avgRating.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {instructor.stats.reviewCount} reviews
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Total Sessions</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {instructor.stats.totalSessions}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Completed</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {instructor.stats.completedSessions}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Students</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {instructor.stats.totalStudents}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Hours Taught</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {instructor.stats.totalHours}h
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-pink-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Revenue</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              ${(instructor.stats.revenue / 100).toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-cyan-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Completion</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {completionRate}%
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Availability Schedule */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Weekly Schedule
              </h3>
              {instructor.availability.schedule.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm">No schedule set</p>
              ) : (
                <div className="space-y-3">
                  {instructor.availability.schedule.map((day) => (
                    <div key={day.day} className="flex items-start gap-3">
                      <span className="w-24 text-sm font-medium text-slate-700 dark:text-slate-300">
                        {day.day}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {day.slots.map((slot, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certifications */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Certifications
              </h3>
              {instructor.certifications.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm">No certifications added</p>
              ) : (
                <div className="space-y-2">
                  {instructor.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{cert}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Recent Sessions</h3>
            </div>
            {instructor.recentSessions.length === 0 ? (
              <div className="p-8 text-center">
                <Video className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No sessions yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Student</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Course</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Date</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Duration</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {instructor.recentSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">{session.studentName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{session.courseName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{new Date(session.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{session.duration} min</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          session.status === "completed"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                            : session.status === "cancelled"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        }`}>
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            {instructor.reviews.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                <Star className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No reviews yet</p>
              </div>
            ) : (
              instructor.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{review.studentName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "courses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {instructor.courses.length === 0 ? (
              <div className="col-span-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No courses assigned</p>
              </div>
            ) : (
              instructor.courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">{course.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {course.studentsEnrolled} students enrolled
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/admin/courses?id=${course.id}`}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium"
                  >
                    View Course →
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
