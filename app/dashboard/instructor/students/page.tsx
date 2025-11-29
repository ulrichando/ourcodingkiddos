"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Mail, Smile, Wifi, WifiOff, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type StudentRow = {
  id: string;
  name: string;
  email?: string;
  age?: number;
  avatar?: string;
  lastActive?: string;
};

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/students", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const rows: StudentRow[] = (data.students || []).map((s: any) => ({
          id: s.id,
          name: s.name || "Student",
          email: s.email,
          age: s.age,
          avatar: s.avatar,
          lastActive: s.lastActiveDate,
        }));
        setStudents(rows);
      })
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const renderStatus = (lastActive?: string) => {
    if (!lastActive) return { label: "offline", online: false };
    const last = new Date(lastActive).getTime();
    const online = Date.now() - last < 10 * 60 * 1000; // 10 min window
    return { label: online ? "online" : "offline", online };
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <Link href="/dashboard/instructor" className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-800">
                <ArrowLeft className="h-4 w-4" /> Back to dashboard
              </Link>
            </p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Students</h1>
            <p className="text-slate-600">View all students and see who is online.</p>
          </div>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            {loading ? (
              <div className="text-center text-slate-500 py-8">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="text-center text-slate-500 py-8">No students yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {students.map((s) => {
                  const status = renderStatus(s.lastActive);
                  return (
                    <div key={s.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-lg">
                          {s.avatar || <Smile className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{s.name}</div>
                          <div className="text-sm text-slate-500 flex items-center gap-2">
                            {s.email && (
                              <>
                                <Mail className="h-4 w-4" /> {s.email}
                              </>
                            )}
                            {s.age ? <span className="ml-2 text-xs text-slate-500">Age {s.age}</span> : null}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${
                            status.online ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {status.online ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />} {status.label}
                        </span>
                        <Link href={`/dashboard/instructor/students/${s.id}`}>
                          <Button variant="outline" size="sm">View Profile</Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
