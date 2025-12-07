"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Button from "../../../../components/ui/button";
import {
  Mail,
  Users,
  UserCheck,
  UserX,
  Loader2,
  Search,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Download,
  Calendar
} from "lucide-react";

type Subscriber = {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
  source?: string;
};

type Stats = {
  total: number;
  active: number;
  unsubscribed: number;
};

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, unsubscribed: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">("all");

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const res = await fetch("/api/admin/subscribers");
      const data = await res.json();
      setSubscribers(data.subscribers || []);
      setStats(data.stats || { total: 0, active: 0, unsubscribed: 0 });
    } catch (error) {
      console.error("Failed to load subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus })
      });

      if (res.ok) {
        loadSubscribers();
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete ${email}?`)) return;

    try {
      const res = await fetch(`/api/admin/subscribers?id=${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        loadSubscribers();
      }
    } catch (error) {
      console.error("Failed to delete subscriber:", error);
    }
  };

  const exportToCSV = () => {
    const headers = ["Email", "Status", "Subscribed Date", "Unsubscribed Date", "Source"];
    const rows = filteredSubscribers.map(s => [
      s.email,
      s.isActive ? "Active" : "Unsubscribed",
      new Date(s.subscribedAt).toLocaleDateString(),
      s.unsubscribedAt ? new Date(s.unsubscribedAt).toLocaleDateString() : "",
      s.source || ""
    ]);

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredSubscribers = subscribers.filter(s => {
    const matchesSearch = s.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ? true :
      filter === "active" ? s.isActive :
      !s.isActive;
    return matchesSearch && matchesFilter;
  });

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Newsletter Subscribers</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your newsletter mailing list
            </p>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Subscribers</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.active}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <UserX className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.unsubscribed}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Unsubscribed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(["all", "active", "unsubscribed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  filter === f
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {filteredSubscribers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">No subscribers found</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                {search ? "Try adjusting your search" : "Subscribers will appear here"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Subscribed
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Source
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {subscriber.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          subscriber.isActive
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {subscriber.isActive ? (
                            <><UserCheck className="w-3 h-3" /> Active</>
                          ) : (
                            <><UserX className="w-3 h-3" /> Unsubscribed</>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {subscriber.source || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleStatus(subscriber.id, subscriber.isActive)}
                            className={`p-2 rounded-lg transition-colors ${
                              subscriber.isActive
                                ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                            title={subscriber.isActive ? "Deactivate" : "Activate"}
                          >
                            {subscriber.isActive ? (
                              <ToggleRight className="w-5 h-5" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(subscriber.id, subscriber.email)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Showing {filteredSubscribers.length} of {stats.total} subscribers
        </p>
      </div>
    </AdminLayout>
  );
}
