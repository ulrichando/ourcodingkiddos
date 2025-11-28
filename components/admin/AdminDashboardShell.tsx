"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import Link from "next/link";
import { Shield, Users, GraduationCap, BookOpen, DollarSign, Search, LogOut } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Button from "../ui/button";
import Input from "../ui/input";
import Badge from "../ui/badge";
import { signOut } from "next-auth/react";

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

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
  }, [users, search]);

  const filteredInstructors = useMemo(() => users.filter((u) => u.type === "instructor"), [users]);

  const bgBase = "#0c1426";
  const bgCard = "#111c2d";

  return (
    <main className="min-h-screen" style={{ backgroundColor: bgBase, color: "#fff" }}>
      <header className="border-b border-white/5" style={{ backgroundColor: "#121d36" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-slate-300">Coding Kiddos Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-200 text-sm">
            <span>{userEmail}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="inline-flex items-center gap-2 text-slate-200 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {warning && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-100 px-4 py-3 text-sm">
            {warning}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Parents", value: stats.totalParents, icon: Users, color: "from-sky-500 to-cyan-500" },
            { label: "Total Students", value: stats.totalStudents, icon: GraduationCap, color: "from-pink-500 to-purple-500" },
            { label: "Instructors", value: stats.instructors, icon: Users, color: "from-emerald-500 to-green-600" },
            { label: "Active Subs", value: stats.activeSubs, icon: DollarSign, color: "from-amber-500 to-orange-500" },
          ].map((stat) => (
            <Card key={stat.label} className="border-white/5" style={{ backgroundColor: bgCard }}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-slate-300">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="border border-white/5 rounded-2xl px-3 py-2 w-full overflow-x-auto" style={{ backgroundColor: "#121d36" }}>
          <div className="inline-flex gap-2">
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    active ? "bg-white/10 border border-white/20 shadow" : "text-slate-300 hover:bg-white/5 border border-transparent"
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
          <Card className="border-white/5" style={{ backgroundColor: bgCard }}>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-lg font-semibold">All Users</h2>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="pl-10 bg-[#0f192f] border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-slate-300 text-left border-b border-white/5">
                      <th className="py-3 font-medium">Name</th>
                      <th className="py-3 font-medium">Email</th>
                      <th className="py-3 font-medium">Type</th>
                      <th className="py-3 font-medium">Joined</th>
                      <th className="py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-white/5">
                        <td className="py-3 font-semibold">{u.name}</td>
                        <td className="py-3 text-slate-300">{u.email}</td>
                        <td className="py-3">
                          <Badge
                            className={
                              u.type === "admin"
                                ? "bg-red-500/20 text-red-300"
                                : u.type === "instructor"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-sky-500/20 text-sky-200"
                            }
                          >
                            {u.type}
                          </Badge>
                        </td>
                        <td className="py-3 text-slate-300">{u.joined}</td>
                        <td className="py-3 text-right">
                          <button className="text-slate-300 hover:text-white text-sm inline-flex items-center gap-1">Edit</button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td className="py-4 text-slate-400" colSpan={5}>
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "parents" && (
          <Card className="border-white/5" style={{ backgroundColor: bgCard }}>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Parents</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-slate-300 text-left border-b border-white/5">
                      <th className="py-3 font-medium">Name</th>
                      <th className="py-3 font-medium">Email</th>
                      <th className="py-3 font-medium">Phone</th>
                      <th className="py-3 font-medium">Address</th>
                      <th className="py-3 font-medium">Children</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parents.map((p) => (
                      <tr key={p.id} className="border-b border-white/5">
                        <td className="py-3 font-semibold">{p.name}</td>
                        <td className="py-3 text-slate-300">{p.email}</td>
                        <td className="py-3 text-slate-300">{p.phone}</td>
                        <td className="py-3 text-slate-300">{p.address}</td>
                        <td className="py-3 text-purple-300 font-semibold">{p.childrenCount}</td>
                      </tr>
                    ))}
                    {parents.length === 0 && (
                      <tr>
                        <td className="py-4 text-slate-400" colSpan={5}>
                          No parents found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "students" && (
          <Card className="border-white/5" style={{ backgroundColor: bgCard }}>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">All Students</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-slate-300 text-left border-b border-white/5">
                      <th className="py-3 font-medium">Name</th>
                      <th className="py-3 font-medium">Username</th>
                      <th className="py-3 font-medium">Age</th>
                      <th className="py-3 font-medium">Parent Email</th>
                      <th className="py-3 font-medium">XP</th>
                      <th className="py-3 font-medium">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id} className="border-b border-white/5">
                        <td className="py-3 font-semibold">{s.name}</td>
                        <td className="py-3 text-slate-300">{s.username}</td>
                        <td className="py-3 text-slate-300">{s.age}</td>
                        <td className="py-3 text-slate-300">{s.parentEmail}</td>
                        <td className="py-3 text-amber-400 font-semibold">{s.xp} XP</td>
                        <td className="py-3 text-purple-300 font-semibold">Lvl {s.level}</td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td className="py-4 text-slate-400" colSpan={6}>
                          No students found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "courses" && (
          <Card className="border-white/5" style={{ backgroundColor: bgCard }}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">All Courses</h2>
                <Link href="/dashboard/admin/content">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">Manage Content</Button>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-slate-300 text-left border-b border-white/5">
                      <th className="py-3 font-medium">Title</th>
                      <th className="py-3 font-medium">Language</th>
                      <th className="py-3 font-medium">Level</th>
                      <th className="py-3 font-medium">Age Group</th>
                      <th className="py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c) => (
                      <tr key={c.id} className="border-b border-white/5">
                        <td className="py-3 font-semibold">{c.title}</td>
                        <td className="py-3 text-slate-300 capitalize">{c.language}</td>
                        <td className="py-3 text-slate-300 capitalize">{c.level}</td>
                        <td className="py-3 text-slate-300">{c.ageGroup}</td>
                        <td className="py-3">
                          <Badge className={c.status === "Published" ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-200"}>
                            {c.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {courses.length === 0 && (
                      <tr>
                        <td className="py-4 text-slate-400" colSpan={5}>
                          No courses found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "subscriptions" && (
          <Card className="border-white/5" style={{ backgroundColor: bgCard }}>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">All Subscriptions</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-slate-300 text-left border-b border-white/5">
                      <th className="py-3 font-medium">Parent Email</th>
                      <th className="py-3 font-medium">Plan</th>
                      <th className="py-3 font-medium">Status</th>
                      <th className="py-3 font-medium">Price</th>
                      <th className="py-3 font-medium">End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((s) => (
                      <tr key={s.id} className="border-b border-white/5">
                        <td className="py-3">{s.parentEmail}</td>
                        <td className="py-3 text-slate-300">{s.plan}</td>
                        <td className="py-3">
                          <Badge className={s.status === "active" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-200"}>
                            {s.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-slate-300">{s.price}</td>
                        <td className="py-3 text-slate-300">{s.endDate}</td>
                      </tr>
                    ))}
                    {subscriptions.length === 0 && (
                      <tr>
                        <td className="py-4 text-slate-400" colSpan={5}>
                          No subscriptions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
