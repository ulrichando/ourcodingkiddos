"use client";

import { useState, useEffect, use } from "react";
import AdminLayout from "../../../../../components/admin/AdminLayout";
import Link from "next/link";
import {  User,
  Mail,
  Calendar,
  Award,
  BookOpen,
  Trophy,
  Star,
  Clock,
  TrendingUp,
  ChevronLeft,
  GraduationCap,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  BarChart3,
  Activity,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




type StudentDetails = {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  joinedAt: string;
  parentEmail?: string;
  parentName?: string;
  totalXp: number;
  currentLevel: number;
  enrollments: {
    id: string;
    courseTitle: string;
    enrolledAt: string;
    progress: number;
    lessonsCompleted: number;
    totalLessons: number;
    lastActivity?: string;
  }[];
  badges: {
    id: string;
    name: string;
    description: string;
    earnedAt: string;
    icon?: string;
  }[];
  certificates: {
    id: string;
    courseName: string;
    issuedAt: string;
  }[];
  quizScores: {
    quizTitle: string;
    score: number;
    maxScore: number;
    completedAt: string;
  }[];
  activityLog: {
    action: string;
    details: string;
    timestamp: string;
  }[];
};

export default function StudentProgressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "achievements" | "activity">("overview");

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      const res = await fetch(`/api/admin/students/${id}`);
      if (res.ok) {
        const data = await res.json();
        setStudent(data.student);
      } else {
        setError("Failed to load student details");
      }
    } catch (err) {
      console.error("Error fetching student:", err);
      setError("Failed to load student details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-slate-500 dark:text-slate-400">Loading student details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !student) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <p className="text-red-700 dark:text-red-400">{error || "Student not found"}</p>
            <Link
              href="/dashboard/admin/users"
              className="mt-4 inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Users
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const overallProgress =
    student.enrollments.length > 0
      ? Math.round(
          student.enrollments.reduce((sum, e) => sum + e.progress, 0) / student.enrollments.length
        )
      : 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/admin/users"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Students</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Student Progress
            </h1>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 dark:border-purple-800"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-purple-200 dark:border-purple-800">
                  {student.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {student.name}
                </h2>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full">
                  Level {student.currentLevel}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {student.email}
                </span>
                {student.age && (
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" /> {student.age} years old
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Joined{" "}
                  {new Date(student.joinedAt).toLocaleDateString()}
                </span>
              </div>
              {student.parentName && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Parent: {student.parentName} ({student.parentEmail})
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {student.totalXp.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total XP</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-2">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {overallProgress}%
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Progress</p>
              </div>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {student.enrollments.length}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Courses Enrolled</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {student.enrollments.reduce((sum, e) => sum + e.lessonsCompleted, 0)}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Lessons Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {student.badges.length}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Badges Earned</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {student.certificates.length}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Certificates</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-4">
            {student.enrollments.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-600 dark:text-slate-400">No courses enrolled yet</p>
              </div>
            ) : (
              student.enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {enrollment.courseTitle}
                    </h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">
                        {enrollment.lessonsCompleted} of {enrollment.totalLessons} lessons
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {enrollment.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                  {enrollment.lastActivity && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last activity: {new Date(enrollment.lastActivity).toLocaleString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Badges */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Badges ({student.badges.length})
              </h3>
              {student.badges.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm">No badges earned yet</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {student.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-2">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {badge.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(badge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certificates */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-500" />
                Certificates ({student.certificates.length})
              </h3>
              {student.certificates.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  No certificates earned yet
                </p>
              ) : (
                <div className="space-y-3">
                  {student.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {cert.courseName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Issued {new Date(cert.issuedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Recent Activity
            </h3>
            {student.activityLog.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {student.activityLog.map((activity, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                    <div>
                      <p className="text-sm text-slate-900 dark:text-slate-100">{activity.action}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{activity.details}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
