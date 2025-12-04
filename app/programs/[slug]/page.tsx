"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  Users,
  BookOpen,
  Star,
  CheckCircle,
  Calendar,
  Award,
  ArrowLeft,
  Play,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  thumbnailUrl: string | null;
  language: string;
  ageGroup: string;
  level: string;
  sessionCount: number;
  sessionDuration: number;
  priceCents: number;
  originalPriceCents: number | null;
  features: string[];
  curriculum: { title: string; description: string }[];
  isFeatured: boolean;
  courses: {
    course: {
      id: string;
      title: string;
      slug: string;
      thumbnailUrl: string | null;
      lessons: { id: string; title: string; slug: string }[];
    };
  }[];
  _count: { enrollments: number };
}

interface StudentProfile {
  id: string;
  name: string | null;
  avatar: string | null;
}

interface Enrollment {
  id: string;
  status: string;
  studentProfile: StudentProfile;
  sessionsCompleted: number;
}

const ageGroupLabels: Record<string, string> = {
  AGES_7_10: "Ages 7-10",
  AGES_11_14: "Ages 11-14",
  AGES_15_18: "Ages 15-18",
};

const languageLabels: Record<string, string> = {
  HTML: "HTML & CSS",
  JAVASCRIPT: "JavaScript",
  PYTHON: "Python",
  ROBLOX: "Roblox Studio",
  AI_ML: "AI & Machine Learning",
  GAME_DEVELOPMENT: "Game Development",
  WEB_DEVELOPMENT: "Web Development",
};

