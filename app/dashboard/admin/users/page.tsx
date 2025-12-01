"use client";

import AdminNav from "../../../../components/admin/AdminNav";
import AdminUsersClient from "../../../../components/admin/AdminUsersClient";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to load users");
        const data = await res.json();
        if (mounted) setUsers(data.users ?? []);
      } catch (e: any) {
        if (mounted) setError(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Users</h1>
        </div>
        <AdminNav />
      </div>

      {loading && <p className="text-sm text-slate-500 dark:text-slate-400">Loading users…</p>}
      {error && <p className="text-sm text-rose-600 dark:text-rose-400">Failed to load users</p>}
      {!loading && !error && <AdminUsersClient initialUsers={users} />}
    </main>
  );
}
