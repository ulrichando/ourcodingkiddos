"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {  ClipboardList,
  Code,
  Bug,
  BookOpen,
  Video,
  Sparkles,
  Trophy,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowLeft,
  Play,
  FileText,
  Loader2,
  Send,
  ChevronRight,
  Flame,
  Award,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  type: string;
  language?: string;
  dueDate?: string;
  maxPoints: number;
  xpReward: number;
  starterCode?: string;
  allowLateSubmission: boolean;
  submission?: {
    id: string;
    status: string;
    score?: number;
    feedback?: string;
    submittedAt?: string;
    gradedAt?: string;
  };
  isPastDue: boolean;
  canSubmit: boolean;
  statusLabel: string;
}

const typeConfig: Record<string, { icon: any; label: string; color: string; emoji: string }> = {
  CODING_PROJECT: { icon: Code, label: "Coding Project", color: "from-blue-400 to-cyan-500", emoji: "💻" },
  CODE_REVIEW: { icon: FileText, label: "Code Review", color: "from-purple-400 to-violet-500", emoji: "🔍" },
  DEBUGGING: { icon: Bug, label: "Bug Hunt", color: "from-red-400 to-orange-500", emoji: "🐛" },
  QUIZ: { icon: ClipboardList, label: "Quiz", color: "from-amber-400 to-yellow-500", emoji: "📝" },
  READING: { icon: BookOpen, label: "Reading", color: "from-green-400 to-emerald-500", emoji: "📖" },
  VIDEO: { icon: Video, label: "Video", color: "from-pink-400 to-rose-500", emoji: "🎬" },
  CREATIVE: { icon: Sparkles, label: "Creative", color: "from-indigo-400 to-purple-500", emoji: "🎨" },
  CHALLENGE: { icon: Trophy, label: "Challenge", color: "from-orange-400 to-red-500", emoji: "🏆" },
};

