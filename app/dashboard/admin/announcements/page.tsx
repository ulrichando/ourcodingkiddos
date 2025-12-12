"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Button from "../../../../components/ui/button";
import { Megaphone, Plus, Trash2, Pin } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';



type Announcement = {
  id: string;
  title: string;
  message: string;
  targetRole: "ALL" | "PARENT" | "STUDENT" | "INSTRUCTOR";
  isPinned: boolean;
  createdAt: string;
  createdBy: string;
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetRole, setTargetRole] = useState<Announcement["targetRole"]>("ALL");
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/admin/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, targetRole, isPinned }),
      });
      if (res.ok) {
        setTitle("");
        setMessage("");
        setTargetRole("ALL");
        setIsPinned(false);
        setShowForm(false);
        fetchAnnouncements();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    const res = await fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Announcements</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Announcements</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Send platform-wide announcements to all users or specific groups
          </p>
        </div>

      <div className="flex justify-end items-center">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          New Announcement
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              placeholder="Important Update"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              placeholder="Your announcement message..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Audience
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as Announcement["targetRole"])}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="ALL">All Users</option>
                <option value="PARENT">Parents Only</option>
                <option value="STUDENT">Students Only</option>
                <option value="INSTRUCTOR">Instructors Only</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-purple-600"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Pin announcement
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send Announcement"}
            </Button>
            <Button type="button" onClick={() => setShowForm(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <Megaphone className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No announcements yet</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white dark:bg-slate-800 rounded-xl border p-6 ${
                announcement.isPinned
                  ? "border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-900/10"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {announcement.isPinned && (
                      <Pin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    )}
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {announcement.title}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                      {announcement.targetRole}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {announcement.message}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    By {announcement.createdBy} • {new Date(announcement.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      </main>
    </AdminLayout>
  );
}
