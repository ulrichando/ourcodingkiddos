"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Mail, Smile, Wifi, WifiOff, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import InstructorLayout from "@/components/instructor/InstructorLayout";

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
    <InstructorLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Students</h1>
            <p className="text-slate-600 dark:text-slate-400">View all students and see who is online.</p>
          </div>
        </div>

        <Card className="border-0 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-4">
            {loading ? (
              <div className="text-center text-slate-500 dark:text-slate-400 py-8">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-slate-400 py-8">No students yet.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {students.map((s) => {
                  const status = renderStatus(s.lastActive);
                  return (
                    <div key={s.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center text-lg">
                          {s.avatar || <Smile className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{s.name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            {s.email && (
                              <>
                                <Mail className="h-4 w-4" /> {s.email}
                              </>
                            )}
                            {s.age ? <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">Age {s.age}</span> : null}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${
                            status.online ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
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
    </InstructorLayout>
  );
}
