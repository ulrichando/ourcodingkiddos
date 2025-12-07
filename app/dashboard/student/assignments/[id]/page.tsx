"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Star,
  Send,
  Save,
  CheckCircle,
  AlertCircle,
  Award,
  Code,
  ExternalLink,
  Loader2,
  Trophy,
  Sparkles,
} from "lucide-react";

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
    code?: string;
    content?: string;
    repoUrl?: string;
    demoUrl?: string;
    score?: number;
    feedback?: string;
    submittedAt?: string;
    gradedAt?: string;
  };
  isPastDue: boolean;
  canSubmit: boolean;
  statusLabel: string;
}

export default function AssignmentDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    content: "",
    repoUrl: "",
    demoUrl: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  async function fetchAssignment() {
    setLoading(true);
    try {
      const res = await fetch(`/api/student/assignments`);
      if (res.ok) {
        const data = await res.json();
        const found = data.assignments?.find((a: Assignment) => a.id === assignmentId);
        if (found) {
          setAssignment(found);
          // Pre-fill form with existing submission or starter code
          setFormData({
            code: found.submission?.code || found.starterCode || "",
            content: found.submission?.content || "",
            repoUrl: found.submission?.repoUrl || "",
            demoUrl: found.submission?.demoUrl || "",
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch assignment:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDraft() {
    setSaving(true);
    try {
      const res = await fetch("/api/instructor/assignments/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId,
          ...formData,
          isDraft: true,
        }),
      });

      if (res.ok) {
        fetchAssignment();
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/instructor/assignments/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId,
          ...formData,
          isDraft: false,
        }),
      });

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          fetchAssignment();
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white dark:from-[#1a0a2e] dark:via-[#2d1052] dark:to-[#3d0f68] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white dark:from-[#1a0a2e] dark:via-[#2d1052] dark:to-[#3d0f68] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Assignment not found</h2>
          <Link
            href="/dashboard/student/assignments"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            Go back to assignments
          </Link>
        </div>
      </div>
    );
  }

  const isGraded = assignment.submission?.status === "GRADED";
  const isSubmitted = ["SUBMITTED", "IN_REVIEW", "GRADED"].includes(assignment.submission?.status || "");
  const canEdit = !isSubmitted || assignment.submission?.status === "RETURNED";

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white dark:from-[#1a0a2e] dark:via-[#2d1052] dark:to-[#3d0f68] text-slate-900 dark:text-white">
      {/* Success Celebration */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 text-white px-8 py-6 rounded-3xl shadow-2xl animate-bounce">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 animate-spin" />
              <span className="text-2xl font-bold">Assignment Submitted! 🎉</span>
              <Sparkles className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/student/assignments"
            className="p-2 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">{assignment.title}</h1>
            <div className="flex items-center gap-4 mt-1 flex-wrap text-sm">
              {assignment.dueDate && (
                <span className="flex items-center gap-1 text-slate-600 dark:text-white/70">
                  <Calendar className="h-4 w-4" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              )}
              <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-semibold">
                <Star className="h-4 w-4 fill-yellow-500" />
                +{assignment.xpReward} XP
              </span>
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <Trophy className="h-4 w-4" />
                {assignment.maxPoints} points
              </span>
            </div>
          </div>
        </div>

        {/* Grade Card (if graded) */}
        {isGraded && assignment.submission && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Award className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Great Job!</h3>
                  <p className="text-white/80">Your assignment has been graded</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">
                  {assignment.submission.score}/{assignment.maxPoints}
                </div>
                <div className="text-white/80">Score</div>
              </div>
            </div>
            {assignment.submission.feedback && (
              <div className="mt-4 p-4 bg-white/10 rounded-xl">
                <p className="font-semibold mb-1">Instructor Feedback:</p>
                <p className="text-white/90">{assignment.submission.feedback}</p>
              </div>
            )}
          </div>
        )}

        {/* Status Banner */}
        {!isGraded && assignment.submission?.status && (
          <div
            className={`rounded-2xl p-4 flex items-center gap-3 ${
              assignment.submission.status === "SUBMITTED"
                ? "bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800"
                : assignment.submission.status === "RETURNED"
                ? "bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800"
                : "bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
            }`}
          >
            {assignment.submission.status === "SUBMITTED" ? (
              <>
                <Send className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-700 dark:text-purple-300 font-medium">
                  Your assignment has been submitted and is waiting to be graded!
                </span>
              </>
            ) : assignment.submission.status === "RETURNED" ? (
              <>
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <span className="text-orange-700 dark:text-orange-300 font-medium">
                  Your instructor has asked you to revise and resubmit this assignment.
                </span>
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Draft saved. Submit when you&apos;re ready!
                </span>
              </>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white dark:bg-white/10 rounded-2xl border border-slate-200 dark:border-white/10 p-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="text-2xl">📋</span> Instructions
          </h2>
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-white/80 whitespace-pre-wrap">
            {assignment.instructions}
          </div>
        </div>

        {/* Submission Form */}
        {canEdit && (
          <div className="bg-white dark:bg-white/10 rounded-2xl border border-slate-200 dark:border-white/10 p-6 space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="text-2xl">✏️</span> Your Work
            </h2>

            {/* Code Editor */}
            {(assignment.type === "CODING_PROJECT" ||
              assignment.type === "DEBUGGING" ||
              assignment.type === "CODE_REVIEW" ||
              assignment.type === "CHALLENGE") && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Code <Code className="inline h-4 w-4 text-blue-500" />
                </label>
                <textarea
                  rows={12}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Write your code here..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-900 text-slate-100 font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Written Response */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Your Response / Explanation
              </label>
              <textarea
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your answer, explain your code, or share what you learned..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-white dark:bg-white/5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Links */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Code className="h-4 w-4" /> GitHub Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.repoUrl}
                  onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-white dark:bg-white/5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" /> Demo Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-white dark:bg-white/5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 font-semibold transition disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                Save Draft
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || (!formData.code && !formData.content)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition disabled:opacity-50 shadow-lg shadow-purple-500/30"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                Submit Assignment
              </button>
            </div>

            {assignment.isPastDue && assignment.allowLateSubmission && (
              <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                ⚠️ This assignment is past due, but late submissions are allowed.
              </p>
            )}
          </div>
        )}

        {/* View-only submission (if already submitted) */}
        {isSubmitted && !canEdit && (
          <div className="bg-white dark:bg-white/10 rounded-2xl border border-slate-200 dark:border-white/10 p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="text-2xl">📝</span> Your Submission
            </h2>

            {assignment.submission?.code && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Code:</h3>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-sm">
                  <code>{assignment.submission.code}</code>
                </pre>
              </div>
            )}

            {assignment.submission?.content && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Response:</h3>
                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl whitespace-pre-wrap">
                  {assignment.submission.content}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {assignment.submission?.repoUrl && (
                <a
                  href={assignment.submission.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Code className="h-4 w-4" /> View Repository
                </a>
              )}
              {assignment.submission?.demoUrl && (
                <a
                  href={assignment.submission.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" /> View Demo
                </a>
              )}
            </div>

            {assignment.submission?.submittedAt && (
              <p className="text-sm text-slate-500 dark:text-white/60">
                Submitted on {new Date(assignment.submission.submittedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
