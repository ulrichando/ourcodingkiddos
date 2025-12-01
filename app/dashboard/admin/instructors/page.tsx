"use client";

import AdminLayout from "../../../../components/admin/AdminLayout";
import AdminUsersClient from "../../../../components/admin/AdminUsersClient";
import { useEffect, useState } from "react";

export default function AdminInstructorsPage() {
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
    <AdminLayout>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Instructors</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Instructor Management</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage instructors, view performance metrics, and handle instructor-related settings
          </p>
        </div>

        {loading && <p className="text-sm text-slate-500 dark:text-slate-400">Loading instructors…</p>}
        {error && <p className="text-sm text-rose-600 dark:text-rose-400">Failed to load instructors</p>}
        {!loading && !error && <AdminUsersClient initialUsers={users} defaultRole="INSTRUCTOR" />}
      </main>
    </AdminLayout>
  );
}
