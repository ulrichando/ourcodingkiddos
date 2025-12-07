"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "../../../../components/ui/card";
import ParentLayout from "../../../../components/parent/ParentLayout";
import { Award, Download, ExternalLink, Loader2, Trophy, Star, Medal } from "lucide-react";
import Button from "../../../../components/ui/button";
import Link from "next/link";

type Certificate = {
  id: string;
  courseTitle: string;
  studentName: string;
  studentAvatar?: string;
  issuedDate: string;
  achievementType: "course_completion" | "track_completion" | "special_achievement";
  verificationCode?: string;
};

export default function ParentCertificatesPage() {
  const { data: session } = useSession();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [students, setStudents] = useState<{ id: string; name: string; avatar?: string }[]>([]);

  useEffect(() => {
    loadData();
  }, [session]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load students
      const studentsRes = await fetch("/api/students", { credentials: "include" });
      if (studentsRes.ok) {
        const data = await studentsRes.json();
        setStudents(data.students || []);
      }

      // Load certificates
      const certsRes = await fetch("/api/certificates", { credentials: "include" });
      if (certsRes.ok) {
        const data = await certsRes.json();
        setCertificates(data.certificates || []);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = selectedStudent === "all"
    ? certificates
    : certificates.filter((c) => c.studentName === selectedStudent);

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "track_completion":
        return <Trophy className="w-6 h-6 text-amber-500" />;
      case "special_achievement":
        return <Star className="w-6 h-6 text-purple-500" />;
      default:
        return <Medal className="w-6 h-6 text-blue-500" />;
    }
  };

  const getAchievementLabel = (type: string) => {
    switch (type) {
      case "track_completion":
        return "Track Completed";
      case "special_achievement":
        return "Special Achievement";
      default:
        return "Course Completed";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ParentLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-500" />
              Certificates
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Celebrate your children's achievements</p>
          </div>

          {students.length > 1 && (
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            >
              <option value="all">All Students</option>
              {students.map((s) => (
                <option key={s.id} value={s.name}>{s.avatar || "👤"} {s.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{certificates.length}</p>
              <p className="text-sm text-slate-500">Total Certificates</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                <Medal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {certificates.filter((c) => c.achievementType === "course_completion").length}
              </p>
              <p className="text-sm text-slate-500">Courses Completed</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {certificates.filter((c) => c.achievementType === "special_achievement").length}
              </p>
              <p className="text-sm text-slate-500">Special Awards</p>
            </CardContent>
          </Card>
        </div>

        {/* Certificates List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : filteredCertificates.length === 0 ? (
          <Card className="border-2 border-dashed border-slate-200 dark:border-slate-700">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                No Certificates Yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                When your children complete courses or earn achievements, their certificates will appear here.
              </p>
              <Link href="/courses">
                <Button className="mt-4">
                  Browse Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredCertificates.map((cert) => (
              <Card key={cert.id} className="border-0 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" />
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 flex items-center justify-center flex-shrink-0">
                      {getAchievementIcon(cert.achievementType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{cert.studentAvatar || "👤"}</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{cert.studentName}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {cert.courseTitle}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                          {getAchievementLabel(cert.achievementType)}
                        </span>
                        <span className="text-xs text-slate-500">{formatDate(cert.issuedDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Link href={`/certificates/${cert.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="w-4 h-4" />
                        View
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                  {cert.verificationCode && (
                    <p className="text-xs text-slate-400 mt-2 text-center">
                      Verification: {cert.verificationCode}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
