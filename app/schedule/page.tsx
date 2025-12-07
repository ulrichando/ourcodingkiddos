"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Gamepad2, Code, ArrowRight } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import Button from "../../components/ui/button";

export default function SchedulePage() {
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

  // Check if selected day is Saturday (6) or Sunday (0)
  const isSaturday = selectedDate.getDay() === 6;
  const isSunday = selectedDate.getDay() === 0;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Schedule</h1>
          <p className="text-slate-600 dark:text-slate-400">View our weekly class schedule</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Left sidebar */}
          <div className="space-y-4 lg:space-y-6 order-2 lg:order-1">
            {/* Calendar */}
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
                    const isClassDay = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => {
                          setSelectedDate(date);
                          setWeekStart(startOfWeek(date));
                        }}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium relative ${
                          isSelected
                            ? "bg-purple-500 text-white"
                            : isClassDay
                              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50"
                              : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Highlighted days have scheduled classes
                </p>
              </CardContent>
            </Card>

            {/* Weekly Programs */}
            <Card className="border-0 shadow-sm dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <Clock className="w-4 h-4" />
                  Weekly Programs
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Our 2 running programs:
                </p>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">Sat</span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">JavaScript Game Dev</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-8">Saturday • 9:00 AM - 11:00 AM</p>
                  </div>
                  <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-900/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400">Sun</span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Intro to Programming</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-8">Sunday • 9:00 AM - 11:00 AM</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                  Classes repeat weekly
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-4 lg:space-y-6 order-1 lg:order-2">
            {/* Week navigation */}
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
                      const isClassDay = day.getDay() === 0 || day.getDay() === 6;
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => {
                            setSelectedDate(day);
                            setWeekStart(startOfWeek(day));
                          }}
                          className={`flex flex-col items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl min-w-[44px] sm:min-w-[60px] text-xs sm:text-sm font-semibold flex-shrink-0 ${
                            active
                              ? "bg-purple-500 text-white"
                              : isClassDay
                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200"
                                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
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

            {/* Selected day content */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {formatDay(selectedDate, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </h2>

              {isSaturday ? (
                /* Saturday - JavaScript Game Development */
                <Card className="border-0 shadow-sm dark:bg-slate-800 border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-900/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                        <Gamepad2 className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 mb-2 inline-block">
                          Every Saturday
                        </span>
                        <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                          JavaScript Game Development
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                          Learn to build interactive games using JavaScript. Perfect for kids who love gaming and want to create their own!
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            9:00 AM - 11:00 AM
                          </span>
                          <span>•</span>
                          <span>2 hours</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-purple-200 dark:border-purple-800">
                      <Link
                        href="/programs"
                        className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:underline"
                      >
                        Learn More & Enroll <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : isSunday ? (
                /* Sunday - Intro to Programming */
                <Card className="border-0 shadow-sm dark:bg-slate-800 border-l-4 border-l-pink-500 bg-pink-50 dark:bg-pink-900/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                        <Code className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-400 mb-2 inline-block">
                          Every Sunday
                        </span>
                        <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                          Intro to Programming
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                          Start your coding journey with the fundamentals. Great for beginners who are new to programming!
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            9:00 AM - 11:00 AM
                          </span>
                          <span>•</span>
                          <span>2 hours</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-pink-200 dark:border-pink-800">
                      <Link
                        href="/programs"
                        className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 font-semibold hover:underline"
                      >
                        Learn More & Enroll <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* No class on this day */
                <Card className="border-2 border-dashed border-slate-200 dark:border-slate-700 dark:bg-slate-800">
                  <CardContent className="p-12 text-center space-y-4">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">No classes on this day</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Our classes run on Saturdays and Sundays
                      </p>
                    </div>
                    <div className="pt-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Select a weekend day to see class details:</p>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            // Find next Saturday
                            const nextSat = new Date(selectedDate);
                            nextSat.setDate(nextSat.getDate() + (6 - nextSat.getDay() + 7) % 7 || 7);
                            setSelectedDate(nextSat);
                            setWeekStart(startOfWeek(nextSat));
                          }}
                          className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                        >
                          View Saturday Class
                        </button>
                        <button
                          onClick={() => {
                            // Find next Sunday
                            const nextSun = new Date(selectedDate);
                            nextSun.setDate(nextSun.getDate() + (7 - nextSun.getDay()) % 7 || 7);
                            setSelectedDate(nextSun);
                            setWeekStart(startOfWeek(nextSun));
                          }}
                          className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-lg text-sm font-medium hover:bg-pink-200 dark:hover:bg-pink-900/50 transition"
                        >
                          View Sunday Class
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Programs Summary */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <Card className="border-0 shadow-sm dark:bg-slate-800 hover:shadow-lg transition">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">JavaScript Game Dev</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Every Saturday</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">9:00 AM - 11:00 AM</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm dark:bg-slate-800 hover:shadow-lg transition">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center">
                      <Code className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">Intro to Programming</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Every Sunday</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">9:00 AM - 11:00 AM</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
