"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Award, BookOpen, Calendar, Download, Star, Zap, Target, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import Button from "../../../../components/ui/button";
import { useSession } from "next-auth/react";

type StudentProgress = {
  student: {
    id: string;
    name: string;
    avatar: string | null;
    totalXp: number;
    currentLevel: number;
    streakDays: number;
    lastActiveDate: string | null;
  };
  stats: {
    totalLessonsCompleted: number;
    totalBadges: number;
    totalAchievements: number;
    totalXp: number;
    currentLevel: number;
    streakDays: number;
  };
  skills: Array<{
    skill: string;
    progress: number;
    completed: number;
    total: number;
  }>;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string | null;
    category: string | null;
    rarity: string | null;
    awardedAt: string;
  }>;
  recentAchievements: Array<{
    id: string;
    title: string;
    detail: string | null;
    icon: string | null;
    xpAwarded: number;
    createdAt: string;
  }>;
  courseProgress: Array<{
    courseId: string;
    courseTitle: string;
    language: string;
    completedLessons: number;
    totalLessons: number;
    progress: number;
    xpEarned: number;
    status: string;
  }>;
};

type Student = {
  id: string;
  name: string;
  age: number | null;
  avatar: string | null;
  totalXp: number;
  currentLevel: number;
  streakDays: number;
  lastActiveDate: string | null;
};

