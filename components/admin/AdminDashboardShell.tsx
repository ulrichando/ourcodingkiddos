"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { Shield, Users, GraduationCap, BookOpen, DollarSign, Search, LogOut, Loader2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Button from "../ui/button";
import Input from "../ui/input";
import Badge from "../ui/badge";
import { logout } from "../../lib/logout";
import { Modal } from "../ui/modal";

type UserRow = { id: string; name: string; email: string; type: string; joined: string };
type StudentRow = { id: string; name: string; username: string; age: string; parentEmail: string; xp: number; level: number };
type CourseRow = { id: string; title: string; language: string; level: string; ageGroup: string; status: string };
type SubscriptionRow = { id: string; parentEmail: string; plan: string; status: string; price: string; endDate: string };
type ParentRow = { id: string; name: string; email: string; phone: string; address: string; childrenCount: number };

type Props = {
  userEmail?: string | null;
  warning?: string | null;
  stats: { totalParents: number; totalStudents: number; instructors: number; activeSubs: number };
  parents: ParentRow[];
  users: UserRow[];
  students: StudentRow[];
  courses: CourseRow[];
  subscriptions: SubscriptionRow[];
};

const tabs = [
  { key: "users", label: "Users", icon: Users },
  { key: "parents", label: "Parents", icon: Users },
  { key: "students", label: "Students", icon: GraduationCap },
  { key: "instructors", label: "Instructors", icon: Users },
  { key: "courses", label: "Courses", icon: BookOpen },
  { key: "subscriptions", label: "Subscriptions", icon: DollarSign },
] as const;

