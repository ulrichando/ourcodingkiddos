"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, User, Award, BookOpen, Star, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";

type StudentDetail = {
  id: string;
  name: string;
  email?: string;
  age?: number;
  avatar?: string;
  totalXp?: number;
  currentLevel?: number;
  streakDays?: number;
  parentEmail?: string;
  lastActiveDate?: string;
};

async function fetchStudent(id: string) {
  const res = await fetch(`/api/students?id=${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  const student = Array.isArray(data.students) ? data.students[0] : null;
  return student as StudentDetail | null;
}

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchStudent(id)
      .then((s) => {
        if (mounted) setStudent(s);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400">
        Loading student...
      </main>
    );
  }

  if (!student) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400">
        Student not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard/instructor/students" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
              <ArrowLeft className="h-4 w-4" />
              Back to students
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">{student.name}</h1>
            <p className="text-slate-600 dark:text-slate-400">Parent: {student.parentEmail || "N/A"}</p>
          </div>
        </div>

        <Card className="border-0 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center text-2xl">
                {student.avatar || <User className="h-6 w-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mail className="h-4 w-4" />
                  <span>{student.email || "No email"}</span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Age: {student.age ?? "N/A"}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              {[
                { label: "Total XP", value: student.totalXp ?? 0, icon: Star },
                { label: "Level", value: student.currentLevel ?? 1, icon: Award },
                { label: "Streak", value: `${student.streakDays ?? 0} days`, icon: BookOpen },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-700 px-3 py-2">
                  <stat.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400">
              Last active: {student.lastActiveDate ? new Date(student.lastActiveDate).toLocaleString() : "Unknown"}
            </div>

            <div className="flex gap-3">
              <Link href={`/messages?to=${encodeURIComponent(student.email || "")}&subject=Hello ${encodeURIComponent(student.name)}`}>
                <Button variant="outline" className="inline-flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Message Student
                </Button>
              </Link>
              <Link href={`/messages?to=${encodeURIComponent(student.parentEmail || "")}&subject=${encodeURIComponent(
                "Regarding " + student.name
              )}`}>
                <Button variant="outline" className="inline-flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Message Parent
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
