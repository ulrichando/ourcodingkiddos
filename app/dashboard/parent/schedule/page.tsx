"use client";

import { useEffect, useState } from "react";
import ParentLayout from "@/components/parent/ParentLayout";
import { Calendar, Clock, Video, MapPin, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";

type ClassSession = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  meetingLink: string | null;
  location: string | null;
  instructor?: {
    name: string;
  };
  program?: {
    name: string;
  };
};

export default function ParentSchedulePage() {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch("/api/schedule");
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions || []);
        }
      } catch (error) {
        console.error("Failed to load schedule:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "IN_PROGRESS":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "COMPLETED":
        return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
      case "CANCELLED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  const upcomingSessions = sessions.filter(
    (s) => new Date(s.startTime) >= new Date() && s.status !== "CANCELLED"
  );

  return (
    <ParentLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Home / Schedule</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Schedule</h1>
            <p className="text-slate-600 dark:text-slate-400">View upcoming classes and sessions</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : upcomingSessions.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No Upcoming Classes</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Your child&apos;s scheduled classes will appear here.
            </p>
            <Button variant="outline" onClick={() => window.location.href = "/dashboard/parent/class-requests"}>
              Request a Class
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Date Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex flex-col items-center justify-center">
                      <span className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase">
                        {new Date(session.startTime).toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span className="text-xl font-bold text-violet-700 dark:text-violet-300">
                        {new Date(session.startTime).getDate()}
                      </span>
                    </div>
                  </div>

                  {/* Session Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {session.title || session.program?.name || "Class Session"}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(session.status)}`}>
                        {session.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                      </span>
                      {session.instructor?.name && (
                        <span>with {session.instructor.name}</span>
                      )}
                      {session.meetingLink && (
                        <span className="flex items-center gap-1 text-violet-600 dark:text-violet-400">
                          <Video className="w-4 h-4" />
                          Online
                        </span>
                      )}
                      {session.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {session.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Join Button */}
                  {session.meetingLink && session.status === "SCHEDULED" && (
                    <Button
                      onClick={() => window.open(session.meetingLink!, "_blank")}
                      className="flex-shrink-0"
                    >
                      <Video className="w-4 h-4" />
                      Join Class
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
