"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import {
  Users,
  UserCircle,
  CreditCard,
  TrendingUp,
  Search,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  GraduationCap,
} from "lucide-react";

type ParentStats = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  joinedAt: string;
  children: {
    id: string;
    name: string;
    age?: number;
    level: number;
    totalXp: number;
    enrollments: number;
  }[];
  stats: {
    totalChildren: number;
    totalEnrollments: number;
    totalPayments: number;
    pendingPayments: number;
    lastActive?: string;
  };
  paymentStatus: "current" | "pending" | "overdue";
};

type Summary = {
  totalParents: number;
  activeParents: number;
  totalChildren: number;
  avgChildrenPerParent: number;
  totalRevenue: number;
  pendingPayments: number;
};

export default function ParentStatsPage() {
  const [parents, setParents] = useState<ParentStats[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "children" | "payments">("name");
  const [expandedParent, setExpandedParent] = useState<string | null>(null);

  useEffect(() => {
    async function fetchParents() {
      try {
        const res = await fetch("/api/admin/parents");
        if (res.ok) {
          const data = await res.json();
          setParents(data.parents || []);
          setSummary(data.summary || null);
        }
      } catch (error) {
        console.error("Error fetching parents:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchParents();
  }, []);

  const filteredParents = parents.filter((parent) => {
    const query = searchQuery.toLowerCase();
    return (
      parent.name?.toLowerCase().includes(query) ||
      parent.email?.toLowerCase().includes(query) ||
      parent.children.some((c) => c.name?.toLowerCase().includes(query))
    );
  });

  const sortedParents = [...filteredParents].sort((a, b) => {
    switch (sortBy) {
      case "children":
        return b.stats.totalChildren - a.stats.totalChildren;
      case "payments":
        return b.stats.totalPayments - a.stats.totalPayments;
      default:
        return (a.name || "").localeCompare(b.name || "");
    }
  });

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "current":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Current
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
            <CreditCard className="w-3 h-3" />
            Pending
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
            <XCircle className="w-3 h-3" />
            Overdue
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Users</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Parent Portal Statistics
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Overview of parent accounts, their children, and payment status
          </p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {summary.totalParents}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Parents</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {summary.activeParents}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Active (30d)</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <UserCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {summary.totalChildren}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Children</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {summary.avgChildrenPerParent.toFixed(1)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Avg Children</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    ${summary.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Revenue</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    ${summary.pendingPayments.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search parents or children..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="name">Sort by Name</option>
            <option value="children">Sort by Children Count</option>
            <option value="payments">Sort by Payments</option>
          </select>
        </div>

        {/* Parents List */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            Loading parent data...
          </div>
        ) : sortedParents.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No parents found
          </div>
        ) : (
          <div className="space-y-4">
            {sortedParents.map((parent) => (
              <div
                key={parent.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                {/* Parent Header */}
                <div
                  onClick={() =>
                    setExpandedParent(expandedParent === parent.id ? null : parent.id)
                  }
                  className="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg">
                    {parent.name?.charAt(0) || parent.email?.charAt(0) || "?"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {parent.name || "Unknown Parent"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {parent.email}
                      </span>
                      {parent.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {parent.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats Summary */}
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {parent.stats.totalChildren}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Children</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        ${parent.stats.totalPayments}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Paid</p>
                    </div>
                    {getPaymentStatusBadge(parent.paymentStatus)}
                  </div>

                  {/* Expand Icon */}
                  {expandedParent === parent.id ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                {/* Expanded Content */}
                {expandedParent === parent.id && (
                  <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-700/30">
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Children List */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Children ({parent.children.length})
                        </h4>
                        {parent.children.length === 0 ? (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            No children registered
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {parent.children.map((child) => (
                              <div
                                key={child.id}
                                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600"
                              >
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-slate-100">
                                    {child.name}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {child.age ? `Age ${child.age} • ` : ""}
                                    Level {child.level} • {child.totalXp} XP
                                  </p>
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  {child.enrollments} courses
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Account Info */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Account Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Member Since</span>
                            <span className="text-slate-900 dark:text-slate-100">
                              {new Date(parent.joinedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Total Enrollments</span>
                            <span className="text-slate-900 dark:text-slate-100">
                              {parent.stats.totalEnrollments}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Total Paid</span>
                            <span className="text-slate-900 dark:text-slate-100">
                              ${parent.stats.totalPayments}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Pending</span>
                            <span className="text-slate-900 dark:text-slate-100">
                              ${parent.stats.pendingPayments}
                            </span>
                          </div>
                          {parent.stats.lastActive && (
                            <div className="flex justify-between">
                              <span className="text-slate-500 dark:text-slate-400">Last Active</span>
                              <span className="text-slate-900 dark:text-slate-100">
                                {new Date(parent.stats.lastActive).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </AdminLayout>
  );
}
