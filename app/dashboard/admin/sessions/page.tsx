"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Button from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  Calendar,
  Clock,
  Users,
  Video,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Loader2,
  X,
} from "lucide-react";

type ClassSession = {
  id: string;
  title: string;
  description?: string;
  sessionType: string;
  language: string;
  ageGroup: string;
  startTime: string;
  durationMinutes: number;
  maxStudents?: number;
  enrolledCount: number;
  priceCents: number;
  meetingUrl?: string;
  status: string;
  instructorEmail: string;
  instructor?: {
    name: string;
    email: string;
  };
  _count?: {
    bookings: number;
  };
};

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  IN_PROGRESS: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
  COMPLETED: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
};

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sessionType: "GROUP",
    language: "JAVASCRIPT",
    ageGroup: "AGES_11_14",
    startTime: "",
    durationMinutes: "60",
    maxStudents: "10",
    priceCents: "0",
    meetingUrl: "",
    instructorEmail: ""
  });

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const res = await fetch("/api/admin/sessions");
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          durationMinutes: parseInt(formData.durationMinutes),
          maxStudents: parseInt(formData.maxStudents),
          priceCents: parseInt(formData.priceCents)
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Class session created successfully!");
        setShowCreateModal(false);
        setFormData({
          title: "",
          description: "",
          sessionType: "GROUP",
          language: "JAVASCRIPT",
          ageGroup: "AGES_11_14",
          startTime: "",
          durationMinutes: "60",
          maxStudents: "10",
          priceCents: "0",
          meetingUrl: "",
          instructorEmail: ""
        });
        loadSessions();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to create session:", error);
      alert("Failed to create session. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;

    try {
      const res = await fetch(`/api/admin/sessions?id=${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message || "Session deleted successfully!");
        loadSessions();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
      alert("Failed to delete session.");
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || session.status === filterStatus;
    const matchesType = filterType === "all" || session.sessionType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    scheduled: sessions.filter((s) => s.status === "SCHEDULED").length,
    inProgress: sessions.filter((s) => s.status === "IN_PROGRESS").length,
    completed: sessions.filter((s) => s.status === "COMPLETED").length,
    cancelled: sessions.filter((s) => s.status === "CANCELLED").length,
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 0) return "Started " + Math.abs(diffMins) + " mins ago";
      return "In " + diffMins + " minutes";
    } else if (diffHours > 0 && diffHours < 24) {
      return "In " + diffHours + " hours";
    } else if (diffHours < 0 && diffHours > -24) {
      return Math.abs(diffHours) + " hours ago";
    } else {
      return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Sessions</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Session Management
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Schedule, monitor, and manage all live teaching sessions
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            Create Session
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Scheduled</span>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {stats.scheduled}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Upcoming sessions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">In Progress</span>
                <Video className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {stats.inProgress}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Active now</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Completed</span>
                <CheckCircle className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {stats.completed}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Past sessions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Cancelled</span>
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {stats.cancelled}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cancelled sessions</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="all">All Status</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="all">All Types</option>
                <option value="ONE_ON_ONE">1:1 Sessions</option>
                <option value="GROUP">Group Sessions</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="CAMP">Camp</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Sessions Table */}
        <Card className="border-0 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-slate-500 dark:text-slate-400"
                    >
                      No sessions found
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {session.title}
                          </span>
                          {session.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                              {session.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {session.instructor?.name || session.instructorEmail}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                          {session.sessionType.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {formatDateTime(session.startTime)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {session.durationMinutes} min
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {session._count?.bookings || 0}
                          {session.maxStudents ? `/${session.maxStudents}` : ""}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[session.status] || statusColors.SCHEDULED}`}
                        >
                          {session.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {session.meetingUrl && (
                            <a
                              href={session.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                              title="Join Session"
                            >
                              <Video className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Delete Session"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Summary */}
        <div className="text-sm text-slate-600 dark:text-slate-400 text-center">
          Showing {filteredSessions.length} of {sessions.length} total sessions
        </div>
      </main>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <form onSubmit={handleCreateSession}>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create Class Session</h2>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Python Basics Workshop"
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what students will learn..."
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Session Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.sessionType}
                      onChange={(e) => setFormData(prev => ({ ...prev, sessionType: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="ONE_ON_ONE">1-on-1</option>
                      <option value="GROUP">Group</option>
                      <option value="WORKSHOP">Workshop</option>
                      <option value="CAMP">Camp</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Language <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.language}
                      onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="HTML">HTML</option>
                      <option value="CSS">CSS</option>
                      <option value="JAVASCRIPT">JavaScript</option>
                      <option value="PYTHON">Python</option>
                      <option value="ROBLOX">Roblox</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Age Group <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.ageGroup}
                      onChange={(e) => setFormData(prev => ({ ...prev, ageGroup: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="AGES_7_10">Ages 7-10</option>
                      <option value="AGES_11_14">Ages 11-14</option>
                      <option value="AGES_15_18">Ages 15-18</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Start Date & Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Duration (minutes) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData(prev => ({ ...prev, durationMinutes: e.target.value }))}
                      min="15"
                      max="240"
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Max Students
                    </label>
                    <input
                      type="number"
                      value={formData.maxStudents}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxStudents: e.target.value }))}
                      min="1"
                      max="50"
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Price (cents)
                    </label>
                    <input
                      type="number"
                      value={formData.priceCents}
                      onChange={(e) => setFormData(prev => ({ ...prev, priceCents: e.target.value }))}
                      min="0"
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Meeting URL
                    </label>
                    <input
                      type="url"
                      value={formData.meetingUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, meetingUrl: e.target.value }))}
                      placeholder="https://zoom.us/..."
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Instructor Email (optional)
                    </label>
                    <input
                      type="email"
                      value={formData.instructorEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, instructorEmail: e.target.value }))}
                      placeholder="instructor@example.com"
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Leave blank to assign to yourself
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Create Session
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
