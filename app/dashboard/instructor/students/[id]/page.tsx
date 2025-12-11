"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Mail, User, Award, BookOpen, Star, MessageSquare, Phone, UserCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import InstructorLayout from "@/components/instructor/InstructorLayout";

type Guardian = {
  id: string;
  user: {
    name: string;
    email: string;
  };
  phone?: string;
};

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
  guardianId?: string;
  guardian?: Guardian;
  lastActiveDate?: string;
  userId?: string;
};

// Check if student is online (active in last 5 minutes)
function isOnline(lastActiveDate?: string): boolean {
  if (!lastActiveDate) return false;
  const lastActive = new Date(lastActiveDate);
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return lastActive > fiveMinutesAgo;
}

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
      <InstructorLayout>
        <div className="flex items-center justify-center min-h-[50vh] text-slate-500 dark:text-slate-400">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
          <span className="ml-3">Loading student...</span>
        </div>
      </InstructorLayout>
    );
  }

  if (!student) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center min-h-[50vh] text-slate-500 dark:text-slate-400">
          Student not found.
        </div>
      </InstructorLayout>
    );
  }

  const online = isOnline(student.lastActiveDate);
  const parentName = student.guardian?.user?.name || "Parent";
  const parentEmail = student.guardian?.user?.email || student.parentEmail;

  return (
    <InstructorLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{student.name}</h1>
              {/* Online/Offline Status Badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                online
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
              }`}>
                <span className={`w-2 h-2 rounded-full ${online ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                {online ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* Offline Alert - Contact Parent Section */}
        {!online && (
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-300">Student is currently offline</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    {student.name} is not currently online. You can contact their parent to follow up.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-300">
                      <UserCircle className="h-4 w-4" />
                      <span className="font-medium">{parentName}</span>
                    </div>
                    {parentEmail && (
                      <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                        <Mail className="h-4 w-4" />
                        <span>{parentEmail}</span>
                      </div>
                    )}
                    {student.guardian?.phone && (
                      <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                        <Phone className="h-4 w-4" />
                        <span>{student.guardian.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <Link href={`/dashboard/instructor/messages?to=${encodeURIComponent(parentEmail || "")}&name=${encodeURIComponent(parentName)}&subject=${encodeURIComponent(
                      `Regarding ${student.name} - Class Attendance`
                    )}`}>
                      <Button variant="secondary">
                        <MessageSquare className="h-4 w-4" />
                        Contact Parent Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center text-2xl">
                  {student.avatar || <User className="h-6 w-6" />}
                </div>
                {/* Online indicator on avatar */}
                <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                  online ? "bg-emerald-500" : "bg-slate-400"
                }`} />
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
              Last active: {student.lastActiveDate ? new Date(student.lastActiveDate).toLocaleString() : "Never"}
            </div>

            {/* Parent Information Section */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <UserCircle className="h-4 w-4" /> Parent/Guardian Information
              </h3>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-medium">{parentName}</span>
                </div>
                {parentEmail && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Mail className="h-4 w-4" />
                    <span>{parentEmail}</span>
                  </div>
                )}
                {student.guardian?.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Phone className="h-4 w-4" />
                    <span>{student.guardian.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={`/dashboard/instructor/messages?to=${encodeURIComponent(student.email || "")}&name=${encodeURIComponent(student.name)}&subject=Hello ${encodeURIComponent(student.name)}`}>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4" />
                  Message Student
                </Button>
              </Link>
              <Link href={`/dashboard/instructor/messages?to=${encodeURIComponent(parentEmail || "")}&name=${encodeURIComponent(parentName)}&subject=${encodeURIComponent(
                "Regarding " + student.name
              )}`}>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4" />
                  Message Parent
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </InstructorLayout>
  );
}
