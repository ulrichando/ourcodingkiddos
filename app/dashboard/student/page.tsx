"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Video, Star, Flame, Trophy, Zap, BookOpen, Clock, Calendar,
  ArrowRight, Target as Aim, Loader2, Sparkles, Gift, Rocket,
  CheckCircle, Lock, Play, ChevronRight, Medal, Crown, Code2,
  Plus, X, Github, ExternalLink, Upload, Eye, Heart, Sun, Moon
} from "lucide-react";
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

type StudentStats = {
  lessonsCompleted: number;
  quizzesPassed: number;
  badgesEarned: number;
  streakDays: number;
  totalXp: number;
  currentLevel: number;
};

type ContinueCourse = {
  id: string;
  title: string;
  language: string;
  progress: number;
  completed: number;
  totalLessons: number;
};

type RecommendedCourse = {
  id: string;
  title: string;
  description: string;
  language: string;
  level: string;
  ageGroup: string;
  totalXp: number;
};

type DailyChallenge = {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  icon: string;
};

type StudentProject = {
  id: string;
  title: string;
  description: string;
  githubUrl?: string | null;
  demoUrl?: string | null;
  thumbnailUrl?: string | null;
  language?: string | null;
  isApproved: boolean;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
  _count: { comments: number; likes: number };
};

const LANGUAGES = [
  { value: "HTML", label: "HTML & CSS" },
  { value: "CSS", label: "CSS" },
  { value: "JAVASCRIPT", label: "JavaScript" },
  { value: "PYTHON", label: "Python" },
  { value: "ROBLOX", label: "Roblox" },
  { value: "GAME_DEVELOPMENT", label: "Game Dev" },
  { value: "WEB_DEVELOPMENT", label: "Web Dev" },
];

// Fun character avatars for kids to choose
const AVATARS = ["🦊", "🐼", "🦁", "🐯", "🦄", "🐲", "🦖", "🐸", "🦋", "🐝", "🚀", "🤖"];