const levelLabels: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
  MASTER: "Master",
};

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const slug = params.slug as string;

  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [existingEnrollments, setExistingEnrollments] = useState<Enrollment[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [showCurriculum, setShowCurriculum] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const cancelled = searchParams.get("cancelled");

  useEffect(() => {
    async function fetchProgram() {
      try {
        const res = await fetch(`/api/programs/${slug}`);
        if (!res.ok) {
          throw new Error("Program not found");
        }
        const data = await res.json();
        setProgram(data.program);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load program");
      } finally {
        setLoading(false);
      }
    }

    fetchProgram();
  }, [slug]);

  useEffect(() => {
    async function fetchStudentsAndEnrollments() {
      if (!session?.user?.email || !program) return;

      // Fetch parent's students
      try {
        const studentsRes = await fetch("/api/students");
        if (studentsRes.ok) {
          const studentsData = await studentsRes.json();
          setStudents(studentsData.students || []);
        }
      } catch {
        // Ignore errors
      }

      // Fetch existing enrollments for this program
      try {
        const enrollRes = await fetch(`/api/programs/${program.id}/enroll`);
        if (enrollRes.ok) {
          const enrollData = await enrollRes.json();
          setExistingEnrollments(enrollData.enrollments || []);
        }
      } catch {
        // Ignore errors
      }
    }

    fetchStudentsAndEnrollments();
  }, [session, program]);

  const handleEnroll = async () => {
    if (!selectedStudentId) {
      setEnrollError("Please select a student to enroll");
      return;
    }

    setEnrolling(true);
    setEnrollError(null);

    try {
      const res = await fetch(`/api/programs/${program?.id}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentProfileId: selectedStudentId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create enrollment");
      }

      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setEnrollError(err instanceof Error ? err.message : "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
      </main>
    );
  }

  if (error || !program) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Program Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse All Programs
          </Link>
        </div>
      </main>
    );
  }

  const discount = program.originalPriceCents
    ? Math.round(
        ((program.originalPriceCents - program.priceCents) / program.originalPriceCents) * 100
      )
    : 0;

  const userRole = (session?.user as any)?.role;
  const isParent = userRole === "PARENT" || userRole === "ADMIN";

  // Get students not already enrolled
  const enrolledStudentIds = existingEnrollments
    .filter((e) => ["ACTIVE", "PENDING_PAYMENT", "PAUSED"].includes(e.status))
    .map((e) => e.studentProfile.id);
  const availableStudents = students.filter((s) => !enrolledStudentIds.includes(s.id));

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Cancelled Banner */}
      {cancelled && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="w-5 h-5" />
            <span>Payment was cancelled. You can try again when you&apos;re ready.</span>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Programs
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                  {languageLabels[program.language] || program.language}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {ageGroupLabels[program.ageGroup]}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {levelLabels[program.level]}
                </span>
                {program.isFeatured && (
                  <span className="flex items-center gap-1 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                    <Star className="w-4 h-4" />
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{program.title}</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">{program.description}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                <Clock className="w-6 h-6 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                <div className="font-bold text-lg">{program.sessionCount}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Sessions</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                <Calendar className="w-6 h-6 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                <div className="font-bold text-lg">{program.sessionDuration} min</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Per Session</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                <Users className="w-6 h-6 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                <div className="font-bold text-lg">{program._count.enrollments}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Enrolled</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                <Award className="w-6 h-6 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                <div className="font-bold text-lg">Certificate</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">On Completion</div>
              </div>
            </div>

            {/* What's Included */}
            {program.features && Array.isArray(program.features) && program.features.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">What&apos;s Included</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {program.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum */}
            {program.curriculum && Array.isArray(program.curriculum) && program.curriculum.length > 0 && (
              <div>
                <button
                  onClick={() => setShowCurriculum(!showCurriculum)}
                  className="flex items-center justify-between w-full text-xl font-bold mb-4"
                >
                  <span>Curriculum</span>
                  {showCurriculum ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {showCurriculum && (
                  <div className="space-y-3">
                    {program.curriculum.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-400">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            {item.description && (
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Included Courses */}
            {program.courses && program.courses.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Courses Included</h2>
                <div className="space-y-3">
                  {program.courses.map(({ course }) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800"
                    >
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        {course.thumbnailUrl ? (
                          <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <BookOpen className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {course.lessons.length} lessons
                        </p>
                      </div>
                      <Play className="w-5 h-5 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                    {formatPrice(program.priceCents)}
                  </span>
                  {program.originalPriceCents && (
                    <span className="text-lg text-slate-400 line-through">
                      {formatPrice(program.originalPriceCents)}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <div className="inline-block mt-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold px-2 py-1 rounded">
                    Save {discount}%
                  </div>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  One-time payment &bull; No subscriptions
                </p>
              </div>

              {/* Already enrolled students */}
              {existingEnrollments.length > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Currently Enrolled
                  </h4>
                  {existingEnrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        {enrollment.studentProfile.name || "Student"} - {enrollment.sessionsCompleted}/
                        {program.sessionCount} sessions
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Enrollment Form */}
              {session ? (
                isParent ? (
                  <div className="space-y-4">
                    {availableStudents.length > 0 ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Select Student to Enroll
                          </label>
                          <select
                            value={selectedStudentId}
                            onChange={(e) => {
                              setSelectedStudentId(e.target.value);
                              setEnrollError(null);
                            }}
                            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                          >
                            <option value="">Choose a student...</option>
                            {availableStudents.map((student) => (
                              <option key={student.id} value={student.id}>
                                {student.name || "Unnamed Student"}
                              </option>
                            ))}
                          </select>
                        </div>

                        {enrollError && (
                          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                            {enrollError}
                          </div>
                        )}

                        <button
                          onClick={handleEnroll}
                          disabled={enrolling || !selectedStudentId}
                          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          {enrolling ? "Processing..." : "Enroll Now"}
                        </button>
                      </>
                    ) : students.length > 0 ? (
                      <div className="text-center py-4">
                        <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          All your students are enrolled in this program!
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                          Add a student profile first to enroll in programs.
                        </p>
                        <Link
                          href="/dashboard/parent"
                          className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold"
                        >
                          Go to Dashboard
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Parent accounts can enroll students in programs.
                    </p>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                    Sign in as a parent to enroll your child.
                  </p>
                  <Link
                    href="/auth/login"
                    className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-center hover:brightness-110 transition"
                  >
                    Sign In to Enroll
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block w-full py-3 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-center hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    Create Account
                  </Link>
                </div>
              )}

              {/* Features list */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Live instruction from expert teachers
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Hands-on projects and assignments
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Certificate upon completion
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Parent progress reports
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
