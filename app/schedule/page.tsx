"use client";

import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Calendar as CalendarIcon, Filter, Clock, ChevronLeft, ChevronRight, Video } from "lucide-react";
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

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Schedule</h1>
          <p className="text-slate-600 dark:text-slate-400">Book classes and manage your schedule</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left sidebar */}
          <div className="space-y-6">
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
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
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
                        className={`w-10 h-10 rounded-lg text-sm font-medium ${
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
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-0 shadow-sm dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const next = addDays(weekStart, -7);
                      setWeekStart(next);
                      setSelectedDate(next);
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex gap-2">
                    {weekDays.map((day) => {
                      const active = isSameDay(day, selectedDate);
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => {
                            setSelectedDate(day);
                            setWeekStart(startOfWeek(day));
                          }}
                          className={`flex flex-col items-center px-3 py-2 rounded-xl min-w-[60px] text-sm font-semibold ${
                            active ? "bg-purple-500 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <span className="opacity-70">{formatDay(day, { weekday: "short" })}</span>
                          <span className="text-lg">{formatDay(day, { day: "numeric" })}</span>
                        </button>
                      );
                    })}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
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
              {classes.filter((c) => isSameDay(c.start, selectedDate)).length === 0 ? (
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

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Upcoming classes</h3>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedDate(classes[0]?.start || today)}>
                        Jump to next
                      </Button>
                    </div>
                    {classes
                      .filter((cls) => cls.start >= new Date())
                      .map((cls) => (
                      <Card key={cls.id} className="border border-slate-200 dark:border-slate-700 dark:bg-slate-800">
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{cls.title}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {cls.start.toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} ·{" "}
                              {(cls.sessionType || cls.type || "").toLowerCase()}
                            </p>
                          </div>
                          {cls.meetingUrl && (
                            canJoin ? (
                              <Button variant="outline" size="sm">
                                <a href={cls.meetingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                                  <Video className="w-4 h-4" /> Join
                                </a>
                              </Button>
                            ) : (
                              <span className="text-xs text-slate-500">Students only</span>
                            )
                          )}
                        </CardContent>
                      </Card>
                      ))}
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  {classes
                    .filter((c) => isSameDay(c.start, selectedDate))
                    .map((cls) => (
                      <Card key={cls.id} className="border border-slate-200 dark:border-slate-700 dark:bg-slate-800">
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{cls.title}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {cls.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} ·{" "}
                              {(cls.sessionType || cls.type || "").toLowerCase()}
                            </p>
                          </div>
                          {cls.meetingUrl && (
                            canJoin ? (
                              <Button variant="outline" size="sm">
                                <a
                                  href={cls.meetingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1"
                                >
                                  <Video className="w-4 h-4" /> Join
                                </a>
                              </Button>
                            ) : (
                              <span className="text-xs text-slate-500">Students only</span>
                            )
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
