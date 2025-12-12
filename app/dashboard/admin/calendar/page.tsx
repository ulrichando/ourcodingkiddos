"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Link from "next/link";
import {  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  Users,
  User,
  Plus,
  RefreshCw,
  Filter,
  X,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




type CalendarEvent = {
  id: string;
  title: string;
  type: "session" | "availability" | "request" | "holiday";
  start: string;
  end: string;
  instructor?: string;
  instructorId?: string;
  studentCount?: number;
  status?: string;
  color: string;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const res = await fetch(
        `/api/admin/calendar?start=${startOfMonth.toISOString()}&end=${endOfMonth.toISOString()}`
      );
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to fetch calendar events:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const filteredEvents = events.filter((event) => {
    if (filterType === "all") return true;
    return event.type === filterType;
  });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Calendar</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Calendar View
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              View and manage all scheduled sessions and availability
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/admin/sessions?action=create"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              New Session
            </Link>
            <button
              onClick={fetchEvents}
              className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 min-w-[200px] text-center">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value="all">All Events</option>
                  <option value="session">Sessions</option>
                  <option value="availability">Availability</option>
                  <option value="request">Requests</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Sessions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Requests</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Holidays</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
            {DAYS.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map((date, index) => {
              const dayEvents = date ? getEventsForDate(date) : [];
              const filteredDayEvents = dayEvents.filter(
                (e) => filterType === "all" || e.type === filterType
              );

              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border-b border-r border-slate-100 dark:border-slate-700 ${
                    !date ? "bg-slate-50 dark:bg-slate-900/50" : ""
                  } ${
                    date && isToday(date)
                      ? "bg-purple-50 dark:bg-purple-900/20"
                      : ""
                  } ${
                    date ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30" : ""
                  }`}
                  onClick={() => date && setSelectedDate(date)}
                >
                  {date && (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${
                            isToday(date)
                              ? "w-7 h-7 rounded-full bg-purple-500 text-white flex items-center justify-center"
                              : "text-slate-900 dark:text-slate-100"
                          }`}
                        >
                          {date.getDate()}
                        </span>
                        {filteredDayEvents.length > 0 && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {filteredDayEvents.length} event{filteredDayEvents.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        {filteredDayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                            className={`px-2 py-1 rounded text-xs font-medium truncate cursor-pointer hover:opacity-80 ${
                              event.type === "session"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                : event.type === "availability"
                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                                : event.type === "request"
                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                            }`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {filteredDayEvents.length > 3 && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 pl-2">
                            +{filteredDayEvents.length - 3} more
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" />
            Upcoming This Week
          </h3>
          {loading ? (
            <p className="text-slate-500 dark:text-slate-400">Loading...</p>
          ) : filteredEvents.filter((e) => {
              const eventDate = new Date(e.start);
              const now = new Date();
              const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
              return eventDate >= now && eventDate <= weekFromNow;
            }).length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">No upcoming events this week</p>
          ) : (
            <div className="space-y-3">
              {filteredEvents
                .filter((e) => {
                  const eventDate = new Date(e.start);
                  const now = new Date();
                  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return eventDate >= now && eventDate <= weekFromNow;
                })
                .slice(0, 5)
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          event.type === "session"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : event.type === "availability"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{new Date(event.start).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{formatTime(event.start)}</span>
                          {event.instructor && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" /> {event.instructor}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {event.studentCount !== undefined && (
                      <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                        <Users className="w-4 h-4" />
                        {event.studentCount}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {selectedEvent.title}
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {new Date(selectedEvent.start).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                    </p>
                  </div>
                </div>

                {selectedEvent.instructor && (
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-400" />
                    <p className="text-sm text-slate-900 dark:text-slate-100">
                      {selectedEvent.instructor}
                    </p>
                  </div>
                )}

                {selectedEvent.studentCount !== undefined && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-slate-400" />
                    <p className="text-sm text-slate-900 dark:text-slate-100">
                      {selectedEvent.studentCount} student{selectedEvent.studentCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}

                {selectedEvent.status && (
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedEvent.status === "COMPLETED"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : selectedEvent.status === "SCHEDULED"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {selectedEvent.status}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  href={`/dashboard/admin/sessions?id=${selectedEvent.id}`}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:shadow-lg transition-all"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminLayout>
  );
}