const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
  "Not Started": { bg: "bg-slate-100 dark:bg-slate-700", text: "text-slate-600 dark:text-slate-300", icon: Clock },
  "In Progress": { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", icon: Play },
  "Submitted": { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", icon: Send },
  "Being Reviewed": { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400", icon: Clock },
  "Graded": { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400", icon: CheckCircle },
  "Needs Revision": { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", icon: AlertCircle },
  "Past Due": { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400", icon: AlertCircle },
  "Submitted Late": { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400", icon: Clock },
  "Resubmitted": { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400", icon: Send },
};

export default function StudentAssignmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchAssignments();
  }, [filter]);

  async function fetchAssignments() {
    setLoading(true);
    try {
      const statusParam = filter === "all" ? "" : `?status=${filter}`;
      const res = await fetch(`/api/student/assignments${statusParam}`);
      if (res.ok) {
        const data = await res.json();
        setAssignments(data.assignments || []);
      }
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    } finally {
      setLoading(false);
    }
  }

  const stats = {
    total: assignments.length,
    completed: assignments.filter((a) => a.submission?.status === "GRADED").length,
    pending: assignments.filter((a) => !a.submission || !["GRADED"].includes(a.submission.status)).length,
    totalXp: assignments
      .filter((a) => a.submission?.status === "GRADED")
      .reduce((acc, a) => acc + a.xpReward, 0),
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white dark:from-[#1a0a2e] dark:via-[#2d1052] dark:to-[#3d0f68] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white dark:from-[#1a0a2e] dark:via-[#2d1052] dark:to-[#3d0f68] text-slate-900 dark:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/student"
            className="p-2 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">📚</span>
              My Assignments
            </h1>
            <p className="text-slate-600 dark:text-white/70">
              Complete assignments to earn XP and level up!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-white/10 rounded-2xl border border-slate-200 dark:border-white/10 p-4 text-center">
            <div className="text-3xl mb-1">📋</div>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-slate-500 dark:text-white/60">Total</div>
          </div>
          <div className="bg-white dark:bg-white/10 rounded-2xl border border-slate-200 dark:border-white/10 p-4 text-center">
            <div className="text-3xl mb-1">⏳</div>
            <div className="text-2xl font-bold text-amber-500">{stats.pending}</div>
            <div className="text-xs text-slate-500 dark:text-white/60">To Do</div>
          </div>
          <div className="bg-white dark:bg-white/10 rounded-2xl border border-slate-200 dark:border-white/10 p-4 text-center">
            <div className="text-3xl mb-1">✅</div>
            <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
            <div className="text-xs text-slate-500 dark:text-white/60">Done</div>
          </div>
          <div className="bg-white dark:bg-white/10 rounded-2xl border border-slate-200 dark:border-white/10 p-4 text-center">
            <div className="text-3xl mb-1">⭐</div>
            <div className="text-2xl font-bold text-yellow-500">{stats.totalXp}</div>
            <div className="text-xs text-slate-500 dark:text-white/60">XP Earned</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(["all", "pending", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                filter === f
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white dark:bg-white/10 text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/20"
              }`}
            >
              {f === "all" ? "📋 All" : f === "pending" ? "⏳ To Do" : "✅ Completed"}
            </button>
          ))}
        </div>

        {/* Assignments List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
          </div>
        ) : assignments.length === 0 ? (
          <div className="bg-white dark:bg-white/10 rounded-3xl border border-slate-200 dark:border-white/10 p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2">
              {filter === "completed" ? "No completed assignments yet!" : "No assignments right now!"}
            </h3>
            <p className="text-slate-600 dark:text-white/70">
              {filter === "completed"
                ? "Complete some assignments to see them here"
                : "Check back later for new assignments from your instructor"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const config = typeConfig[assignment.type] || typeConfig.CODING_PROJECT;
              const statusConfig = statusColors[assignment.statusLabel] || statusColors["Not Started"];
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={assignment.id}
                  className="bg-white dark:bg-white/10 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:shadow-xl dark:hover:border-purple-500/50 transition group"
                >
                  {/* Color bar */}
                  <div className={`h-2 bg-gradient-to-r ${config.color}`} />

                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}
                      >
                        {config.emoji}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <h3 className="font-bold text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                              {assignment.title}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {assignment.statusLabel}
                            </span>
                          </div>

                          {/* Score badge if graded */}
                          {assignment.submission?.status === "GRADED" && assignment.submission.score !== undefined && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-500/20 dark:to-amber-500/20 border border-yellow-200 dark:border-yellow-500/30">
                              <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                              <span className="font-bold text-yellow-700 dark:text-yellow-300">
                                {assignment.submission.score}/{assignment.maxPoints}
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-slate-600 dark:text-white/70 mt-2 line-clamp-2">
                          {assignment.description}
                        </p>

                        <div className="flex items-center gap-4 mt-3 flex-wrap text-sm">
                          <span className={`px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/80`}>
                            {config.label}
                          </span>
                          {assignment.dueDate && (
                            <span className="flex items-center gap-1 text-slate-500 dark:text-white/60">
                              <Calendar className="h-4 w-4" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-semibold">
                            <Star className="h-4 w-4 fill-yellow-500" />
                            +{assignment.xpReward} XP
                          </span>
                        </div>

                        {/* Feedback if graded */}
                        {assignment.submission?.feedback && (
                          <div className="mt-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <p className="text-sm text-green-700 dark:text-green-300">
                              <strong>Feedback:</strong> {assignment.submission.feedback}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="sm:ml-4 flex-shrink-0">
                        <Link
                          href={`/dashboard/student/assignments/${assignment.id}`}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${
                            assignment.submission?.status === "GRADED"
                              ? "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20"
                              : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30"
                          }`}
                        >
                          {assignment.submission?.status === "GRADED" ? (
                            <>View <ChevronRight className="h-4 w-4" /></>
                          ) : assignment.submission?.status === "DRAFT" ? (
                            <>Continue <Play className="h-4 w-4" /></>
                          ) : assignment.submission?.status === "RETURNED" ? (
                            <>Revise <AlertCircle className="h-4 w-4" /></>
                          ) : (
                            <>Start <Play className="h-4 w-4" /></>
                          )}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
