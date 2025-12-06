"use client";

import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Calendar as CalendarIcon, Filter, Clock, ChevronLeft, ChevronRight, Video, User, Users, Sparkles, Tent, List, LayoutGrid } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import Button from "../../components/ui/button";

const classTypes = ["All Types", "1:1 Sessions", "Group Classes", "Workshops", "Camps"];
const languages = ["All Languages", "HTML", "CSS", "JavaScript", "Python", "Roblox"];

async function fetchClasses() {
  const res = await fetch("/api/classes", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.sessions ?? [];
}

export default function SchedulePage() {
  const { data: session } = useSession();
  const role = (session as any)?.user?.role;
  const canJoin = !role || role.toUpperCase() !== "PARENT";
  const today = new Date();
  const startOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.getFullYear(), d.getMonth(), diff);
  };
  const addMonths = (date: Date, months: number) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };
  const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 86400000);

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(today));
  const [classes, setClasses] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"calendar" | "all">("calendar");
  const [allClassesPage, setAllClassesPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    let mounted = true;
    fetchClasses().then((data) => {
      if (!mounted) return;
      const normalized = data
        .map((c: any) => ({
          ...c,
          start: new Date(c.startTime || c.start),
        }))
        .sort((a: any, b: any) => a.start.getTime() - b.start.getTime());
      setClasses(normalized);
    });
    return () => {
      mounted = false;
    };
  }, []);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const formatDay = (date: Date, opts: Intl.DateTimeFormatOptions) =>
    date.toLocaleDateString("en-US", opts);

  const monthDays = useMemo(() => {
    const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => addDays(monthStart, i));
  }, [selectedDate]);

  // Separate sessions by type
  const dayClasses = classes.filter((c) => isSameDay(c.start, selectedDate));
  const oneOnOneSessions = dayClasses.filter(c => c.sessionType === "ONE_ON_ONE");
  const programSessions = dayClasses.filter(c => c.sessionType !== "ONE_ON_ONE");

  // All upcoming classes for "All Classes" view
  const allUpcomingClasses = classes.filter((cls) => cls.start >= new Date());
  const totalAllPages = Math.ceil(allUpcomingClasses.length / ITEMS_PER_PAGE);
  const allClassesStartIndex = (allClassesPage - 1) * ITEMS_PER_PAGE;
  const paginatedAllClasses = allUpcomingClasses.slice(allClassesStartIndex, allClassesStartIndex + ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Schedule</h1>
            <p className="text-slate-600 dark:text-slate-400">Book classes and manage your schedule</p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                viewMode === "calendar"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Calendar
            </button>
            <button
              onClick={() => { setViewMode("all"); setAllClassesPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                viewMode === "all"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
              All Classes
              {allUpcomingClasses.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                  {allUpcomingClasses.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Left sidebar - Collapsible on mobile */}
          <div className="space-y-4 lg:space-y-6 order-2 lg:order-1">
            <Card className="border-0 shadow-sm dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <span>{formatDay(selectedDate, { month: "long", year: "numeric" })}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const next = addMonths(selectedDate, -1);
                        setSelectedDate(next);
                        setWeekStart(startOfWeek(next));
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const next = addMonths(selectedDate, 1);
                        setSelectedDate(next);
                        setWeekStart(startOfWeek(next));
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center text-xs text-slate-500">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d} className="py-1">
                      {d}
                    </div>
                  ))}
                  {monthDays.map((date) => {
                    const isSelected = isSameDay(date, selectedDate);
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => {
                          setSelectedDate(date);
                          setWeekStart(startOfWeek(date));
                        }}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium ${
                          isSelected ? "bg-purple-500 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <Filter className="w-4 h-4" />
                  Filters
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Class Type</p>
                  <select className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                    {classTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Language</p>
                  <select className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                    {languages.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">My Bookings</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming classes</p>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-4 lg:space-y-6 order-1 lg:order-2">
            {viewMode === "calendar" ? (
              <>
                <Card className="border-0 shadow-sm dark:bg-slate-800 dark:border-slate-700">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0 h-8 w-8 p-0"
                        onClick={() => {
                          const next = addDays(weekStart, -7);
                          setWeekStart(next);
                          setSelectedDate(next);
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
                        {weekDays.map((day) => {
                          const active = isSameDay(day, selectedDate);
                          return (
                            <button
                              key={day.toISOString()}
                              onClick={() => {
                                setSelectedDate(day);
                                setWeekStart(startOfWeek(day));
                              }}
                              className={`flex flex-col items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl min-w-[44px] sm:min-w-[60px] text-xs sm:text-sm font-semibold flex-shrink-0 ${
                                active ? "bg-purple-500 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              <span className="opacity-70">{formatDay(day, { weekday: "short" })}</span>
                              <span className="text-base sm:text-lg">{formatDay(day, { day: "numeric" })}</span>
                            </button>
                          );
                        })}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0 h-8 w-8 p-0"
                        onClick={() => {
                          const next = addDays(weekStart, 7);
                          setWeekStart(next);
                          setSelectedDate(next);
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {formatDay(selectedDate, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                  </h2>

                  {dayClasses.length === 0 ? (
                    <>
                      <Card className="border-2 border-dashed border-slate-200 dark:border-slate-700 dark:bg-slate-800">
                        <CardContent className="p-12 text-center space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                          </div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">No classes on this day</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Try selecting a different date or see upcoming classes below</p>
                        </CardContent>
                      </Card>

                      {/* Upcoming classes when no sessions today */}
                      <UpcomingClasses classes={classes} canJoin={canJoin} today={today} setSelectedDate={setSelectedDate} startOfWeek={startOfWeek} setWeekStart={setWeekStart} />
                    </>
                  ) : (
                    <div className="space-y-6">
                      {/* 1-on-1 Sessions Section */}
                      {oneOnOneSessions.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 pb-2 border-b border-purple-200 dark:border-purple-800">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                              <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">1-on-1 Sessions</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Personal tutoring sessions</p>
                            </div>
                            <span className="ml-auto bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-medium px-2.5 py-1 rounded-full">
                              {oneOnOneSessions.length} session{oneOnOneSessions.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          {oneOnOneSessions.map((cls) => (
                            <SessionCard key={cls.id} cls={cls} canJoin={canJoin} />
                          ))}
                        </div>
                      )}

                      {/* Program Sessions Section */}
                      {programSessions.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 pb-2 border-b border-blue-200 dark:border-blue-800">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Program Sessions</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Group classes, workshops & camps</p>
                            </div>
                            <span className="ml-auto bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">
                              {programSessions.length} session{programSessions.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          {programSessions.map((cls) => (
                            <SessionCard key={cls.id} cls={cls} canJoin={canJoin} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* All Classes View with Pagination */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Upcoming Classes</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{allUpcomingClasses.length} classes scheduled</p>
                  </div>
                </div>

                {allUpcomingClasses.length === 0 ? (
                  <Card className="border-2 border-dashed border-slate-200 dark:border-slate-700 dark:bg-slate-800">
                    <CardContent className="p-12 text-center space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <CalendarIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">No upcoming classes</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Check back later for new classes</p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="space-y-3">
                      {paginatedAllClasses.map((cls: any) => (
                        <AllClassesCard key={cls.id} cls={cls} canJoin={canJoin} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalAllPages > 1 && (
                      <Card className="border-0 shadow-sm dark:bg-slate-800 dark:border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Showing {allClassesStartIndex + 1}-{Math.min(allClassesStartIndex + ITEMS_PER_PAGE, allUpcomingClasses.length)} of {allUpcomingClasses.length} classes
                            </p>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setAllClassesPage(p => Math.max(1, p - 1))}
                                disabled={allClassesPage === 1}
                                className="h-8 w-8 p-0"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </Button>

                              {Array.from({ length: Math.min(totalAllPages, 5) }, (_, i) => {
                                let pageNum;
                                if (totalAllPages <= 5) {
                                  pageNum = i + 1;
                                } else if (allClassesPage <= 3) {
                                  pageNum = i + 1;
                                } else if (allClassesPage >= totalAllPages - 2) {
                                  pageNum = totalAllPages - 4 + i;
                                } else {
                                  pageNum = allClassesPage - 2 + i;
                                }
                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => setAllClassesPage(pageNum)}
                                    className={`h-8 w-8 rounded-lg text-sm font-semibold transition ${
                                      pageNum === allClassesPage
                                        ? "bg-purple-500 text-white"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              })}

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setAllClassesPage(p => Math.min(totalAllPages, p + 1))}
                                disabled={allClassesPage === totalAllPages}
                                className="h-8 w-8 p-0"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// All Classes Card Component (for the list view)
function AllClassesCard({ cls, canJoin }: { cls: any; canJoin: boolean }) {
  const getSessionStyle = (sessionType: string) => {
    switch (sessionType?.toUpperCase()) {
      case "ONE_ON_ONE":
        return { icon: User, bg: "bg-purple-50 dark:bg-purple-900/20", iconBg: "bg-purple-100 dark:bg-purple-900/50", iconColor: "text-purple-600 dark:text-purple-400", border: "border-l-purple-500", badge: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300", label: "1-on-1" };
      case "WORKSHOP":
        return { icon: Sparkles, bg: "bg-orange-50 dark:bg-orange-900/20", iconBg: "bg-orange-100 dark:bg-orange-900/50", iconColor: "text-orange-600 dark:text-orange-400", border: "border-l-orange-500", badge: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300", label: "Workshop" };
      case "CAMP":
        return { icon: Tent, bg: "bg-green-50 dark:bg-green-900/20", iconBg: "bg-green-100 dark:bg-green-900/50", iconColor: "text-green-600 dark:text-green-400", border: "border-l-green-500", badge: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300", label: "Camp" };
      default:
        return { icon: Users, bg: "bg-blue-50 dark:bg-blue-900/20", iconBg: "bg-blue-100 dark:bg-blue-900/50", iconColor: "text-blue-600 dark:text-blue-400", border: "border-l-blue-500", badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300", label: "Group" };
    }
  };

  const style = getSessionStyle(cls.sessionType);
  const TypeIcon = style.icon;

  return (
    <Card className={`border-0 shadow-sm dark:bg-slate-800 border-l-4 ${style.border} ${style.bg}`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
              <TypeIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${style.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0 sm:hidden">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{cls.title}</h4>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
                  {style.label}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  {cls.start.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {cls.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">{cls.title}</h4>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
                {style.label}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-600 dark:text-slate-400 flex-wrap">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                {cls.start.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {cls.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </span>
              {cls.instructor && (
                <span>with {cls.instructor}</span>
              )}
            </div>
          </div>
          {cls.meetingUrl && (
            canJoin ? (
              <a
                href={cls.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
              >
                <Video className="w-4 h-4" />
                Join
              </a>
            ) : (
              <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-center w-full sm:w-auto">Students only</span>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Session Card Component
function SessionCard({ cls, canJoin }: { cls: any; canJoin: boolean }) {
  const getSessionStyle = (sessionType: string) => {
    switch (sessionType?.toUpperCase()) {
      case "ONE_ON_ONE":
        return {
          icon: User,
          bg: "bg-purple-50 dark:bg-purple-900/20",
          iconBg: "bg-purple-100 dark:bg-purple-900/50",
          iconColor: "text-purple-600 dark:text-purple-400",
          border: "border-l-purple-500",
          badge: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
          label: "1-on-1"
        };
      case "WORKSHOP":
        return {
          icon: Sparkles,
          bg: "bg-orange-50 dark:bg-orange-900/20",
          iconBg: "bg-orange-100 dark:bg-orange-900/50",
          iconColor: "text-orange-600 dark:text-orange-400",
          border: "border-l-orange-500",
          badge: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300",
          label: "Workshop"
        };
      case "CAMP":
        return {
          icon: Tent,
          bg: "bg-green-50 dark:bg-green-900/20",
          iconBg: "bg-green-100 dark:bg-green-900/50",
          iconColor: "text-green-600 dark:text-green-400",
          border: "border-l-green-500",
          badge: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
          label: "Camp"
        };
      case "GROUP":
      default:
        return {
          icon: Users,
          bg: "bg-blue-50 dark:bg-blue-900/20",
          iconBg: "bg-blue-100 dark:bg-blue-900/50",
          iconColor: "text-blue-600 dark:text-blue-400",
          border: "border-l-blue-500",
          badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
          label: "Group"
        };
    }
  };

  const style = getSessionStyle(cls.sessionType);
  const TypeIcon = style.icon;

  return (
    <Card className={`border-0 shadow-sm dark:bg-slate-800 border-l-4 ${style.border} ${style.bg}`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
              <TypeIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${style.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0 sm:hidden">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{cls.title}</h4>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
                  {style.label}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {cls.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                </span>
                {cls.instructor && (
                  <span className="truncate">with {cls.instructor}</span>
                )}
              </div>
            </div>
          </div>
          <div className="hidden sm:block flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">{cls.title}</h4>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
                {style.label}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {cls.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </span>
              {cls.instructor && (
                <span>with {cls.instructor}</span>
              )}
            </div>
          </div>
          {cls.meetingUrl && (
            canJoin ? (
              <a
                href={cls.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
              >
                <Video className="w-4 h-4" />
                Join
              </a>
            ) : (
              <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-center w-full sm:w-auto">Students only</span>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Upcoming Classes Component with Pagination
function UpcomingClasses({ classes, canJoin, today, setSelectedDate, startOfWeek, setWeekStart }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const upcomingClasses = classes.filter((cls: any) => cls.start >= new Date());

  if (upcomingClasses.length === 0) return null;

  const totalPages = Math.ceil(upcomingClasses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedClasses = upcomingClasses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getSessionStyle = (sessionType: string) => {
    switch (sessionType?.toUpperCase()) {
      case "ONE_ON_ONE":
        return { icon: User, iconColor: "text-purple-600 dark:text-purple-400", badge: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300", label: "1-on-1", border: "border-l-purple-500" };
      case "WORKSHOP":
        return { icon: Sparkles, iconColor: "text-orange-600 dark:text-orange-400", badge: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300", label: "Workshop", border: "border-l-orange-500" };
      case "CAMP":
        return { icon: Tent, iconColor: "text-green-600 dark:text-green-400", badge: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300", label: "Camp", border: "border-l-green-500" };
      default:
        return { icon: Users, iconColor: "text-blue-600 dark:text-blue-400", badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300", label: "Group", border: "border-l-blue-500" };
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Upcoming classes</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{upcomingClasses.length} classes available</p>
        </div>
        <Button size="sm" variant="ghost" onClick={() => {
          setSelectedDate(upcomingClasses[0]?.start || today);
          setWeekStart(startOfWeek(upcomingClasses[0]?.start || today));
        }}>
          Jump to next
        </Button>
      </div>

      {paginatedClasses.map((cls: any) => {
        const style = getSessionStyle(cls.sessionType);
        const TypeIcon = style.icon;
        return (
          <Card key={cls.id} className={`border-0 shadow-sm dark:bg-slate-800 border-l-4 ${style.border}`}>
            <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <TypeIcon className={`w-5 h-5 ${style.iconColor} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">{cls.title}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge} flex-shrink-0`}>
                      {style.label}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {cls.start.toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
              </div>
              {cls.meetingUrl && (
                canJoin ? (
                  <a href={cls.meetingUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 text-sm text-white bg-slate-900 dark:bg-white dark:text-slate-900 px-3 py-1.5 rounded-lg hover:opacity-90 w-full sm:w-auto">
                    <Video className="w-4 h-4" /> Join
                  </a>
                ) : (
                  <span className="text-xs text-slate-500 text-center sm:text-left">Students only</span>
                )
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, upcomingClasses.length)} of {upcomingClasses.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded-lg text-xs font-semibold transition ${
                  page === currentPage
                    ? "bg-purple-500 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {page}
              </button>
            ))}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
