"use client";

import AdminLayout from "../../../../components/admin/AdminLayout";
import { useEffect, useState } from "react";
import {
  UserCheck,
  UserX,
  Clock,
  Mail,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

type PendingUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  accountStatus: string;
  createdAt: string;
  image?: string | null;
  resumeUrl?: string | null;
  resumeUploadedAt?: string | null;
};

export default function AdminPendingAccountsPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/pending-accounts");
      if (!res.ok) throw new Error("Failed to load pending accounts");
      const data = await res.json();
      setPendingUsers(data.users || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    if (!confirm("Are you sure you want to approve this instructor account?")) return;

    setProcessingId(userId);
    try {
      const res = await fetch("/api/admin/pending-accounts/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to approve account");
      }

      // Remove from list
      setPendingUsers(pendingUsers.filter((u) => u.id !== userId));
      alert("Account approved successfully! User has been notified by email.");
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId: string) => {
    const reason = prompt("Please provide a reason for rejection (this will be sent to the user):");
    if (!reason || reason.trim() === "") return;

    setProcessingId(userId);
    try {
      const res = await fetch("/api/admin/pending-accounts/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, reason }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to reject account");
      }

      // Remove from list
      setPendingUsers(pendingUsers.filter((u) => u.id !== userId));
      alert("Account rejected. User has been notified by email.");
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Pending Accounts</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Pending Account Approvals
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Review and approve or reject instructor account applications
            </p>
          </div>
          <button
            onClick={fetchPendingUsers}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {pendingUsers.length}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pending Approval</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {pendingUsers.filter((u) => u.role === "INSTRUCTOR").length}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Instructor Applications</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {pendingUsers.filter((u) => {
                    const daysSince = Math.floor(
                      (Date.now() - new Date(u.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return daysSince > 7;
                  }).length}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pending &gt; 7 Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Users List */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Loading pending accounts...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 dark:text-emerald-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              All Caught Up!
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              No pending accounts require your attention
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((user) => {
              const daysSince = Math.floor(
                (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
              );
              const isOld = daysSince > 7;

              return (
                <div
                  key={user.id}
                  className={`bg-white dark:bg-slate-800 rounded-xl border ${
                    isOld
                      ? "border-amber-300 dark:border-amber-700"
                      : "border-slate-200 dark:border-slate-700"
                  } p-6 hover:shadow-lg transition-shadow`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* User Info */}
                    <div className="flex items-center gap-4">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xl">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                          {user.name || "No Name Provided"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            {user.role}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3 h-3" />
                            Applied {daysSince} day{daysSince !== 1 ? "s" : ""} ago
                          </div>
                          {isOld && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                              Needs Attention
                            </span>
                          )}
                        </div>
                        {user.resumeUrl && (
                          <div className="mt-2">
                            <a
                              href={user.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              View Resume/CV
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleApprove(user.id)}
                        disabled={processingId === user.id}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        disabled={processingId === user.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </AdminLayout>
  );
}
