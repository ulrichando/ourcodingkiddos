"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {  User,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Code,
  ExternalLink,
  Send,
  Star,
  Trophy,
  ArrowLeft,
} from "lucide-react";
import InstructorLayout from "../../../../../components/instructor/InstructorLayout";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




interface Submission {
  id: string;
  studentId: string;
  studentEmail: string;
  studentName: string;
  code?: string;
  content?: string;
  repoUrl?: string;
  demoUrl?: string;
  status: string;
  submittedAt?: string;
  score?: number;
  feedback?: string;
  gradedAt?: string;
  attemptNumber: number;
  assignment: {
    id: string;
    title: string;
    maxPoints: number;
    dueDate?: string;
    type: string;
  };
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: "Draft", color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-700" },
  SUBMITTED: { label: "Submitted", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
  IN_REVIEW: { label: "In Review", color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
  GRADED: { label: "Graded", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
  RETURNED: { label: "Returned", color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
  RESUBMITTED: { label: "Resubmitted", color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
  LATE: { label: "Late", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
};

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeData, setGradeData] = useState({ score: 0, feedback: "", status: "GRADED" });
  const [submittingGrade, setSubmittingGrade] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  async function fetchSubmissions() {
    setLoading(true);
    try {
      const res = await fetch(`/api/instructor/assignments/submissions?assignmentId=${assignmentId}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  }

  function openGradeModal(submission: Submission) {
    setSelectedSubmission(submission);
    setGradeData({
      score: submission.score || 0,
      feedback: submission.feedback || "",
      status: submission.status === "GRADED" ? "GRADED" : "GRADED",
    });
  }

  async function handleGrade(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSubmission) return;

    setSubmittingGrade(true);
    try {
      const res = await fetch("/api/instructor/assignments/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedSubmission.id,
          ...gradeData,
        }),
      });

      if (res.ok) {
        setSelectedSubmission(null);
        fetchSubmissions();
      } else {
        alert("Failed to save grade");
      }
    } catch (error) {
      console.error("Failed to grade:", error);
      alert("Failed to save grade");
    } finally {
      setSubmittingGrade(false);
    }
  }

  const assignmentTitle = submissions[0]?.assignment?.title || "Assignment";
  const maxPoints = submissions[0]?.assignment?.maxPoints || 100;

  const stats = {
    total: submissions.length,
    graded: submissions.filter((s) => s.status === "GRADED").length,
    pending: submissions.filter((s) => ["SUBMITTED", "RESUBMITTED", "LATE"].includes(s.status)).length,
    avgScore: submissions.filter((s) => s.score !== null && s.score !== undefined).length > 0
      ? Math.round(
          submissions
            .filter((s) => s.score !== null && s.score !== undefined)
            .reduce((acc, s) => acc + (s.score || 0), 0) /
            submissions.filter((s) => s.score !== null && s.score !== undefined).length
        )
      : 0,
  };

  return (
    <InstructorLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/instructor/assignments"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {assignmentTitle}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Review and grade student submissions
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Submissions</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.graded}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Graded</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Pending Review</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.avgScore}/{maxPoints}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Average Score</div>
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-6 animate-pulse"
              >
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-12 text-center">
            <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No submissions yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Students haven&apos;t submitted any work for this assignment
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Links
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {submissions.map((submission) => {
                    const status = statusConfig[submission.status] || statusConfig.SUBMITTED;
                    return (
                      <tr key={submission.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                              <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-slate-100">
                                {submission.studentName || "Student"}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {submission.studentEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                            {status.label}
                          </span>
                          {submission.attemptNumber > 1 && (
                            <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                              (Attempt {submission.attemptNumber})
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {submission.submittedAt
                            ? new Date(submission.submittedAt).toLocaleString()
                            : "Not submitted"}
                        </td>
                        <td className="px-6 py-4">
                          {submission.score !== null && submission.score !== undefined ? (
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4 text-amber-500" />
                              <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {submission.score}/{maxPoints}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {submission.repoUrl && (
                              <a
                                href={submission.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline text-xs flex items-center gap-1"
                              >
                                <Code className="h-3 w-3" /> Repo
                              </a>
                            )}
                            {submission.demoUrl && (
                              <a
                                href={submission.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 dark:text-green-400 hover:underline text-xs flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" /> Demo
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openGradeModal(submission)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition"
                          >
                            <Star className="h-4 w-4" />
                            {submission.status === "GRADED" ? "Update" : "Grade"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Grade Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Grade Submission
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedSubmission.studentName || selectedSubmission.studentEmail}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Submission Content */}
                {selectedSubmission.code && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Code Submission
                    </h3>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm max-h-64">
                      <code>{selectedSubmission.code}</code>
                    </pre>
                  </div>
                )}

                {selectedSubmission.content && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Written Response
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {selectedSubmission.content}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-4">
                  {selectedSubmission.repoUrl && (
                    <a
                      href={selectedSubmission.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Code className="h-4 w-4" /> View Repository
                    </a>
                  )}
                  {selectedSubmission.demoUrl && (
                    <a
                      href={selectedSubmission.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" /> View Demo
                    </a>
                  )}
                </div>

                {/* Grading Form */}
                <form onSubmit={handleGrade} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Score (out of {maxPoints})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={maxPoints}
                      required
                      value={gradeData.score}
                      onChange={(e) =>
                        setGradeData({
                          ...gradeData,
                          score: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-32 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-lg font-bold"
                    />
                    <div className="mt-2 flex gap-2">
                      {[100, 90, 80, 70, 60, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() =>
                            setGradeData({
                              ...gradeData,
                              score: Math.round((pct / 100) * maxPoints),
                            })
                          }
                          className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Feedback
                    </label>
                    <textarea
                      rows={5}
                      value={gradeData.feedback}
                      onChange={(e) =>
                        setGradeData({ ...gradeData, feedback: e.target.value })
                      }
                      placeholder="Provide constructive feedback for the student..."
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Status
                    </label>
                    <select
                      value={gradeData.status}
                      onChange={(e) =>
                        setGradeData({ ...gradeData, status: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="GRADED">Graded - Complete</option>
                      <option value="RETURNED">Return for Revision</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setSelectedSubmission(null)}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingGrade}
                      className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold transition"
                    >
                      <Send className="h-4 w-4" />
                      {submittingGrade ? "Saving..." : "Submit Grade"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}
