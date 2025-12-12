"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Trophy, Medal, Crown, Star, Zap, Target, Award,
  Lock, ArrowLeft, Loader2, Sparkles, TrendingUp
} from "lucide-react";
import Button from "@/components/ui/button";

// Force dynamic rendering
export const dynamic = 'force-dynamic';



type Badge = {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string | null;
  category: string | null;
  requirementType: string | null;
  requirementValue: number | null;
  rarity: string | null;
  awardedAt?: string;
  isEarned: boolean;
};

type StudentStats = {
  lessonsCompleted: number;
  quizzesPassed: number;
  badgesEarned: number;
  streakDays: number;
  totalXp: number;
  currentLevel: number;
};

const RARITY_COLORS = {
  COMMON: "bg-slate-500 dark:bg-slate-600 text-white",
  RARE: "bg-blue-500 dark:bg-blue-600 text-white",
  EPIC: "bg-purple-500 dark:bg-purple-600 text-white",
  LEGENDARY: "bg-yellow-500 dark:bg-yellow-600 text-white",
};

const RARITY_GLOW = {
  COMMON: "shadow-lg shadow-slate-500/25",
  RARE: "shadow-lg shadow-blue-500/40",
  EPIC: "shadow-lg shadow-purple-500/40",
  LEGENDARY: "shadow-lg shadow-yellow-500/50",
};

const CATEGORY_ICONS = {
  ACHIEVEMENT: Trophy,
  STREAK: Zap,
  SKILL: Target,
  SPECIAL: Crown,
};

export default function StudentBadgesPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [filter, setFilter] = useState<"all" | "earned" | "locked">("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Support parent viewing student's badges
  const studentId = searchParams.get("id");
  const studentName = searchParams.get("name");
  const isParentViewing = !!studentId;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status === "authenticated") {
      loadBadges();
      loadStats();
    }
  }, [status, studentId]);

  const loadBadges = async () => {
    try {
      const url = studentId
        ? `/api/students/${studentId}/badges`
        : `/api/student/badges`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBadges(data.badges || []);
      }
    } catch (error) {
      console.error("Failed to load badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const url = studentId
        ? `/api/students/${studentId}/stats`
        : `/api/student/stats`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const filteredBadges = badges.filter((badge) => {
    if (filter === "earned" && !badge.isEarned) return false;
    if (filter === "locked" && badge.isEarned) return false;
    if (categoryFilter && badge.category !== categoryFilter) return false;
    return true;
  });

  const earnedCount = badges.filter(b => b.isEarned).length;
  const totalCount = badges.length;
  const completionPercentage = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  const categories = Array.from(new Set(badges.map(b => b.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 dark:text-purple-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading badges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={studentId ? `/dashboard/parent/students/${studentId}` : "/dashboard/student"}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {isParentViewing ? "Student Profile" : "Dashboard"}
            </Button>
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 dark:text-yellow-400" />
                {isParentViewing ? `${studentName}'s Badges` : "My Badge Collection"}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Collect badges by completing challenges and reaching milestones!
              </p>
            </div>

            {/* Progress Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {earnedCount}/{totalCount}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Badges Earned</div>
                <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  {completionPercentage}% Complete
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalXp}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Total XP</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.currentLevel}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Level</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.streakDays}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Day Streak</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{earnedCount}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Badges</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                All ({totalCount})
              </button>
              <button
                onClick={() => setFilter("earned")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "earned"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                Earned ({earnedCount})
              </button>
              <button
                onClick={() => setFilter("locked")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "locked"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                Locked ({totalCount - earnedCount})
              </button>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setCategoryFilter(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    categoryFilter === null
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => {
                  const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || Award;
                  return (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        categoryFilter === category
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Badges Grid */}
        {filteredBadges.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-sm border border-slate-200 dark:border-slate-700">
            <Medal className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No badges found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {filter === "earned"
                ? "Start completing challenges to earn your first badge!"
                : filter === "locked"
                ? "You've unlocked all badges! Amazing work!"
                : "Keep learning and you'll earn badges along the way!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredBadges.map((badge) => {
              const CategoryIcon = CATEGORY_ICONS[badge.category as keyof typeof CATEGORY_ICONS] || Award;
              const rarityColor = badge.rarity ? RARITY_COLORS[badge.rarity as keyof typeof RARITY_COLORS] : RARITY_COLORS.COMMON;
              const rarityGlow = badge.rarity ? RARITY_GLOW[badge.rarity as keyof typeof RARITY_GLOW] : RARITY_GLOW.COMMON;

              return (
                <div
                  key={badge.id}
                  className={`group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 transition-all ${
                    badge.isEarned
                      ? `border-${badge.rarity?.toLowerCase() || 'slate'}-400 dark:border-${badge.rarity?.toLowerCase() || 'slate'}-500 hover:scale-105 cursor-pointer ${rarityGlow}`
                      : "border-slate-200 dark:border-slate-700 opacity-60"
                  }`}
                >
                  {/* Locked Overlay */}
                  {!badge.isEarned && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/70 rounded-2xl">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                  )}

                  {/* Badge Content */}
                  <div className="text-center">
                    {/* Icon */}
                    <div className={`text-5xl mb-3 ${badge.isEarned ? 'group-hover:animate-bounce' : 'grayscale'}`}>
                      {badge.icon || "🏅"}
                    </div>

                    {/* Rarity Badge */}
                    {badge.rarity && badge.isEarned && (
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold mb-2 ${rarityColor}`}>
                        {badge.rarity}
                      </div>
                    )}

                    {/* Name */}
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 line-clamp-2">
                      {badge.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                      {badge.description}
                    </p>

                    {/* Category Icon */}
                    {badge.category && (
                      <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-500">
                        <CategoryIcon className="w-3 h-3" />
                        <span>{badge.category}</span>
                      </div>
                    )}

                    {/* Awarded Date */}
                    {badge.isEarned && badge.awardedAt && (
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                        Earned {new Date(badge.awardedAt).toLocaleDateString()}
                      </div>
                    )}

                    {/* Progress Requirement */}
                    {!badge.isEarned && badge.requirementType && badge.requirementValue && (
                      <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                        {badge.requirementType.replace(/_/g, ' ')}: {badge.requirementValue}
                      </div>
                    )}
                  </div>

                  {/* Sparkle Effect for Earned Badges */}
                  {badge.isEarned && (
                    <Sparkles className="absolute top-2 right-2 w-4 h-4 text-yellow-400 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Motivational Message */}
        {earnedCount > 0 && (
          <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 rounded-2xl p-6 text-white text-center">
            <Crown className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-2">
              {earnedCount === totalCount
                ? "🎉 Badge Master! You've collected them all!"
                : `Amazing! You've earned ${earnedCount} badge${earnedCount > 1 ? 's' : ''}!`}
            </h3>
            <p className="text-purple-100 dark:text-purple-200">
              {earnedCount === totalCount
                ? "You're a true coding champion! Keep up the excellent work!"
                : `Keep learning to unlock ${totalCount - earnedCount} more badge${totalCount - earnedCount > 1 ? 's' : ''}!`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
