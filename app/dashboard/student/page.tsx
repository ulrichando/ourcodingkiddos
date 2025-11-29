"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Video, Star, Flame, Trophy, Zap, BookOpen, Clock, Calendar, ArrowRight, Target as Aim } from "lucide-react";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import LanguageIcon from "@/components/ui/LanguageIcon";

type ClassItem = {
  id: string;
  title: string;
  description?: string;
  language?: string;
  start: Date;
  durationMinutes?: number;
  meetingUrl?: string;
};

const demoContinue = [
  {
    id: "html-basics",
    title: "HTML Basics for Kids",
    description: "Learn to build your first web page!",
    language: "html",
    totalLessons: 8,
    completed: 1,
    progress: 13,
  },
  {
    id: "css-magic",
    title: "CSS Magic: Style Your Pages",
    description: "Make sites beautiful with colors, fonts, and layouts.",
    language: "css",
    totalLessons: 10,
    completed: 0,
    progress: 0,
    isNew: true,
  },
];

const demoRecommended = [
  { id: "css-magic-2", title: "CSS Magic: Style Your Pages", language: "css", level: "beginner", age: "7-10", xp: 500 },
  { id: "js-adventures", title: "JavaScript Adventures", language: "javascript", level: "beginner", age: "11-14", xp: 750 },
  { id: "python-kids", title: "Python for Young Coders", language: "python", level: "beginner", age: "11-14", xp: 750 },
];

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const [classes, setClasses] = React.useState<ClassItem[]>([]);
  const [student, setStudent] = React.useState<{
    id?: string;
    name: string;
    totalXp: number;
    currentLevel: number;
    streakDays: number;
    avatar?: string;
  }>({
    name: "Coder",
    totalXp: 1300,
    currentLevel: 3,
    streakDays: 5,
  });

  React.useEffect(() => {
    fetch("/api/classes", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : { sessions: [] })
      .then((data) => {
        const normalized = (data.sessions || []).map((c: any) => ({
          id: c.id || crypto.randomUUID(),
          title: c.title || "Live Class",
          description: c.description || "Live class",
          language: (c.language || "").toLowerCase(),
          start: new Date(c.startTime || c.start || Date.now()),
          durationMinutes: c.durationMinutes || c.duration_minutes || 60,
          meetingUrl: c.meetingUrl || c.meeting_url || "",
        }));
        const future = normalized.filter((cls: ClassItem) => cls.start.getTime() >= Date.now() - 60 * 60 * 1000);
        setClasses(future.slice(0, 3));
      })
      .catch(() => setClasses([]));

    // Pull student by id if provided, otherwise session/local storage
    const studentId = searchParams.get("id");
    const nameParam = searchParams.get("name");
    const xpParam = Number(searchParams.get("xp"));
    const levelParam = Number(searchParams.get("level"));
    const streakParam = Number(searchParams.get("streak"));
    const avatarParam = searchParams.get("avatar") || undefined;

    // If query params include student info, seed state immediately
    if (nameParam || xpParam || levelParam || streakParam || avatarParam) {
      setStudent((prev) => ({
        ...prev,
        name: nameParam || prev.name,
        totalXp: isFinite(xpParam) && xpParam > 0 ? xpParam : prev.totalXp,
        currentLevel: isFinite(levelParam) && levelParam > 0 ? levelParam : prev.currentLevel,
        streakDays: isFinite(streakParam) && streakParam >= 0 ? streakParam : prev.streakDays,
        avatar: avatarParam || prev.avatar,
      }));
    }

    if (studentId) {
      fetch(`/api/students?id=${studentId}`, { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const s = data?.students?.[0];
          if (s) {
            setStudent({
              id: s.id,
              name: s.name || nameParam || "Coder",
              totalXp: s.total_xp || s.totalXp || 0,
              currentLevel: s.current_level || s.currentLevel || 1,
              streakDays: s.streak_days || s.streakDays || 0,
              avatar: s.avatar || avatarParam,
            });
            return;
          }
        })
        .catch(() => {});
    }
    const stored = sessionStorage.getItem("studentSession") || localStorage.getItem("studentName");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStudent((prev) => ({
          ...prev,
          id: parsed.id || prev.id,
          name: parsed.name || prev.name,
          totalXp: parsed.total_xp || parsed.totalXp || prev.totalXp,
          currentLevel: parsed.current_level || parsed.currentLevel || prev.currentLevel,
          streakDays: parsed.streak_days || parsed.streakDays || prev.streakDays,
        }));
      } catch {
        setStudent((prev) => ({ ...prev, name: stored || prev.name }));
      }
    }
  }, [searchParams]);

  const streakDays = student.streakDays || 0;
  const totalXp = student.totalXp || 0;
  const currentLevel = student.currentLevel || 1;
  const levelXP = currentLevel * 500;
  const currentLevelProgress = totalXp % levelXP;
  const nextIn = Math.max(0, levelXP - currentLevelProgress);

  return (
    <main className="min-h-screen bg-[#3d0f68] text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
              {student.avatar || "🦊"}
            </div>
            <div>
              <div className="text-sm font-semibold">Hey, {student.name}!</div>
              <div className="inline-flex items-center gap-2 text-xs bg-white/10 px-3 py-1 rounded-full">
                <Flame className="h-4 w-4 text-amber-300" /> {streakDays} day streak
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10">
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
              <span className="font-semibold">{totalXp} XP</span>
            </div>
          </div>
        </div>

        {/* Level */}
        <div className="bg-white/10 rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Current Level</p>
              <h2 className="text-3xl font-bold">Level {currentLevel}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Next Level In</p>
              <p className="text-xl font-bold">{nextIn} XP</p>
            </div>
          </div>
          <div className="mt-3 h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500"
              style={{ width: `${(currentLevelProgress / levelXP) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/70 mt-1">
            <span>{currentLevelProgress} XP</span>
            <span>{levelXP} XP</span>
          </div>
        </div>

        {/* Continue Learning */}
        <section className="space-y-3">
          <h3 className="text-xl font-bold flex items-center gap-2">Continue Learning</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {demoContinue.map((c) => (
              <Link key={c.id} href={`/courses/${c.id}`}>
                <div className="rounded-2xl bg-white text-slate-900 shadow-lg hover:shadow-xl transition overflow-hidden">
                  <div className="h-1 bg-slate-200 w-full">
                    <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${c.progress}%` }} />
                  </div>
                  <div className="p-4 flex items-start gap-3">
                    <LanguageIcon language={c.language || "html"} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 text-xs">
                        {c.isNew ? (
                          <Badge className="bg-green-100 text-green-700">New</Badge>
                        ) : (
                          <Badge variant="outline">
                            {c.completed}/{c.totalLessons} lessons • {c.progress}%
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-bold text-lg line-clamp-1">{c.title}</h4>
                      <p className="text-sm text-slate-500 line-clamp-1">{c.description}</p>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                      {c.isNew ? "Start Learning" : "Continue"}
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-300" />
              My Badges
            </h3>
            <Link href="/dashboard/student" className="text-sm text-white/80 flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 text-center py-10 text-white/70">
            No badges yet. Complete lessons and quizzes to earn badges!
          </div>
        </section>

        {/* Recommended */}
        <section className="space-y-3">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-300" /> Start Something New
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoRecommended.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <div className="rounded-2xl bg-white text-slate-900 shadow-lg hover:-translate-y-1 transition overflow-hidden h-full">
                  <div
                    className={`h-24 ${
                      course.language === "css"
                        ? "bg-gradient-to-br from-sky-400 to-sky-600"
                        : course.language === "javascript"
                        ? "bg-gradient-to-br from-amber-400 to-orange-500"
                        : "bg-gradient-to-br from-green-400 to-emerald-500"
                    }`}
                  />
                  <div className="p-4 space-y-2 -mt-6">
                    <LanguageIcon language={course.language} size="lg" />
                    <h4 className="font-bold text-lg">{course.title}</h4>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline">{course.level}</Badge>
                      <Badge variant="outline">Ages {course.age}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-amber-400" />
                      <span className="font-semibold">{course.xp} XP</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Upcoming */}
        <section className="space-y-3">
          <h3 className="text-xl font-bold flex items-center gap-2">⚡ Upcoming Live Classes</h3>
          {classes.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
              No classes scheduled yet. Check back soon!
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <div key={cls.id} className="rounded-2xl bg-white/10 border border-white/10 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <span className="px-2 py-1 rounded-full bg-white/10 capitalize">{cls.language || "live"}</span>
                    <span className="px-2 py-1 rounded-full bg-white/10">Class</span>
                  </div>
                  <h4 className="font-semibold text-white">{cls.title}</h4>
                  <p className="text-white/70 text-sm line-clamp-2">{cls.description}</p>
                  <div className="flex items-center gap-2 text-sm text-white/80 pt-1">
                    <Calendar className="h-4 w-4" />
                    {cls.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Clock className="h-4 w-4" />
                    {cls.start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} • {cls.durationMinutes} min
                  </div>
                  {cls.meetingUrl && (
                    <Link
                      href={cls.meetingUrl}
                      className="inline-flex items-center gap-2 bg-white text-purple-700 px-3 py-2 rounded-lg text-sm font-semibold"
                    >
                      <Video className="h-4 w-4" /> Join
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Stats */}
        <section className="grid md:grid-cols-4 gap-3">
          {[
            { label: "Lessons Done", value: 1, icon: BookOpen, color: "from-green-400 to-emerald-500" },
            { label: "Quizzes Passed", value: 0, icon: Aim, color: "from-blue-400 to-cyan-500" },
            { label: "Day Streak", value: streakDays, icon: Flame, color: "from-orange-400 to-red-500" },
            { label: "Badges Earned", value: 0, icon: Trophy, color: "from-yellow-400 to-amber-500" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/10 border border-white/10 p-4 text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