export default function ProgressReportsPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [studentProgress, setStudentProgress] = useState<Record<string, StudentProgress>>({});
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState<Record<string, boolean>>({});
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("month");

  useEffect(() => {
    if (!session?.user?.email) return;
    setLoading(true);
    fetch("/api/students", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const studentList = data.students || [];
        setStudents(studentList);
        // Fetch progress for each student
        studentList.forEach((student: Student) => {
          fetchStudentProgress(student.id);
        });
      })
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, [session?.user?.email]);

  const fetchStudentProgress = async (studentId: string) => {
    setLoadingProgress((prev) => ({ ...prev, [studentId]: true }));
    try {
      const res = await fetch(`/api/students/${studentId}/progress`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setStudentProgress((prev) => ({ ...prev, [studentId]: data }));
      }
    } catch (error) {
      console.error(`Failed to fetch progress for student ${studentId}:`, error);
    } finally {
      setLoadingProgress((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const downloadReport = (studentId: string) => {
    alert(`Generating PDF report for student... (Feature coming soon)`);
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "week": return "This Week";
      case "month": return "This Month";
      case "all": return "All Time";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getSkillColor = (skill: string) => {
    const colors: Record<string, string> = {
      HTML: "bg-orange-500",
      CSS: "bg-blue-500",
      JAVASCRIPT: "bg-yellow-500",
      PYTHON: "bg-green-500",
      ROBLOX: "bg-red-500",
    };
    return colors[skill] || "bg-purple-500";
  };

  // Calculate totals from all students' progress
  const totals = Object.values(studentProgress).reduce(
    (acc, progress) => ({
      totalXp: acc.totalXp + (progress?.stats?.totalXp || 0),
      totalBadges: acc.totalBadges + (progress?.stats?.totalBadges || 0),
      totalLessons: acc.totalLessons + (progress?.stats?.totalLessonsCompleted || 0),
      maxStreak: Math.max(acc.maxStreak, progress?.stats?.streakDays || 0),
    }),
    { totalXp: 0, totalBadges: 0, totalLessons: 0, maxStreak: 0 }
  );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/dashboard/parent" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-3">
                <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500 dark:text-purple-400" />
                Progress Reports
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Detailed analytics and insights into your students&apos; learning journey
              </p>
            </div>
            <div className="flex items-center gap-2">
              {["week", "month", "all"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period as any)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    selectedPeriod === period
                      ? "bg-purple-500 text-white shadow-md"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {period === "week" ? "Week" : period === "month" ? "Month" : "All Time"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500 mb-4" />
              <p className="text-slate-500 dark:text-slate-400">Loading reports...</p>
            </CardContent>
          </Card>
        ) : students.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-3xl">📊</div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No Students Yet</h3>
              <p className="text-slate-500 dark:text-slate-400">Add a student to start tracking their progress</p>
              <Link href="/dashboard/parent/add-student">
                <Button>Add Student</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Overall Summary */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">
                  Overall Summary - {getPeriodLabel()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    {
                      label: "Total XP Earned",
                      value: totals.totalXp.toLocaleString(),
                      icon: Star,
                      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30"
                    },
                    {
                      label: "Badges Earned",
                      value: totals.totalBadges,
                      icon: Award,
                      color: "text-green-600 bg-green-100 dark:bg-green-900/30"
                    },
                    {
                      label: "Lessons Completed",
                      value: totals.totalLessons,
                      icon: BookOpen,
                      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30"
                    },
                    {
                      label: "Best Streak",
                      value: totals.maxStreak,
                      icon: Calendar,
                      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30"
                    },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 shadow-sm">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                        <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Individual Student Reports */}
            {students.map((student) => {
              const progress = studentProgress[student.id];
              const isLoadingProgress = loadingProgress[student.id];
              const progressPercentage = Math.min(100, ((student.totalXp || 0) / 1000) * 100);

              return (
                <Card key={student.id} className="border-0 shadow-sm">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl sm:text-4xl">{student.avatar || "👤"}</span>
                        <div>
                          <CardTitle className="text-lg sm:text-xl text-slate-900 dark:text-slate-100">
                            {student.name}
                          </CardTitle>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Level {student.currentLevel || 1} • {student.totalXp || 0} XP
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReport(student.id)}
                        className="hidden sm:flex"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReport(student.id)}
                        className="sm:hidden p-2"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    {isLoadingProgress ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                      </div>
                    ) : (
                      <>
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Overall Progress</span>
                            <span className="text-purple-600 dark:text-purple-400 font-semibold">{Math.round(progressPercentage)}%</span>
                          </div>
                          <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Zap className="w-4 h-4 text-purple-500" />
                              <span className="text-xs text-slate-500 dark:text-slate-400">Total XP</span>
                            </div>
                            <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                              {progress?.stats?.totalXp || student.totalXp || 0}
                            </div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Award className="w-4 h-4 text-amber-500" />
                              <span className="text-xs text-slate-500 dark:text-slate-400">Badges</span>
                            </div>
                            <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                              {progress?.stats?.totalBadges || 0}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">earned</div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Target className="w-4 h-4 text-blue-500" />
                              <span className="text-xs text-slate-500 dark:text-slate-400">Lessons</span>
                            </div>
                            <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                              {progress?.stats?.totalLessonsCompleted || 0}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">completed</div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-green-500" />
                              <span className="text-xs text-slate-500 dark:text-slate-400">Streak</span>
                            </div>
                            <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                              🔥 {progress?.stats?.streakDays || student.streakDays || 0}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">days</div>
                          </div>
                        </div>

                        {/* Recent Achievements */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Recent Achievements</h4>
                          {progress?.recentAchievements && progress.recentAchievements.length > 0 ? (
                            <div className="space-y-2">
                              {progress.recentAchievements.slice(0, 3).map((achievement) => (
                                <div key={achievement.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                  <span className="text-xl">{achievement.icon || "🏆"}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{achievement.title}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {formatTimeAgo(achievement.createdAt)}
                                      {achievement.xpAwarded > 0 && ` • +${achievement.xpAwarded} XP`}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : progress?.badges && progress.badges.length > 0 ? (
                            <div className="space-y-2">
                              {progress.badges.slice(0, 3).map((badge) => (
                                <div key={badge.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                  <span className="text-xl">{badge.icon || "🏅"}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">Earned &quot;{badge.name}&quot; badge</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatTimeAgo(badge.awardedAt)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400 p-2">No achievements yet. Keep learning!</p>
                          )}
                        </div>

                        {/* Skills Progress */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Skills Progress</h4>
                          {progress?.skills && progress.skills.length > 0 ? (
                            progress.skills.map((item) => (
                              <div key={item.skill} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.skill}</span>
                                  <span className="text-slate-500 dark:text-slate-400">
                                    {item.progress}% ({item.completed}/{item.total} lessons)
                                  </span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${getSkillColor(item.skill)} rounded-full transition-all duration-500`}
                                    style={{ width: `${item.progress}%` }}
                                  />
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">No course progress yet. Start a course to see skill progress!</p>
                          )}
                        </div>

                        {/* Course Progress */}
                        {progress?.courseProgress && progress.courseProgress.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Course Progress</h4>
                            {progress.courseProgress.map((course) => (
                              <div key={course.courseId} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-slate-900 dark:text-slate-100">{course.courseTitle}</span>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">{course.language}</span>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">
                                      {course.completedLessons}/{course.totalLessons} lessons
                                    </span>
                                    <span className="font-semibold text-purple-600 dark:text-purple-400">{course.progress}%</span>
                                  </div>
                                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                      style={{ width: `${course.progress}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Tips Section */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Tips for Parents
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>Encourage daily practice - even 15 minutes can make a big difference!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>Celebrate small wins - each badge and level-up is an achievement!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>Ask your child to show you what they&apos;ve built - it reinforces learning!</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
