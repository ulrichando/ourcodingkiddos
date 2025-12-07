"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Button from "../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import ParentLayout from "../../../../../components/parent/ParentLayout";
import { User, Calendar, Award, Zap, Trophy, Save, Check, Loader2, ArrowLeft, Flame } from "lucide-react";
import Link from "next/link";

const avatarOptions = ["👦", "👧", "🧒", "👨‍🎓", "👩‍🎓", "🦸", "🦸‍♀️", "🧑‍💻", "👩‍💻", "🤖", "🎮", "🚀"];

type StudentProfile = {
  id: string;
  name: string;
  avatar: string;
  age: number | null;
  dob: string | null;
  ageGroup: string | null;
  totalXp: number;
  currentLevel: number;
  streakDays: number;
  badges: any[];
  lastActiveDate: string | null;
  createdAt: string;
};

export default function StudentProfilePage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [student, setStudent] = useState<StudentProfile | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    avatar: "👦",
    age: "",
    dob: "",
  });

  useEffect(() => {
    if (session?.user?.email && studentId) {
      loadStudent();
    }
  }, [session?.user?.email, studentId]);

  const loadStudent = async () => {
    try {
      const res = await fetch(`/api/students/${studentId}/profile`);
      if (res.ok) {
        const data = await res.json();
        setStudent(data.student);
        setFormData({
          name: data.student.name || "",
          avatar: data.student.avatar || "👦",
          age: data.student.age?.toString() || "",
          dob: data.student.dob ? new Date(data.student.dob).toISOString().split("T")[0] : "",
        });
      } else {
        router.push("/dashboard/parent/students");
      }
    } catch (error) {
      console.error("Failed to load student:", error);
      router.push("/dashboard/parent/students");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");

    try {
      const res = await fetch(`/api/students/${studentId}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          avatar: formData.avatar,
          age: formData.age ? parseInt(formData.age) : null,
          dob: formData.dob || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setStudent(data.student);
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <ParentLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      </ParentLayout>
    );
  }

  if (!student) {
    return (
      <ParentLayout>
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">Student not found</p>
          <Link href="/dashboard/parent/students">
            <Button className="mt-4">Back to Students</Button>
          </Link>
        </div>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/dashboard/parent/students"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Students
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Edit Student Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Update {student.name || "student"}&apos;s information
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{student.totalXp}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total XP</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{student.currentLevel}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Level</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{student.streakDays}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Day Streak</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{student.badges?.length || 0}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Badges</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="flex items-center gap-3">
              <span className="text-4xl">{formData.avatar}</span>
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {formData.name || "Student"}
                </p>
                <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
                  {student.ageGroup ? `Age Group: ${student.ageGroup}` : "Student Profile"}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Avatar Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Avatar
              </label>
              <div className="flex flex-wrap gap-2">
                {avatarOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, avatar: emoji }))}
                    className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all ${
                      formData.avatar === emoji
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30 scale-110"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <User className="w-4 h-4 text-violet-500" />
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter student's name"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <User className="w-4 h-4 text-violet-500" />
                Age
              </label>
              <input
                type="number"
                min="7"
                max="18"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                placeholder="Enter age (7-18)"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-violet-500" />
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>

            {/* Last Active */}
            {student.lastActiveDate && (
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Calendar className="w-4 h-4" />
                Last active: {new Date(student.lastActiveDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            )}

            {/* Save Button */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="min-w-[140px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : saveStatus === "success" ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
              {saveStatus === "error" && (
                <p className="text-sm text-red-500">Failed to save. Please try again.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href={`/dashboard/parent/reports?studentId=${studentId}`}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">View Progress</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">See detailed progress reports</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href={`/dashboard/parent/certificates?studentId=${studentId}`}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Certificates</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">View earned certificates</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </ParentLayout>
  );
}
