"use client";

/**
 * Modern Instructor Calendar - 2025 UX/UI Design
 *
 * Features:
 * - Multiple view modes (Month, Week, Day, Agenda)
 * - Color-coded program events
 * - Time bucket filtering (Today, This Week, Next Week)
 * - Enhanced visual hierarchy
 * - Responsive design
 * - Dark mode optimized
 *
 * Design References:
 * - Eleken Calendar UI Guide: https://www.eleken.co/blog-posts/calendar-ui
 * - Subframe Calendar Examples: https://www.subframe.com/tips/calendar-view-design-examples
 * - UI Patterns Event Calendar: https://ui-patterns.com/patterns/EventCalendar
 */

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Video,
  LayoutGrid,
  LayoutList,
  Filter,
  X,
} from "lucide-react";
import Link from "next/link";

type ClassSession = {
  id: string;
  title: string;
  description?: string;
  sessionType: string;
  language: string;
  ageGroup: string;
  startTime: string;
  durationMinutes: number;
  maxStudents: number | null;
  enrolledCount: number;
  meetingUrl?: string;
  programId?: string | null;
};

type ViewMode = "month" | "week" | "day" | "agenda";
type TimeFilter = "all" | "today" | "this-week" | "next-week";

type InstructorCalendarProps = {
  sessions: ClassSession[];
};

// Language color mapping for visual distinction
const LANGUAGE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  PYTHON: { bg: "bg-blue-500/10 dark:bg-blue-500/20", border: "border-l-blue-500", text: "text-blue-700 dark:text-blue-300" },
  JAVASCRIPT: { bg: "bg-yellow-500/10 dark:bg-yellow-500/20", border: "border-l-yellow-500", text: "text-yellow-700 dark:text-yellow-300" },
  HTML: { bg: "bg-orange-500/10 dark:bg-orange-500/20", border: "border-l-orange-500", text: "text-orange-700 dark:text-orange-300" },
  CSS: { bg: "bg-indigo-500/10 dark:bg-indigo-500/20", border: "border-l-indigo-500", text: "text-indigo-700 dark:text-indigo-300" },
  ROBLOX: { bg: "bg-red-500/10 dark:bg-red-500/20", border: "border-l-red-500", text: "text-red-700 dark:text-red-300" },
  WEB_DEVELOPMENT: { bg: "bg-purple-500/10 dark:bg-purple-500/20", border: "border-l-purple-500", text: "text-purple-700 dark:text-purple-300" },
  GAME_DEVELOPMENT: { bg: "bg-pink-500/10 dark:bg-pink-500/20", border: "border-l-pink-500", text: "text-pink-700 dark:text-pink-300" },
  default: { bg: "bg-emerald-500/10 dark:bg-emerald-500/20", border: "border-l-emerald-500", text: "text-emerald-700 dark:text-emerald-300" },
};

