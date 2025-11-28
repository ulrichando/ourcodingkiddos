"use client";

import { useMemo, useState } from "react";
import AdminTable from "./AdminTable";
import { Plus, Trash2, Pencil } from "lucide-react";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: "STUDENT" | "PARENT" | "INSTRUCTOR" | "ADMIN";
  createdAt: string;
};

const roleOrder = ["ALL", "PARENT", "STUDENT", "INSTRUCTOR", "ADMIN"] as const;

export default function AdminUsersClient({
  initialUsers,
  defaultRole = "ALL",
}: {
  initialUsers: UserRow[];
  defaultRole?: (typeof roleOrder)[number];
}) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [activeRole, setActiveRole] = useState<(typeof roleOrder)[number]>(defaultRole);
  const [isCreating, setIsCreating] = useState(false);

  const filtered = useMemo(() => {
    if (activeRole === "ALL") return users;
    return users.filter((u) => u.role === activeRole);
  }, [users, activeRole]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    const prev = users;
    setUsers((u) => u.filter((x) => x.id !== id));
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Delete failed");
      setUsers(prev);
    }
  };

  const handleRoleChange = async (id: string, role: UserRow["role"]) => {
    const prev = users;
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, role } : x)));
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      alert("Update failed");
      setUsers(prev);
    }
  };

  const handleEditName = async (id: string, current: string | null) => {
    const name = prompt("Update name", current ?? "");
    if (name === null) return;
    const prev = users;
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, name } : x)));
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      alert("Update failed");
      setUsers(prev);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    const name = prompt("Name (optional)") ?? undefined;
    const email = prompt("Email (required)") ?? undefined;
    const password = prompt("Password (required)") ?? undefined;
    const role = (prompt("Role (STUDENT/PARENT/INSTRUCTOR/ADMIN)", "PARENT") ?? "PARENT").toUpperCase();
    if (!email || !password) {
      setIsCreating(false);
      return;
    }
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (!res.ok) {
      alert("Create failed");
    } else {
      const data = await res.json();
      setUsers((u) => [data.user, ...u]);
    }
    setIsCreating(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {roleOrder.map((r) => (
          <button
            key={r}
            onClick={() => setActiveRole(r)}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              activeRole === r ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-white text-slate-700 border-slate-200"
            }`}
          >
            {r === "ALL" ? "All" : r.charAt(0) + r.slice(1).toLowerCase()}
          </button>
        ))}
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <AdminTable<UserRow>
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          {
            key: "role",
            label: "Role",
            render: (u) => (
              <select
                value={u.role}
                onChange={(e) => handleRoleChange(u.id, e.target.value as UserRow["role"])}
                className="text-sm border rounded px-2 py-1 bg-white"
              >
                <option value="STUDENT">Student</option>
                <option value="PARENT">Parent</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMIN">Admin</option>
              </select>
            ),
          },
          {
            key: "createdAt",
            label: "Created",
            render: (u) => new Date(u.createdAt).toLocaleDateString(),
          },
          {
            key: "id",
            label: "Actions",
            render: (u) => (
              <div className="flex gap-2 text-xs items-center">
                <button
                  onClick={() => handleEditName(u.id, u.name)}
                  className="px-2 py-1 rounded bg-slate-100 text-slate-700 inline-flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="px-2 py-1 rounded bg-rose-100 text-rose-700 inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            ),
          },
        ]}
        data={filtered}
      />
    </div>
  );
}
