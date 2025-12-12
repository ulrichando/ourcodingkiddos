"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import {  Users,
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
  Target,
  Clock,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




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

type ParentGoal = {
  id: string;
  studentId: string;
  description: string;
  targetXp: number;
  currentXp: number;
  createdAt: string;
  completed: boolean;
  parentName: string;
  parentEmail: string;
  studentName: string;
  progress: number;
};

type GoalsSummary = {
  totalGoals: number;
  completedGoals: number;
  activeGoals: number;
  parentsWithGoals: number;
};

export default function ParentStatsPage() {
  const [parents, setParents] = useState<ParentStats[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "children" | "payments">("name");
  const [expandedParent, setExpandedParent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"parents" | "goals">("parents");
  const [goals, setGoals] = useState<ParentGoal[]>([]);
  const [goalsSummary, setGoalsSummary] = useState<GoalsSummary | null>(null);
  const [goalsLoading, setGoalsLoading] = useState(false);

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

  useEffect(() => {
    async function fetchGoals() {
      if (activeTab !== "goals") return;
      setGoalsLoading(true);
      try {
        const res = await fetch("/api/admin/goals");
        if (res.ok) {
          const data = await res.json();
          setGoals(data.goals || []);
          setGoalsSummary(data.summary || null);
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setGoalsLoading(false);
      }
    }
    fetchGoals();
  }, [activeTab]);

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
            Overview of parent accounts, their children, and learning goals
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab("parents")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
              activeTab === "parents"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Parent Accounts
            </span>
          </button>
          <button
            onClick={() => setActiveTab("goals")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
              activeTab === "goals"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Learning Goals
              {goalsSummary && goalsSummary.totalGoals > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                  {goalsSummary.totalGoals}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* Parents Tab Content */}
        {activeTab === "parents" && (
          <>
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
          </>
        )}

        {/* Goals Tab Content */}
        {activeTab === "goals" && (
          <>
            {/* Goals Summary Cards */}
            {goalsSummary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {goalsSummary.totalGoals}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Total Goals</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {goalsSummary.completedGoals}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {goalsSummary.activeGoals}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">In Progress</p>
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
                        {goalsSummary.parentsWithGoals}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Parents with Goals</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Goals List */}
            {goalsLoading ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                Loading goals...
              </div>
            ) : goals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No learning goals set yet</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  Parents can set goals for their children from their dashboard
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                          Student
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                          Goal
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                          Parent
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                          Progress
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                          Created
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {goals.map((goal) => (
                        <tr key={goal.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                                {goal.studentName?.charAt(0) || "?"}
                              </div>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {goal.studentName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-slate-900 dark:text-slate-100">{goal.description}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Target: {goal.targetXp} XP
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-slate-900 dark:text-slate-100">{goal.parentName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{goal.parentEmail}</p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-32">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-600 dark:text-slate-400">
                                  {goal.currentXp} / {goal.targetXp} XP
                                </span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                  {goal.progress}%
                                </span>
                              </div>
                              <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    goal.progress >= 100
                                      ? "bg-green-500"
                                      : goal.progress >= 50
                                      ? "bg-blue-500"
                                      : "bg-amber-500"
                                  }`}
                                  style={{ width: `${Math.min(100, goal.progress)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                            {new Date(goal.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            {goal.progress >= 100 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Complete
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                                <Clock className="w-3 h-3" />
                                Active
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </AdminLayout>
  );
}