export default function ModernInstructorCalendar({ sessions }: InstructorCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set());

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Navigate months
  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Get unique languages
  const availableLanguages = useMemo(() => {
    const languages = new Set(sessions.map(s => s.language));
    return Array.from(languages).sort();
  }, [sessions]);

  // Filter sessions by time bucket
  const filteredSessions = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfThisWeek = new Date(startOfToday);
    startOfThisWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
    const endOfThisWeek = new Date(startOfThisWeek);
    endOfThisWeek.setDate(startOfThisWeek.getDate() + 7);
    const endOfNextWeek = new Date(endOfThisWeek);
    endOfNextWeek.setDate(endOfThisWeek.getDate() + 7);

    let filtered = sessions;

    // Filter by time
    if (timeFilter === "today") {
      const endOfToday = new Date(startOfToday);
      endOfToday.setDate(startOfToday.getDate() + 1);
      filtered = filtered.filter(s => {
        const sessionDate = new Date(s.startTime);
        return sessionDate >= startOfToday && sessionDate < endOfToday;
      });
    } else if (timeFilter === "this-week") {
      filtered = filtered.filter(s => {
        const sessionDate = new Date(s.startTime);
        return sessionDate >= startOfThisWeek && sessionDate < endOfThisWeek;
      });
    } else if (timeFilter === "next-week") {
      filtered = filtered.filter(s => {
        const sessionDate = new Date(s.startTime);
        return sessionDate >= endOfThisWeek && sessionDate < endOfNextWeek;
      });
    }

    // Filter by language
    if (selectedLanguages.size > 0) {
      filtered = filtered.filter(s => selectedLanguages.has(s.language));
    }

    return filtered;
  }, [sessions, timeFilter, selectedLanguages]);

  // Group sessions by date
  const sessionsByDate = useMemo(() => {
    const grouped: Record<string, ClassSession[]> = {};
    filteredSessions.forEach(session => {
      const date = new Date(session.startTime);
      if (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
        const dateKey = date.toISOString().split('T')[0];
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(session);
      }
    });
    return grouped;
  }, [filteredSessions, currentDate]);

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

  const today = new Date();
  const isToday = (day: number | null) => {
    if (!day) return false;
    return day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  };

  const getDateKey = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getLanguageColor = (language: string) => LANGUAGE_COLORS[language] || LANGUAGE_COLORS.default;

  const toggleLanguageFilter = (language: string) => {
    const newSet = new Set(selectedLanguages);
    if (newSet.has(language)) {
      newSet.delete(language);
    } else {
      newSet.add(language);
    }
    setSelectedLanguages(newSet);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Teaching Calendar</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{filteredSessions.length} classes scheduled</p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
              {([
                { mode: "month" as ViewMode, icon: LayoutGrid, label: "Month" },
                { mode: "agenda" as ViewMode, icon: LayoutList, label: "List" },
              ] as const).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === mode
                      ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-semibold shadow-sm transition-all"
            >
              Today
            </button>
          </div>
        </div>

        {/* Time Bucket Filters */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {([
            { value: "all" as TimeFilter, label: "All Time" },
            { value: "today" as TimeFilter, label: "Today" },
            { value: "this-week" as TimeFilter, label: "This Week" },
            { value: "next-week" as TimeFilter, label: "Next Week" },
          ] as const).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTimeFilter(value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeFilter === value
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Language Filters */}
        {availableLanguages.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Filter className="w-4 h-4" />
                Filter by language:
              </span>
              {availableLanguages.map(language => {
                const colors = getLanguageColor(language);
                const isSelected = selectedLanguages.has(language);
                return (
                  <button
                    key={language}
                    onClick={() => toggleLanguageFilter(language)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      isSelected
                        ? `${colors.bg} ${colors.text} border-2 ${colors.border}`
                        : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                    }`}
                  >
                    {language.replace(/_/g, " ")}
                    {isSelected && <X className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Month Navigation */}
      {viewMode === "month" && (
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all shadow-sm border border-slate-200 dark:border-slate-700"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{monthName}</h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all shadow-sm border border-slate-200 dark:border-slate-700"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === "month" && (
        <div className="p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <div key={day} className="text-center text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider py-2">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} className="aspect-square" />;

              const dateKey = getDateKey(day);
              const daySessions = sessionsByDate[dateKey] || [];
              const hasClasses = daySessions.length > 0;
              const isTodayDay = isToday(day);

              return (
                <div
                  key={day}
                  className={`aspect-square p-2 rounded-xl border-2 transition-all cursor-pointer ${
                    isTodayDay
                      ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 shadow-md'
                      : hasClasses
                      ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg hover:scale-105'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="h-full flex flex-col">
                    <span
                      className={`text-sm font-bold mb-1 ${
                        isTodayDay
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : hasClasses
                          ? 'text-slate-900 dark:text-slate-100'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {day}
                    </span>
                    {hasClasses && (
                      <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                        {daySessions.slice(0, 2).map(session => {
                          const colors = getLanguageColor(session.language);
                          return (
                            <div
                              key={session.id}
                              className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md ${colors.bg} ${colors.text} font-medium truncate border-l-2 ${colors.border}`}
                              title={`${session.title} - ${new Date(session.startTime).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}`}
                            >
                              {new Date(session.startTime).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </div>
                          );
                        })}
                        {daySessions.length > 2 && (
                          <div className="text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400 font-semibold px-1">
                            +{daySessions.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Agenda/List View */}
      {viewMode === "agenda" && (
        <div className="p-6">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No classes scheduled</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSessions
                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                .map(session => {
                  const sessionDate = new Date(session.startTime);
                  const colors = getLanguageColor(session.language);
                  return (
                    <div
                      key={session.id}
                      className={`flex items-start gap-4 p-4 rounded-xl ${colors.bg} border-l-4 ${colors.border} hover:shadow-md transition-all`}
                    >
                      {/* Date badge */}
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex flex-col items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-xs font-semibold">
                          {sessionDate.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-2xl font-bold">{sessionDate.getDate()}</span>
                        <span className="text-[10px] font-medium">
                          {sessionDate.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                      </div>

                      {/* Session info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-base mb-2 ${colors.text}`}>{session.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-4 h-4" />
                            {sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <Users className="w-4 h-4" />
                            {session.enrolledCount}/{session.maxStudents ?? '∞'} students
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${colors.bg} ${colors.text}`}>
                            {session.language.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>

                      {/* Meeting link */}
                      {session.meetingUrl && (
                        <Link
                          href={session.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all shadow-md hover:shadow-lg"
                          title="Join Meeting"
                        >
                          <Video className="w-5 h-5" />
                        </Link>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
