"use client";

import { useMemo, useState } from "react";
import AdminTable from "./AdminTable";
import EditUserModal from "./EditUserModal";
import BulkOperationsModal from "./BulkOperationsModal";
import { Plus, Trash2, Pencil, Upload } from "lucide-react";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: "STUDENT" | "PARENT" | "INSTRUCTOR" | "SUPPORT" | "ADMIN";
  accountStatus?: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  phone?: string | null;
  address?: string | null;
  image?: string | null;
  createdAt: string;
  lastSeen?: string | null;
};

// User is considered online if seen within the last 2 minutes
function isOnline(lastSeen: string | null | undefined): boolean {
  if (!lastSeen) return false;
  const lastSeenDate = new Date(lastSeen);
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  return lastSeenDate > twoMinutesAgo;
}

function formatLastSeen(lastSeen: string | null | undefined): string {
  if (!lastSeen) return "Never";
  const date = new Date(lastSeen);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

const roleOrder = ["ALL", "PARENT", "STUDENT", "INSTRUCTOR", "SUPPORT", "ADMIN"] as const;

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
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [showBulkOps, setShowBulkOps] = useState(false);

  const filtered = useMemo(() => {
    if (activeRole === "ALL") return users;
    return users.filter((u) => u.role === activeRole);
  }, [users, activeRole]);

  const handleDelete = async (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    const warningMessage = userToDelete?.role === "PARENT"
      ? "Delete this parent? WARNING: This will also delete all linked student accounts and their data (projects, progress, etc.). This cannot be undone!"
      : "Delete this user? This will remove all their data and cannot be undone.";

    if (!confirm(warningMessage)) return;

    const prev = users;
    setUsers((u) => u.filter((x) => x.id !== id));

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errorMsg = data.error || "Delete failed";
        alert(`Delete failed: ${errorMsg}`);
        setUsers(prev);
      }
    } catch (error) {
      alert("Delete failed: Network error");
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

  const handleSaveUser = (updatedUser: UserRow) => {
    setUsers((u) => u.map((x) => (x.id === updatedUser.id ? updatedUser : x)));
    setEditingUser(null);
  };

  const handleCreate = async () => {
    setIsCreating(true);
    const name = prompt("Name (optional)") ?? undefined;
    const email = prompt("Email (required)") ?? undefined;
    const password = prompt("Password (required)") ?? undefined;
    const role = (prompt("Role (STUDENT/PARENT/INSTRUCTOR/ADMIN)", "PARENT") ?? "PARENT").toUpperCase();
    const phone = prompt("Phone number (optional)") ?? undefined;
    if (!email || !password) {
      setIsCreating(false);
      return;
    }
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, phone }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Create failed");
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
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              activeRole === r
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-600"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            {r === "ALL" ? "All" : r.charAt(0) + r.slice(1).toLowerCase()}
          </button>
        ))}
        <button
          onClick={() => setShowBulkOps(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <Upload className="w-4 h-4" />
          Bulk Operations
        </button>
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="text-sm text-slate-600 dark:text-slate-400">
        Showing {filtered.length} of {users.length} users
      </div>

      <AdminTable<UserRow>
        columns={[
          {
            key: "status",
            label: "Status",
            render: (u) => (
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOnline(u.lastSeen)
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-slate-300 dark:bg-slate-600"
                  }`}
                  title={isOnline(u.lastSeen) ? "Online" : "Offline"}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {isOnline(u.lastSeen) ? "Online" : formatLastSeen(u.lastSeen)}
                </span>
              </div>
            ),
          },
          {
            key: "name",
            label: "Name",
            render: (u) => (
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  {u.name || <span className="text-slate-400 italic">No name</span>}
                </div>
                {u.phone && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">{u.phone}</div>
                )}
              </div>
            ),
          },
          {
            key: "email",
            label: "Email",
            render: (u) => (
              <span className="text-slate-700 dark:text-slate-300">{u.email}</span>
            ),
          },
          {
            key: "role",
            label: "Role",
            render: (u) => (
              <select
                value={u.role}
                onChange={(e) => handleRoleChange(u.id, e.target.value as UserRow["role"])}
                className="text-sm border rounded px-2 py-1 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
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
            render: (u) => (
              <span className="text-slate-600 dark:text-slate-400">
                {new Date(u.createdAt).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "id",
            label: "Actions",
            render: (u) => (
              <div className="flex gap-2 text-xs items-center">
                <button
                  onClick={() => setEditingUser(u)}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 inline-flex items-center gap-1 transition"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="px-2 py-1 rounded bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50 inline-flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            ),
          },
        ]}
        data={filtered}
      />

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}

      {/* Bulk Operations Modal */}
      <BulkOperationsModal
        isOpen={showBulkOps}
        onClose={() => setShowBulkOps(false)}
      />
    </div>
  );
}
