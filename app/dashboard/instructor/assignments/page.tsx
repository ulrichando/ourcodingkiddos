"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {  FileText,
  Code,
  Bug,
  BookOpen,
  Video,
  Sparkles,
  Trophy,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  ChevronRight,
  Calendar,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import InstructorLayout from "../../../../components/instructor/InstructorLayout";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




interface Assignment {
  id: string;
  title: string;
  description: string;
  type: string;
  language?: string;
  ageGroup?: string;
  dueDate?: string;
  maxPoints: number;
  xpReward: number;
  isPublished: boolean;
  createdAt: string;
  submissionStats: {
    total: number;
    submitted: number;
    graded: number;
    pending: number;
  };
}

const assignmentTypeConfig: Record<
  string,
  { icon: any; label: string; color: string; bg: string }
> = {
  CODING_PROJECT: {
    icon: Code,
    label: "Coding Project",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  CODE_REVIEW: {
    icon: FileText,
    label: "Code Review",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  DEBUGGING: {
    icon: Bug,
    label: "Debugging",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
  },
  QUIZ: {
    icon: FileText,
    label: "Quiz",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  READING: {
    icon: BookOpen,
    label: "Reading",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  VIDEO: {
    icon: Video,
    label: "Video",
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-100 dark:bg-pink-900/30",
  },
  CREATIVE: {
    icon: Sparkles,
    label: "Creative",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  CHALLENGE: {
    icon: Trophy,
    label: "Challenge",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-900/30",
  },
};

const languageLabels: Record<string, string> = {
  HTML: "HTML",
  CSS: "CSS",
  JAVASCRIPT: "JavaScript",
  PYTHON: "Python",
  ROBLOX: "Roblox Studio",
  AI_ML: "AI & ML",
  GAME_DEVELOPMENT: "Game Dev",
  WEB_DEVELOPMENT: "Web Dev",
  MOBILE_DEVELOPMENT: "Mobile",
  ROBOTICS: "Robotics",
  ENGINEERING: "Engineering",
  CAREER_PREP: "Career Prep",
};

export default function InstructorAssignmentsPage() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    type: "CODING_PROJECT",
    language: "",
    ageGroup: "",
    dueDate: "",
    maxPoints: 100,
    xpReward: 50,
    starterCode: "",
    isPublished: false,
    allowLateSubmission: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, [filter]);

  async function fetchAssignments() {
    setLoading(true);
    try {
      const statusParam = filter === "all" ? "" : `&status=${filter}`;
      const res = await fetch(`/api/instructor/assignments?${statusParam}`);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = "/api/instructor/assignments";
      const method = editingId ? "PATCH" : "POST";
      const body = editingId ? { id: editingId, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowCreateModal(false);
        resetForm();
        fetchAssignments();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save assignment");
      }
    } catch (error) {
      console.error("Failed to save assignment:", error);
      alert("Failed to save assignment");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const res = await fetch(`/api/instructor/assignments?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchAssignments();
      } else {
        alert("Failed to delete assignment");
      }
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      instructions: "",
      type: "CODING_PROJECT",
      language: "",
      ageGroup: "",
      dueDate: "",
      maxPoints: 100,
      xpReward: 50,
      starterCode: "",
      isPublished: false,
      allowLateSubmission: true,
    });
    setEditingId(null);
  }

  function openEditModal(assignment: Assignment) {
    setFormData({
      title: assignment.title,
      description: assignment.description,
      instructions: "",
      type: assignment.type,
      language: assignment.language || "",
      ageGroup: assignment.ageGroup || "",
      dueDate: assignment.dueDate ? assignment.dueDate.split("T")[0] : "",
      maxPoints: assignment.maxPoints,
      xpReward: assignment.xpReward,
      starterCode: "",
      isPublished: assignment.isPublished,
      allowLateSubmission: true,
    });
    setEditingId(assignment.id);
    setShowCreateModal(true);
  }

  const filteredAssignments = assignments.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: assignments.length,
    published: assignments.filter((a) => a.isPublished).length,
    pendingGrading: assignments.reduce(
      (acc, a) => acc + a.submissionStats.pending,
      0
    ),
  };

  return (
    <InstructorLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Home / Assignments</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Assignments
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Create and manage assignments for your students
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
          >
            <Plus className="h-4 w-4" /> Create Assignment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.total}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Total Assignments
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.published}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Published
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.pendingGrading}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Pending Grading
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "published", "draft"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f
                    ? "bg-purple-500 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Assignments List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-6 animate-pulse"
              >
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-12 text-center">
            <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No assignments yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Create your first assignment to get started
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              <Plus className="h-4 w-4" /> Create Assignment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => {
              const typeConfig =
                assignmentTypeConfig[assignment.type] ||
                assignmentTypeConfig.CODING_PROJECT;
              const Icon = typeConfig.icon;
              const isPastDue =
                assignment.dueDate && new Date(assignment.dueDate) < new Date();

              return (
                <div
                  key={assignment.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-6 hover:shadow-lg transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Icon & Title */}
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-xl ${typeConfig.bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`h-6 w-6 ${typeConfig.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                            {assignment.title}
                          </h3>
                          {!assignment.isPublished && (
                            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                              Draft
                            </span>
                          )}
                          {isPastDue && (
                            <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                              Past Due
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                          {assignment.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3 flex-wrap">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${typeConfig.bg} ${typeConfig.color}`}
                          >
                            {typeConfig.label}
                          </span>
                          {assignment.language && (
                            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                              {languageLabels[assignment.language] ||
                                assignment.language}
                            </span>
                          )}
                          {assignment.dueDate && (
                            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Calendar className="h-3 w-3" />
                              Due:{" "}
                              {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Trophy className="h-3 w-3" />
                            {assignment.maxPoints} pts
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-6 lg:gap-8">
                      <div className="flex gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {assignment.submissionStats.total}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Submissions
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {assignment.submissionStats.graded}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Graded
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                            {assignment.submissionStats.pending}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Pending
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/instructor/assignments/${assignment.id}`}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition"
                          title="View submissions"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => openEditModal(assignment)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {editingId ? "Edit Assignment" : "Create New Assignment"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Build a To-Do List App"
                  />
                </div>

                {/* Type & Language */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Assignment Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      {Object.entries(assignmentTypeConfig).map(
                        ([key, config]) => (
                          <option key={key} value={key}>
                            {config.label}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Language
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) =>
                        setFormData({ ...formData, language: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="">Select language</option>
                      {Object.entries(languageLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                    placeholder="Brief overview of the assignment..."
                  />
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Instructions *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.instructions}
                    onChange={(e) =>
                      setFormData({ ...formData, instructions: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                    placeholder="Step-by-step instructions for completing the assignment..."
                  />
                </div>

                {/* Due Date & Points */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Max Points
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxPoints}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxPoints: parseInt(e.target.value) || 100,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      XP Reward
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.xpReward}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          xpReward: parseInt(e.target.value) || 50,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                {/* Starter Code */}
                {(formData.type === "CODING_PROJECT" ||
                  formData.type === "DEBUGGING" ||
                  formData.type === "CODE_REVIEW") && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Starter Code (Optional)
                    </label>
                    <textarea
                      rows={6}
                      value={formData.starterCode}
                      onChange={(e) =>
                        setFormData({ ...formData, starterCode: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-mono text-sm"
                      placeholder="// Add starter code here..."
                    />
                  </div>
                )}

                {/* Options */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPublished: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Publish immediately
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowLateSubmission}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          allowLateSubmission: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Allow late submissions
                    </span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold transition"
                  >
                    {submitting
                      ? "Saving..."
                      : editingId
                      ? "Update Assignment"
                      : "Create Assignment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}