// Level titles that kids can unlock
const LEVEL_TITLES: Record<number, string> = {
  1: "Code Newbie",
  2: "Bug Hunter",
  3: "Script Kiddo",
  4: "Code Explorer",
  5: "Pixel Pioneer",
  6: "Debug Master",
  7: "Algorithm Ace",
  8: "Code Ninja",
  9: "Tech Wizard",
  10: "Coding Legend",
};

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [myProjects, setMyProjects] = useState<StudentProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [submittingProject, setSubmittingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    githubUrl: "",
    demoUrl: "",
    language: "JAVASCRIPT",
  });
  const [student, setStudent] = useState<{
    id?: string;
    name: string;
    totalXp: number;
    currentLevel: number;
    streakDays: number;
    avatar?: string;
  }>({
    name: "Coder",
    totalXp: 0,
    currentLevel: 1,
    streakDays: 0,
    avatar: "🦊",
  });
  const [stats, setStats] = useState<StudentStats>({
    lessonsCompleted: 0,
    quizzesPassed: 0,
    badgesEarned: 0,
    streakDays: 0,
    totalXp: 0,
    currentLevel: 1,
  });
  const [continueLearning, setContinueLearning] = useState<ContinueCourse[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<RecommendedCourse[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([
    { id: "1", title: "Complete 1 Lesson", description: "Finish any lesson today", xpReward: 50, completed: false, icon: "📚" },
    { id: "2", title: "Practice Coding", description: "Spend 10 minutes coding", xpReward: 30, completed: false, icon: "💻" },
    { id: "3", title: "Try a Quiz", description: "Attempt any quiz", xpReward: 40, completed: false, icon: "🎯" },
  ]);

  // Celebration effect
  const triggerCelebration = useCallback((message: string) => {
    setCelebrationMessage(message);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  }, []);

  // Save avatar selection
  const selectAvatar = (avatar: string) => {
    setStudent(prev => ({ ...prev, avatar }));
    setShowAvatarPicker(false);
    localStorage.setItem("studentAvatar", avatar);
    triggerCelebration("New avatar selected! Looking cool! 😎");
  };

  // Load my projects
  const loadMyProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch("/api/showcase?my=true", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setMyProjects(data.projects || []);
      }
    } catch {
      // Ignore errors
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  // Submit a project
  const submitProject = async () => {
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      triggerCelebration("Please fill in title and description!");
      return;
    }

    setSubmittingProject(true);
    try {
      const res = await fetch("/api/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectForm.title.trim(),
          description: projectForm.description.trim(),
          githubUrl: projectForm.githubUrl.trim() || undefined,
          demoUrl: projectForm.demoUrl.trim() || undefined,
          language: projectForm.language,
        }),
      });

      if (res.ok) {
        triggerCelebration("Project submitted! 🎉 Waiting for approval.");
        setShowProjectModal(false);
        setProjectForm({
          title: "",
          description: "",
          githubUrl: "",
          demoUrl: "",
          language: "JAVASCRIPT",
        });
        loadMyProjects();
      } else {
        const data = await res.json();
        triggerCelebration(data.error || "Failed to submit project");
      }
    } catch {
      triggerCelebration("Something went wrong. Try again!");
    } finally {
      setSubmittingProject(false);
    }
  };

  // Mount for theme - use existing ok-theme system
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("ok-theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const currentTheme = stored || (prefersDark ? "dark" : "light");
      setThemeState(currentTheme as "light" | "dark");
    } catch {
      // ignore
    }
  }, []);

  // Toggle theme using existing ok-theme system
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setThemeState(newTheme);
    try {
      localStorage.setItem("ok-theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      document.documentElement.setAttribute("data-theme", newTheme);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadMyProjects();
  }, [loadMyProjects]);

  useEffect(() => {
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

    // Load saved avatar
    const savedAvatar = localStorage.getItem("studentAvatar");
    if (savedAvatar) {
      setStudent(prev => ({ ...prev, avatar: savedAvatar }));
    }

    const studentId = searchParams.get("id");
    const nameParam = searchParams.get("name");
    const xpParam = Number(searchParams.get("xp"));
    const levelParam = Number(searchParams.get("level"));
    const streakParam = Number(searchParams.get("streak"));
    const avatarParam = searchParams.get("avatar") || undefined;

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
              avatar: s.avatar || avatarParam || "🦊",
            });
          }
        })
        .catch(() => {});

      fetch(`/api/students/${studentId}/stats`, { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setStats(data.stats || stats);
            setContinueLearning(data.continueLearning || []);
            setRecommendedCourses(data.recommendedCourses || []);
            setBadges(data.badges || []);
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const streakDays = student.streakDays || 0;
  const totalXp = student.totalXp || 0;
  const currentLevel = student.currentLevel || 1;
  const levelXP = currentLevel * 500;
  const currentLevelProgress = totalXp % levelXP;
  const nextIn = Math.max(0, levelXP - currentLevelProgress);
  const progressPercent = (currentLevelProgress / levelXP) * 100;
  const levelTitle = LEVEL_TITLES[Math.min(currentLevel, 10)] || "Coding Master";

  const isDark = theme === "dark";

  if (status === "loading" || !mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white dark:from-[#1a0a2e] dark:via-[#2d1052] dark:to-[#3d0f68] text-slate-900 dark:text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse" />
            <Rocket className="h-10 w-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-bounce" />
          </div>
          <p className="text-slate-600 dark:text-white/80 text-lg">Loading your adventure...</p>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white dark:from-[#1a0a2e] dark:via-[#2d1052] dark:to-[#3d0f68] text-slate-900 dark:text-white relative overflow-hidden">
      {/* Animated background stars - only in dark mode */}
      {isDark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.5 + 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* Celebration Popup */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white px-8 py-6 rounded-3xl shadow-2xl animate-bounce">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 animate-spin" />
              <span className="text-2xl font-bold">{celebrationMessage}</span>
              <Sparkles className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </div>
      )}

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#2d1052] border-2 border-purple-300 dark:border-purple-400 rounded-3xl p-6 max-w-md w-full mx-4 animate-in zoom-in-95">
            <h3 className="text-2xl font-bold text-center mb-4 text-slate-900 dark:text-white">Pick Your Avatar!</h3>
            <div className="grid grid-cols-4 gap-3">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => selectAvatar(avatar)}
                  className={`text-4xl p-3 rounded-2xl transition-all hover:scale-110 ${
                    student.avatar === avatar
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/50"
                      : "bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20"
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAvatarPicker(false)}
              className="w-full mt-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition text-slate-700 dark:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Project Submission Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#2d1052] border-2 border-purple-300 dark:border-purple-400 rounded-3xl p-6 max-w-lg w-full animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Share Your Project! 🚀</h3>
              <button
                onClick={() => setShowProjectModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition"
              >
                <X className="h-5 w-5 text-slate-500 dark:text-white/70" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-white/90">Project Title *</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="My Awesome Game"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-white/90">Description *</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell us about your project! What does it do? What did you learn?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-white/90">Programming Language</label>
                <select
                  value={projectForm.language}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.value} value={lang.value} className="text-slate-900">
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-white/90">
                  <Github className="inline h-4 w-4 mr-1" />
                  GitHub Link (optional)
                </label>
                <input
                  type="url"
                  value={projectForm.githubUrl}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                  placeholder="https://github.com/you/project"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-white/90">
                  <ExternalLink className="inline h-4 w-4 mr-1" />
                  Demo Link (optional)
                </label>
                <input
                  type="url"
                  value={projectForm.demoUrl}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, demoUrl: e.target.value }))}
                  placeholder="https://myproject.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition font-semibold text-slate-700 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={submitProject}
                  disabled={submittingProject}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submittingProject ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      Submit Project
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-center text-slate-500 dark:text-white/50">
                Your project will be reviewed before appearing in the showcase.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
        {/* Theme Toggle Button */}
        <div className="flex justify-end">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-2xl bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 border border-slate-200 dark:border-white/20 transition"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-purple-600" />
            )}
          </button>
        </div>

        {/* Hero Header */}
        <div className="relative bg-white dark:bg-gradient-to-r dark:from-purple-600/30 dark:to-pink-600/30 border border-slate-200 dark:border-white/20 rounded-3xl p-6 backdrop-blur-sm overflow-hidden shadow-lg dark:shadow-none">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            {/* Avatar with click to change */}
            <button
              onClick={() => setShowAvatarPicker(true)}
              className="relative group"
            >
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 flex items-center justify-center text-5xl md:text-6xl shadow-xl shadow-orange-500/30 ring-4 ring-white/20 transition-transform group-hover:scale-105">
                {student.avatar || "🦊"}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1.5 shadow-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-xs text-white font-medium">Change</span>
              </div>
            </button>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <Crown className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                <span className="text-yellow-600 dark:text-yellow-400 font-semibold text-sm">{levelTitle}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-slate-900 dark:text-white">
                Hey, {student.name}! <span className="inline-block animate-wave">👋</span>
              </h1>
              <p className="text-slate-600 dark:text-white/70 text-sm md:text-base">Ready for another coding adventure?</p>
            </div>

            {/* Streak & XP Display */}
            <div className="flex flex-row md:flex-col gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-500/30 dark:to-red-500/30 border border-orange-200 dark:border-orange-400/30">
                <Flame className="h-5 w-5 text-orange-500 dark:text-orange-400 animate-pulse" />
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{streakDays}</div>
                  <div className="text-xs text-slate-600 dark:text-white/70">Day Streak</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-500/30 dark:to-amber-500/30 border border-yellow-200 dark:border-yellow-400/30">
                <Star className="h-5 w-5 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalXp.toLocaleString()}</div>
                  <div className="text-xs text-slate-600 dark:text-white/70">Total XP</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress Card - More visual and fun */}
        <div className="bg-white dark:bg-gradient-to-r dark:from-indigo-600/30 dark:to-purple-600/30 rounded-3xl border border-slate-200 dark:border-white/20 p-6 backdrop-blur-sm shadow-lg dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">{currentLevel}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Level {currentLevel}</h2>
                <p className="text-slate-600 dark:text-white/70 text-sm">{levelTitle}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
                <Gift className="h-5 w-5" />
                <span className="text-lg font-bold">{nextIn} XP</span>
              </div>
              <p className="text-slate-600 dark:text-white/70 text-sm">to Level {currentLevel + 1}</p>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="relative h-6 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold drop-shadow-lg text-slate-700 dark:text-white">{Math.round(progressPercent)}%</span>
            </div>
          </div>

          <div className="flex justify-between text-xs text-slate-500 dark:text-white/60 mt-2">
            <span>{currentLevelProgress.toLocaleString()} XP</span>
            <span>{levelXP.toLocaleString()} XP</span>
          </div>
        </div>

        {/* Daily Challenges - New gamification feature */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Aim className="h-6 w-6 text-cyan-500 dark:text-cyan-400" />
              Daily Missions
            </h3>
            <Badge className="bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30">
              {dailyChallenges.filter(c => c.completed).length}/{dailyChallenges.length} Complete
            </Badge>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {dailyChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`rounded-2xl border p-4 transition-all ${
                  challenge.completed
                    ? "bg-green-100 dark:bg-green-500/20 border-green-200 dark:border-green-400/30"
                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-3xl ${challenge.completed ? "grayscale-0" : ""}`}>
                    {challenge.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white">{challenge.title}</h4>
                      {challenge.completed && <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />}
                    </div>
                    <p className="text-slate-500 dark:text-white/60 text-sm">{challenge.description}</p>
                    <div className="flex items-center gap-1 mt-2 text-yellow-500 dark:text-yellow-400">
                      <Star className="h-4 w-4 fill-yellow-500 dark:fill-yellow-400" />
                      <span className="font-semibold">+{challenge.xpReward} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Continue Learning - Enhanced cards */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Play className="h-6 w-6 text-green-500 dark:text-green-400" />
            Continue Learning
          </h3>
          {continueLearning.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-white/70 p-8 text-center">
              <Rocket className="h-12 w-12 mx-auto mb-3 text-purple-500 dark:text-purple-400" />
              <p className="text-lg font-medium text-slate-700 dark:text-white/70">No courses in progress yet!</p>
              <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Start a course below to begin your adventure</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {continueLearning.map((c) => (
                <Link key={c.id} href={`/courses/${c.id}`}>
                  <div className="group rounded-3xl bg-white text-slate-900 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden">
                    <div className="h-2 bg-slate-200 w-full">
                      <div
                        className="h-2 bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                    <div className="p-5 flex items-center gap-4">
                      <div className="relative">
                        <LanguageIcon language={c.language || "html"} size="lg" />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                          {c.progress}%
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-lg line-clamp-1 group-hover:text-purple-600 transition">
                          {c.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <BookOpen className="h-4 w-4" />
                          {c.completed}/{c.totalLessons} lessons
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30">
                        Continue <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* My Projects Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Code2 className="h-6 w-6 text-purple-500 dark:text-purple-400" />
              My Projects
            </h3>
            <button
              onClick={() => setShowProjectModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition shadow-lg shadow-purple-500/30"
            >
              <Plus className="h-4 w-4" />
              Share Project
            </button>
          </div>
          {projectsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : myProjects.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 p-8 text-center">
              <Code2 className="h-12 w-12 mx-auto mb-3 text-purple-300 dark:text-purple-400/50" />
              <p className="text-slate-700 dark:text-white/70 text-lg font-medium">No projects yet</p>
              <p className="text-slate-500 dark:text-white/50 text-sm">Share your awesome creations with the world!</p>
              <button
                onClick={() => setShowProjectModal(true)}
                className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition"
              >
                Submit Your First Project
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myProjects.slice(0, 6).map((project) => (
                <Link key={project.id} href={`/showcase/${project.id}`}>
                  <div className="group rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden hover:shadow-lg dark:hover:border-purple-500/50 transition">
                    <div className="h-24 bg-gradient-to-br from-purple-500 to-pink-500 relative">
                      {project.thumbnailUrl ? (
                        <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Code2 className="h-10 w-10 text-white/50" />
                        </div>
                      )}
                      {!project.isApproved && (
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-yellow-500 text-yellow-900 text-xs font-semibold">
                          Pending Review
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                        {project.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-white/60 line-clamp-2 mt-1">{project.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-sm text-slate-400 dark:text-white/50">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {project.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5" />
                          {project._count.likes}
                        </span>
                        {project.githubUrl && <Github className="h-3.5 w-3.5" />}
                        {project.demoUrl && <ExternalLink className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {myProjects.length > 0 && (
            <div className="text-center">
              <Link href="/showcase?my=true" className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center justify-center gap-1">
                View All Projects <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </section>

        {/* Badges - More visual */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Trophy className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
              My Badges
            </h3>
            <Link href="/dashboard/student/badges" className="text-sm text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-200 flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {badges.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-center py-10">
              <Medal className="h-12 w-12 mx-auto mb-3 text-yellow-400/50" />
              <p className="text-slate-600 dark:text-white/70">No badges yet</p>
              <p className="text-sm text-slate-500 dark:text-white/50">Complete lessons and quizzes to earn awesome badges!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {badges.slice(0, 6).map((badge: any) => (
                <div
                  key={badge.id}
                  className="rounded-2xl bg-white dark:bg-gradient-to-b dark:from-white/10 dark:to-white/5 border border-slate-200 dark:border-white/10 p-4 text-center hover:scale-105 transition cursor-pointer group shadow-sm dark:shadow-none"
                >
                  <div className="text-4xl mb-2 group-hover:animate-bounce">{badge.icon || "🏅"}</div>
                  <div className="text-xs font-medium text-slate-700 dark:text-white/90 line-clamp-1">{badge.name || "Badge"}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recommended Courses - Card redesign */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Zap className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
            Start Something New
          </h3>
          {recommendedCourses.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-white/70 p-8 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-3 text-purple-500 dark:text-purple-400" />
              <p className="text-lg font-medium text-slate-700 dark:text-white/70">Explore our courses!</p>
              <Link href="/courses">
                <Button className="mt-4 bg-purple-500 hover:bg-purple-600">Browse Courses</Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <div className="group rounded-3xl bg-white text-slate-900 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden h-full">
                    <div
                      className={`h-28 relative overflow-hidden ${
                        course.language?.toLowerCase() === "css"
                          ? "bg-gradient-to-br from-sky-400 to-blue-600"
                          : course.language?.toLowerCase() === "javascript"
                          ? "bg-gradient-to-br from-amber-400 to-orange-500"
                          : course.language?.toLowerCase() === "python"
                          ? "bg-gradient-to-br from-green-400 to-emerald-600"
                          : "bg-gradient-to-br from-purple-500 to-pink-500"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
                        {course.level || "Beginner"}
                      </div>
                    </div>
                    <div className="p-5 space-y-3 -mt-8 relative">
                      <div className="bg-white rounded-2xl p-2 w-fit shadow-lg">
                        <LanguageIcon language={course.language || "html"} size="lg" />
                      </div>
                      <h4 className="font-bold text-lg group-hover:text-purple-600 transition">
                        {course.title}
                      </h4>
                      <p className="text-slate-500 text-sm line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="outline" className="text-xs">
                          {course.ageGroup?.replace("AGES_", "Ages ").replace("_", "-") || "All Ages"}
                        </Badge>
                        <div className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="h-4 w-4 fill-amber-400" />
                          {course.totalXp || 100} XP
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming Classes */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Video className="h-6 w-6 text-red-500 dark:text-red-400" />
            Upcoming Live Classes
          </h3>
          {classes.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-8 text-center text-slate-600 dark:text-white/70">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-purple-400/50" />
              <p className="text-lg font-medium text-slate-700 dark:text-white/70">No classes scheduled yet</p>
              <p className="text-sm text-slate-500 dark:text-white/50">Check back soon for exciting live sessions!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <div key={cls.id} className="rounded-3xl bg-white dark:bg-gradient-to-b dark:from-white/10 dark:to-white/5 border border-slate-200 dark:border-white/10 p-5 space-y-3 hover:border-purple-300 dark:hover:border-purple-500/50 transition shadow-sm dark:shadow-none">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-medium capitalize">
                      {cls.language || "live"}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300 text-xs font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full animate-pulse" />
                      Live
                    </span>
                  </div>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white">{cls.title}</h4>
                  <p className="text-slate-500 dark:text-white/60 text-sm line-clamp-2">{cls.description}</p>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-white/70">
                      <Calendar className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                      {cls.start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-white/70">
                      <Clock className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                      {cls.start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} • {cls.durationMinutes} min
                    </div>
                  </div>
                  {cls.meetingUrl && (
                    <Link
                      href={cls.meetingUrl}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-red-600 hover:to-pink-600 transition shadow-lg shadow-red-500/30"
                    >
                      <Video className="h-4 w-4" /> Join Class
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Stats Grid - More playful */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Lessons Done", value: stats.lessonsCompleted, icon: BookOpen, gradient: "from-green-400 to-emerald-500", bg: "from-green-100 to-emerald-100 dark:from-green-500/20 dark:to-emerald-500/20", border: "border-green-200 dark:border-white/10" },
            { label: "Quizzes Passed", value: stats.quizzesPassed, icon: Aim, gradient: "from-blue-400 to-cyan-500", bg: "from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/20", border: "border-blue-200 dark:border-white/10" },
            { label: "Day Streak", value: stats.streakDays || streakDays, icon: Flame, gradient: "from-orange-400 to-red-500", bg: "from-orange-100 to-red-100 dark:from-orange-500/20 dark:to-red-500/20", border: "border-orange-200 dark:border-white/10" },
            { label: "Badges Earned", value: stats.badgesEarned, icon: Trophy, gradient: "from-yellow-400 to-amber-500", bg: "from-yellow-100 to-amber-100 dark:from-yellow-500/20 dark:to-amber-500/20", border: "border-yellow-200 dark:border-white/10" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-3xl bg-gradient-to-br ${stat.bg} border ${stat.border} p-5 text-center hover:scale-105 transition cursor-default`}
            >
              <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div className="text-4xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-slate-600 dark:text-white/70 mt-1">{stat.label}</div>
            </div>
          ))}
        </section>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
          display: inline-block;
          transform-origin: 70% 70%;
        }
      `}</style>
    </main>
  );
}
