"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users, Video } from "lucide-react";
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
};

type InstructorCalendarProps = {
  sessions: ClassSession[];
};

export default function InstructorCalendar({ sessions }: InstructorCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the first day of the month and number of days
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Group sessions by date
  const sessionsByDate = useMemo(() => {
    const grouped: Record<string, ClassSession[]> = {};

    sessions.forEach(session => {
      const date = new Date(session.startTime);
      // Only include sessions in the current month
      if (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
        const dateKey = date.toISOString().split('T')[0];
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(session);
      }
    });

    return grouped;
  }, [sessions, currentDate]);

  // Generate calendar days
  const calendarDays = [];

  // Add empty cells for days before the month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const today = new Date();
  const isToday = (day: number | null) => {
    if (!day) return false;
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getDateKey = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Class Calendar
          </h2>
          <button
            onClick={goToToday}
            className="text-sm px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition"
          >
            Today
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {monthName}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-2 sm:p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateKey = getDateKey(day);
            const daySessions = sessionsByDate[dateKey] || [];
            const hasClasses = daySessions.length > 0;
            const isTodayDay = isToday(day);

            return (
              <div
                key={day}
                className={`aspect-square p-1 sm:p-2 rounded-lg border transition ${
                  isTodayDay
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : hasClasses
                    ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="h-full flex flex-col">
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      isTodayDay
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {day}
                  </span>
                  {hasClasses && (
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-0.5 mt-1">
                        {daySessions.slice(0, 3).map(session => (
                          <div
                            key={session.id}
                            className="w-full text-[10px] sm:text-xs px-1 py-0.5 rounded bg-gradient-to-r from-emerald-500 to-teal-600 text-white truncate"
                            title={session.title}
                          >
                            {new Date(session.startTime).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </div>
                        ))}
                        {daySessions.length > 3 && (
                          <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 px-1">
                            +{daySessions.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sessions List for Selected Month */}
      {Object.keys(sessionsByDate).length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-700 p-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Classes This Month ({Object.values(sessionsByDate).flat().length})
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {Object.entries(sessionsByDate)
              .sort(([a], [b]) => a.localeCompare(b))
              .flatMap(([dateKey, daySessions]) =>
                daySessions.map(session => {
                  const sessionDate = new Date(session.startTime);
                  return (
                    <div
                      key={session.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium">
                          {sessionDate.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="text-lg font-bold">{sessionDate.getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                          {session.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {sessionDate.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {session.enrolledCount}/{session.maxStudents ?? '∞'}
                          </span>
                        </div>
                      </div>
                      {session.meetingUrl && (
                        <Link
                          href={session.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition"
                        >
                          <Video className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  );
                })
              )}
          </div>
        </div>
      )}
    </div>
  );
}