export default function AdminDashboardShell({
  userEmail,
  warning,
  stats,
  parents,
  users,
  students,
  courses,
  subscriptions,
}: Props) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("users");
  const [search, setSearch] = useState("");
  const [userRows, setUserRows] = useState(users);
  const [subscriptionRows, setSubscriptionRows] = useState(subscriptions);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserRole, setEditUserRole] = useState("student");
  const [editUserPassword, setEditUserPassword] = useState("");
  const [userModalMode, setUserModalMode] = useState<"create" | "edit">("edit");
  const [editSubId, setEditSubId] = useState<string | null>(null);
  const [editSubPlan, setEditSubPlan] = useState("monthly");
  const [editSubStatus, setEditSubStatus] = useState("active");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fallback demo data if student/parent lists are empty (but users table has roles)
  const displayStudents: StudentRow[] =
    students.length > 0
      ? students
      : userRows
          .filter((u) => u.type === "student")
          .map((u) => ({
            id: u.id,
            name: u.name,
            username: u.email.split("@")[0],
            age: "N/A",
            parentEmail: "N/A",
            xp: 0,
            level: 1,
          }));

  const displayParents: ParentRow[] =
    parents.length > 0
      ? parents
      : userRows
          .filter((u) => u.type === "parent")
          .map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: "N/A",
            address: "N/A",
            childrenCount: 0,
          }));

  const displaySubscriptions: SubscriptionRow[] =
    subscriptionRows.length > 0
      ? subscriptionRows
      : [
          {
            id: "demo-sub",
            parentEmail: "demo.parent@ourcodingkiddos.com",
            plan: "Monthly",
            status: "active",
            price: "$29/mo",
            endDate: "—",
          },
        ];

  const derivedStats = useMemo(() => {
    const parentCount = Math.max(stats.totalParents ?? 0, displayParents.length);
    const studentCount = Math.max(stats.totalStudents ?? 0, displayStudents.length);
    const instructorCount = Math.max(
      stats.instructors ?? 0,
      userRows.filter((u) => u.type === "instructor").length
    );
    const subsCount = Math.max(stats.activeSubs ?? 0, displaySubscriptions.length);
    return { parentCount, studentCount, instructorCount, subsCount };
  }, [stats, displayParents.length, displayStudents.length, displaySubscriptions.length, userRows]);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();
    return userRows.filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
  }, [userRows, search]);

  const filteredInstructorsList = useMemo(() => {
    const term = search.toLowerCase();
    return userRows.filter(
      (u) =>
        u.type === "instructor" &&
        (u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term))
    );
  }, [userRows, search]);

  async function saveUser() {
    setError(null);
    setIsLoading(true);

    try {
      if (userModalMode === "create") {
        if (!editUserEmail || !editUserPassword) {
          setError("Email and password are required");
          return;
        }
        const res = await fetch(`/api/admin/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editUserName,
            email: editUserEmail,
            password: editUserPassword,
            role: editUserRole.toUpperCase(),
          }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          setError(errorData.error || "Failed to create user. Please try again.");
          return;
        }
        const data = await res.json();
        setUserRows((rows) => [data.user, ...rows]);
        setEditUserId(null);
        setUserModalMode("edit");
        setEditUserPassword("");
      } else {
        if (!editUserId) return;
        const prev = userRows;
        setUserRows((rows) =>
          rows.map((r) => (r.id === editUserId ? { ...r, name: editUserName, email: editUserEmail, type: editUserRole } : r))
        );
        const res = await fetch(`/api/admin/users/${editUserId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editUserName,
            email: editUserEmail,
            role: editUserRole.toUpperCase(),
            password: editUserPassword || undefined,
          }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          setError(errorData.error || "Failed to update user. Please try again.");
          setUserRows(prev);
          return;
        }
        setEditUserId(null);
        setEditUserPassword("");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function openUserModal(id: string) {
    const user = userRows.find((u) => u.id === id);
    if (!user) return;
    setUserModalMode("edit");
    setEditUserId(id);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserPassword("");
    setEditUserRole(user.type);
    setError(null);
  }

  function openCreateUserModal() {
    setUserModalMode("create");
    setEditUserId(null);
    setEditUserName("");
    setEditUserEmail("");
    setEditUserPassword("");
    setEditUserRole("parent");
    setError(null);
  }

  function closeUserModal() {
    setEditUserId(null);
    setUserModalMode("edit");
    setEditUserPassword("");
    setError(null);
  }

  async function handleUserDelete(id: string) {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    setIsLoading(true);
    const prev = userRows;
    setUserRows((rows) => rows.filter((r) => r.id !== id));
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || "Failed to delete user");
        setUserRows(prev);
      }
    } catch (err) {
      setError("An unexpected error occurred while deleting user");
      setUserRows(prev);
    } finally {
      setIsLoading(false);
    }
  }

  function openSubModal(id: string) {
    const sub = subscriptionRows.find((s) => s.id === id);
    if (!sub) return;
    setEditSubId(id);
    setEditSubPlan(sub.plan?.toLowerCase() ?? "monthly");
    setEditSubStatus(sub.status ?? "active");
    setError(null);
  }

  async function saveSub() {
    if (!editSubId) return;
    setIsLoading(true);
    setError(null);
    const prev = subscriptionRows;
    setSubscriptionRows((rows) => rows.map((r) => (r.id === editSubId ? { ...r, plan: editSubPlan, status: editSubStatus } : r)));
    try {
      const res = await fetch(`/api/admin/subscriptions/${editSubId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: editSubPlan.toUpperCase(), status: editSubStatus.toUpperCase() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error || "Failed to update subscription");
        setSubscriptionRows(prev);
        return;
      }
      setEditSubId(null);
    } catch (err) {
      setError("An unexpected error occurred");
      setSubscriptionRows(prev);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubCancel(id: string) {
    if (!confirm("Cancel this subscription?")) return;
    setIsLoading(true);
    const prev = subscriptionRows;
    setSubscriptionRows((rows) => rows.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)));
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error || "Failed to cancel subscription");
        setSubscriptionRows(prev);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setSubscriptionRows(prev);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Coding Kiddos Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300 text-sm">
              <span>{userEmail}</span>
              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {warning && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-100 px-4 py-3 text-sm">
              {warning}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Parents", value: derivedStats.parentCount, icon: Users, color: "from-sky-500 to-cyan-500" },
              { label: "Total Students", value: derivedStats.studentCount, icon: GraduationCap, color: "from-pink-500 to-purple-500" },
              { label: "Instructors", value: derivedStats.instructorCount, icon: Users, color: "from-emerald-500 to-green-600" },
              { label: "Active Subs", value: derivedStats.subsCount, icon: DollarSign, color: "from-amber-500 to-orange-500" },
            ].map((stat) => (
              <Card key={stat.label} className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{stat.value}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 w-full overflow-x-auto bg-white dark:bg-slate-900">
            <div className="inline-flex gap-2">
              {tabs.map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      active
                        ? "bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-600 text-purple-900 dark:text-purple-100 shadow"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === "users" && (
            <Card className="border-slate-200 dark:border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Users</h2>
                <div className="flex w-full sm:w-auto gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      value={search}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                      placeholder="Search users..."
                      className="pl-10"
                    />
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={openCreateUserModal}>
                    Add User
                  </Button>
                </div>
              </div>
                {/* Desktop table view */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full text-sm" role="table">
                    <thead>
                      <tr className="text-slate-600 dark:text-slate-400 text-left border-b border-slate-200 dark:border-slate-700">
                        <th scope="col" className="py-3 font-medium">Name</th>
                        <th scope="col" className="py-3 font-medium">Email</th>
                        <th scope="col" className="py-3 font-medium">Type</th>
                        <th scope="col" className="py-3 font-medium">Joined</th>
                        <th className="py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b border-slate-200 dark:border-slate-700">
                          <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">{u.name}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{u.email}</td>
                          <td className="py-3">
                            <Badge
                              className={
                                u.type === "admin"
                                  ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                                  : u.type === "instructor"
                                    ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                    : "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300"
                              }
                            >
                              {u.type}
                            </Badge>
                          </td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{u.joined}</td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              onClick={() => openUserModal(u.id)}
                              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 text-sm inline-flex items-center gap-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleUserDelete(u.id)}
                              className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 text-sm inline-flex items-center gap-1"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td className="py-4 text-slate-500 dark:text-slate-400" colSpan={5}>
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card view */}
                <div className="md:hidden space-y-3">
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{u.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{u.email}</p>
                        </div>
                        <Badge
                          className={
                            u.type === "admin"
                              ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                              : u.type === "instructor"
                                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                : "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300"
                          }
                        >
                          {u.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Joined: {u.joined}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => openUserModal(u.id)}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 font-medium text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleUserDelete(u.id)}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/50 font-medium text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <p className="py-8 text-center text-slate-500 dark:text-slate-400">No users found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "parents" && (
            <Card className="border-slate-200 dark:border-slate-700">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Parents</h2>

                {/* Desktop table view */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full text-sm" role="table">
                    <thead>
                      <tr className="text-slate-600 dark:text-slate-400 text-left border-b border-slate-200 dark:border-slate-700">
                        <th scope="col" className="py-3 font-medium">Name</th>
                        <th scope="col" className="py-3 font-medium">Email</th>
                        <th scope="col" className="py-3 font-medium">Phone</th>
                        <th scope="col" className="py-3 font-medium">Address</th>
                        <th scope="col" className="py-3 font-medium">Children</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayParents.map((p) => (
                        <tr key={p.id} className="border-b border-slate-200 dark:border-slate-700">
                          <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">{p.name}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{p.email}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{p.phone}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{p.address}</td>
                          <td className="py-3 text-purple-600 dark:text-purple-400 font-semibold">{p.childrenCount}</td>
                        </tr>
                      ))}
                      {displayParents.length === 0 && (
                        <tr>
                          <td className="py-4 text-slate-500 dark:text-slate-400" colSpan={5}>
                            No parents found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card view */}
                <div className="md:hidden space-y-3">
                  {displayParents.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{p.email}</p>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold text-sm">
                          {p.childrenCount} {p.childrenCount === 1 ? 'child' : 'children'}
                        </div>
                      </div>
                      <div className="pt-2 space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <span className="font-medium">Phone:</span> {p.phone}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <span className="font-medium">Address:</span> {p.address}
                        </div>
                      </div>
                    </div>
                  ))}
                  {displayParents.length === 0 && (
                    <p className="py-8 text-center text-slate-500 dark:text-slate-400">No parents found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "students" && (
            <Card className="border-slate-200 dark:border-slate-700">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Students</h2>

                {/* Desktop table view */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full text-sm" role="table">
                    <thead>
                      <tr className="text-slate-600 dark:text-slate-400 text-left border-b border-slate-200 dark:border-slate-700">
                        <th scope="col" className="py-3 font-medium">Name</th>
                        <th scope="col" className="py-3 font-medium">Username</th>
                        <th scope="col" className="py-3 font-medium">Age</th>
                        <th scope="col" className="py-3 font-medium">Parent Email</th>
                        <th scope="col" className="py-3 font-medium">XP</th>
                        <th scope="col" className="py-3 font-medium">Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayStudents.map((s) => (
                        <tr key={s.id} className="border-b border-slate-200 dark:border-slate-700">
                          <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">{s.name}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{s.username}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{s.age}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{s.parentEmail}</td>
                          <td className="py-3 text-amber-600 dark:text-amber-400 font-semibold">{s.xp} XP</td>
                          <td className="py-3 text-purple-600 dark:text-purple-400 font-semibold">Lvl {s.level}</td>
                        </tr>
                      ))}
                      {displayStudents.length === 0 && (
                        <tr>
                          <td className="py-4 text-slate-500 dark:text-slate-400" colSpan={6}>
                            No students found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card view */}
                <div className="md:hidden space-y-3">
                  {displayStudents.map((s) => (
                    <div key={s.id} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{s.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">@{s.username}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">Lvl {s.level}</div>
                          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">{s.xp} XP</div>
                        </div>
                      </div>
                      <div className="pt-2 space-y-1 text-sm">
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                          <span className="font-medium">Age:</span> <span>{s.age}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                          <span className="font-medium">Parent:</span> <span className="text-xs truncate ml-2">{s.parentEmail}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {displayStudents.length === 0 && (
                    <p className="py-8 text-center text-slate-500 dark:text-slate-400">No students found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "instructors" && (
            <Card className="border-slate-200 dark:border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Instructors</h2>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      value={search}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                      placeholder="Search instructors..."
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Desktop table view */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full text-sm" role="table">
                    <thead>
                      <tr className="text-slate-600 dark:text-slate-400 text-left border-b border-slate-200 dark:border-slate-700">
                        <th scope="col" className="py-3 font-medium">Name</th>
                        <th scope="col" className="py-3 font-medium">Email</th>
                        <th scope="col" className="py-3 font-medium">Type</th>
                        <th scope="col" className="py-3 font-medium">Joined</th>
                        <th className="py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInstructorsList.map((u) => (
                        <tr key={u.id} className="border-b border-slate-200 dark:border-slate-700">
                          <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">{u.name}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{u.email}</td>
                          <td className="py-3">
                            <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">instructor</Badge>
                          </td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{u.joined}</td>
                          <td className="py-3 text-right">
                            <button className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 text-sm inline-flex items-center gap-1" onClick={() => openUserModal(u.id)}>
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredInstructorsList.length === 0 && (
                        <tr>
                          <td className="py-4 text-slate-500 dark:text-slate-400" colSpan={5}>
                            No instructors found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card view */}
                <div className="md:hidden space-y-3">
                  {filteredInstructorsList.map((u) => (
                    <div key={u.id} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{u.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{u.email}</p>
                        </div>
                        <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">instructor</Badge>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Joined: {u.joined}
                      </div>
                      <button
                        onClick={() => openUserModal(u.id)}
                        className="w-full px-4 py-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 font-medium text-sm transition-colors"
                      >
                        Edit Instructor
                      </button>
                    </div>
                  ))}
                  {filteredInstructorsList.length === 0 && (
                    <p className="py-8 text-center text-slate-500 dark:text-slate-400">No instructors found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "courses" && (
            <Card className="border-slate-200 dark:border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Courses</h2>
                  <Link href="/dashboard/admin/content">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto">Manage Content</Button>
                  </Link>
                </div>

                {/* Desktop table view */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full text-sm" role="table">
                    <thead>
                      <tr className="text-slate-600 dark:text-slate-400 text-left border-b border-slate-200 dark:border-slate-700">
                        <th scope="col" className="py-3 font-medium">Title</th>
                        <th scope="col" className="py-3 font-medium">Language</th>
                        <th scope="col" className="py-3 font-medium">Level</th>
                        <th scope="col" className="py-3 font-medium">Age Group</th>
                        <th scope="col" className="py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((c) => (
                        <tr key={c.id} className="border-b border-slate-200 dark:border-slate-700">
                          <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">{c.title}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300 capitalize">{c.language}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300 capitalize">{c.level}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{c.ageGroup}</td>
                          <td className="py-3">
                            <Badge className={c.status === "Published" ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : "bg-slate-200 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300"}>
                              {c.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                      {courses.length === 0 && (
                        <tr>
                          <td className="py-4 text-slate-500 dark:text-slate-400" colSpan={5}>
                            No courses found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card view */}
                <div className="md:hidden space-y-3">
                  {courses.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex-1 pr-2">{c.title}</h3>
                        <Badge className={c.status === "Published" ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : "bg-slate-200 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300"}>
                          {c.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2 text-sm">
                        <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                          <div className="text-xs text-slate-500 dark:text-slate-400">Language</div>
                          <div className="font-medium text-slate-900 dark:text-slate-100 capitalize">{c.language}</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                          <div className="text-xs text-slate-500 dark:text-slate-400">Level</div>
                          <div className="font-medium text-slate-900 dark:text-slate-100 capitalize">{c.level}</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                          <div className="text-xs text-slate-500 dark:text-slate-400">Age</div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">{c.ageGroup}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {courses.length === 0 && (
                    <p className="py-8 text-center text-slate-500 dark:text-slate-400">No courses found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "subscriptions" && (
            <Card className="border-slate-200 dark:border-slate-700">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Subscriptions</h2>

                {/* Desktop table view */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full text-sm" role="table">
                    <thead>
                      <tr className="text-slate-600 dark:text-slate-400 text-left border-b border-slate-200 dark:border-slate-700">
                        <th scope="col" className="py-3 font-medium">Parent Email</th>
                        <th scope="col" className="py-3 font-medium">Plan</th>
                        <th scope="col" className="py-3 font-medium">Status</th>
                        <th scope="col" className="py-3 font-medium">Price</th>
                        <th scope="col" className="py-3 font-medium">End Date</th>
                        <th className="py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displaySubscriptions.map((s) => (
                        <tr key={s.id} className="border-b border-slate-200 dark:border-slate-700">
                          <td className="py-3 text-slate-700 dark:text-slate-300">{s.parentEmail}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{s.plan}</td>
                          <td className="py-3">
                            <Badge className={s.status === "active" ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300"}>
                              {s.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{s.price}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{s.endDate}</td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              onClick={() => openSubModal(s.id)}
                              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 text-sm inline-flex items-center gap-1"
                            >
                              Change
                            </button>
                            <button
                              onClick={() => handleSubCancel(s.id)}
                              className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 text-sm inline-flex items-center gap-1"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                      {displaySubscriptions.length === 0 && (
                        <tr>
                          <td className="py-4 text-slate-500 dark:text-slate-400" colSpan={6}>
                            No subscriptions found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card view */}
                <div className="md:hidden space-y-3">
                  {displaySubscriptions.map((s) => (
                    <div key={s.id} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Parent</div>
                          <p className="font-medium text-slate-900 dark:text-slate-100 text-sm break-all">{s.parentEmail}</p>
                        </div>
                        <Badge className={s.status === "active" ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300"}>
                          {s.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Plan</div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">{s.plan}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Price</div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">{s.price}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Ends</div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">{s.endDate}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => openSubModal(s.id)}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 font-medium text-sm transition-colors"
                        >
                          Change
                        </button>
                        <button
                          onClick={() => handleSubCancel(s.id)}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/50 font-medium text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                  {displaySubscriptions.length === 0 && (
                    <p className="py-8 text-center text-slate-500 dark:text-slate-400">No subscriptions found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Edit User Modal */}
      <Modal
        isOpen={editUserId !== null || userModalMode === "create"}
        onClose={closeUserModal}
        title={userModalMode === "create" ? "Add User" : "Edit User"}
        footer={
          <>
            <Button variant="ghost" onClick={closeUserModal} className="text-slate-700 dark:text-slate-300" disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={saveUser} className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {error && (
            <div className="rounded-lg bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 text-red-900 dark:text-red-200 px-4 py-3 text-sm" role="alert">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="user-name" className="text-sm text-slate-700 dark:text-slate-300 block mb-1">
              Name
            </label>
            <Input
              id="user-name"
              value={editUserName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEditUserName(e.target.value)}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="user-email" className="text-sm text-slate-700 dark:text-slate-300 block mb-1">
              Email
            </label>
            <Input
              id="user-email"
              type="email"
              value={editUserEmail}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEditUserEmail(e.target.value)}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="user-password" className="text-sm text-slate-700 dark:text-slate-300 block mb-1">
              Password {userModalMode === "edit" ? "(leave blank to keep)" : ""}
            </label>
            <Input
              id="user-password"
              type="password"
              value={editUserPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEditUserPassword(e.target.value)}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="user-role" className="text-sm text-slate-700 dark:text-slate-300 block mb-1">
              Role
            </label>
            <select
              id="user-role"
              value={editUserRole}
              onChange={(e) => setEditUserRole(e.target.value)}
              className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2"
              disabled={isLoading}
            >
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
              <option value="parent">Parent</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Edit Subscription Modal */}
      <Modal
        isOpen={!!editSubId}
        onClose={() => setEditSubId(null)}
        title="Edit Subscription"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditSubId(null)} className="text-slate-700 dark:text-slate-300" disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={saveSub} className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {error && (
            <div className="rounded-lg bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 text-red-900 dark:text-red-200 px-4 py-3 text-sm" role="alert">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="sub-plan" className="text-sm text-slate-700 dark:text-slate-300 block mb-1">
              Plan
            </label>
            <select
              id="sub-plan"
              value={editSubPlan}
              onChange={(e) => setEditSubPlan(e.target.value)}
              className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2"
              disabled={isLoading}
            >
              <option value="free_trial">Free Trial</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
              <option value="family">Family</option>
            </select>
          </div>
          <div>
            <label htmlFor="sub-status" className="text-sm text-slate-700 dark:text-slate-300 block mb-1">
              Status
            </label>
            <select
              id="sub-status"
              value={editSubStatus}
              onChange={(e) => setEditSubStatus(e.target.value)}
              className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2"
              disabled={isLoading}
            >
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
              <option value="past_due">Past Due</option>
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
}
