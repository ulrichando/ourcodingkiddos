"use client";

import AdminNav from "../../../../components/admin/AdminNav";
import AdminTable from "../../../../components/admin/AdminTable";

type UserRow = {
  name: string;
  email: string;
  role: "STUDENT" | "PARENT" | "INSTRUCTOR" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  enrolled: number;
};

const users: UserRow[] = [
  { name: "Emma Johnson", email: "emma@example.com", role: "STUDENT", status: "ACTIVE", enrolled: 3 },
  { name: "Alex Kim", email: "alex.kim@example.com", role: "PARENT", status: "ACTIVE", enrolled: 2 },
  { name: "Coach Sam", email: "sam.coach@example.com", role: "INSTRUCTOR", status: "ACTIVE", enrolled: 12 },
  { name: "Priya S.", email: "priya@example.com", role: "ADMIN", status: "ACTIVE", enrolled: 0 },
  { name: "Liam Doe", email: "liam@example.com", role: "STUDENT", status: "SUSPENDED", enrolled: 1 },
];

export default function AdminUsersPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Admin</p>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        </div>
        <AdminNav />
      </div>

      <AdminTable<UserRow>
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          {
            key: "role",
            label: "Role",
            render: (u) => (
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {u.role}
              </span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (u) => (
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  u.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {u.status}
              </span>
            ),
          },
          { key: "enrolled", label: "Enrollments" },
          {
            key: "name",
            label: "Actions",
            render: () => (
              <div className="flex gap-2 text-xs">
                <button className="px-2 py-1 rounded bg-slate-100 text-slate-700">Edit</button>
                <button className="px-2 py-1 rounded bg-amber-100 text-amber-700">Suspend</button>
              </div>
            ),
          },
        ]}
        data={users}
      />
    </main>
  );
}
