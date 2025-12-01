"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "../../../../components/ui/card";
import Button from "../../../../components/ui/button";
import { Calendar, Clock, User, BookOpen, Plus, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

type ClassRequest = {
  id: string;
  requestedTopic: string;
  description?: string;
  studentName?: string;
  studentAge?: number;
  preferredDays?: string[];
  preferredTimes?: string[];
  duration?: number;
  status: string;
  instructorName?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt: string;
  parentNotes?: string;
  adminNotes?: string;
  rejectionReason?: string;
};

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  APPROVED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  SCHEDULED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  COMPLETED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

const statusIcons = {
  PENDING: AlertCircle,
  APPROVED: CheckCircle,
  SCHEDULED: Calendar,
  REJECTED: XCircle,
  COMPLETED: CheckCircle,
  CANCELLED: XCircle,
};

export default function ClassRequestsPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<ClassRequest[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    studentAge: "",
    requestedTopic: "",
    description: "",
    preferredDays: [] as string[],
    preferredTimes: [] as string[],
    duration: "60",
    parentNotes: ""
  });

  useEffect(() => {
    loadRequests();
    loadStudents();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await fetch("/api/class-requests");
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error("Failed to load requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error("Failed to load students:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/class-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          studentAge: formData.studentAge ? parseInt(formData.studentAge) : undefined,
          duration: parseInt(formData.duration)
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Class request submitted successfully! We'll review it and get back to you soon.");
        setShowNewRequest(false);
        setFormData({
          studentId: "",
          studentName: "",
          studentAge: "",
          requestedTopic: "",
          description: "",
          preferredDays: [],
          preferredTimes: [],
          duration: "60",
          parentNotes: ""
        });
        loadRequests();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter(d => d !== day)
        : [...prev.preferredDays, day]
    }));
  };

  const toggleTime = (time: string) => {
    setFormData(prev => ({
      ...prev,
      preferredTimes: prev.preferredTimes.includes(time)
        ? prev.preferredTimes.filter(t => t !== time)
        : [...prev.preferredTimes, time]
    }));
  };

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = ["Morning (8AM-12PM)", "Afternoon (12PM-5PM)", "Evening (5PM-8PM)"];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">1-on-1 Class Requests</h1>
            <p className="text-slate-600 dark:text-slate-400">Request personalized lessons for your child</p>
          </div>
          <Button onClick={() => setShowNewRequest(true)} className="self-start">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center space-y-4">
              <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto" />
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">No requests yet</p>
                <p className="text-slate-600 dark:text-slate-400">Request a 1-on-1 class to get started</p>
              </div>
              <Button onClick={() => setShowNewRequest(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => {
              const StatusIcon = statusIcons[request.status as keyof typeof statusIcons] || AlertCircle;
              return (
                <Card key={request.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                              {request.requestedTopic}
                            </h3>
                            {request.studentName && (
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Student: {request.studentName}
                                {request.studentAge && ` (Age ${request.studentAge})`}
                              </p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColors[request.status as keyof typeof statusColors]}`}>
                            <StatusIcon className="w-3 h-3" />
                            {request.status}
                          </span>
                        </div>

                        {request.description && (
                          <p className="text-sm text-slate-700 dark:text-slate-300">{request.description}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                          {request.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {request.duration} minutes
                            </div>
                          )}
                          {request.instructorName && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {request.instructorName}
                            </div>
                          )}
                          {request.scheduledDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(request.scheduledDate).toLocaleDateString()}
                              {request.scheduledTime && ` at ${request.scheduledTime}`}
                            </div>
                          )}
                        </div>

                        {request.preferredDays && request.preferredDays.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Preferred Days:</p>
                            <div className="flex flex-wrap gap-2">
                              {request.preferredDays.map((day) => (
                                <span key={day} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                                  {day}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {request.adminNotes && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Admin Notes:</p>
                            <p className="text-sm text-blue-900 dark:text-blue-100">{request.adminNotes}</p>
                          </div>
                        )}

                        {request.rejectionReason && (
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">Rejection Reason:</p>
                            <p className="text-sm text-red-900 dark:text-red-100">{request.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                      Requested {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {showNewRequest && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Request 1-on-1 Class</h2>
                  <button
                    type="button"
                    onClick={() => setShowNewRequest(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <XCircle className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {/* Student Selection */}
                {students.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Select Student (Optional)
                    </label>
                    <select
                      value={formData.studentId}
                      onChange={(e) => {
                        const student = students.find(s => s.id === e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          studentId: e.target.value,
                          studentName: student?.name || "",
                          studentAge: student?.age?.toString() || ""
                        }));
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="">Select a student...</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} {student.age && `(Age ${student.age})`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Topic */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Topic / Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.requestedTopic}
                    onChange={(e) => setFormData(prev => ({ ...prev, requestedTopic: e.target.value }))}
                    placeholder="e.g., Python Basics, JavaScript Help, Game Development"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell us what you'd like to focus on..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>

                {/* Preferred Days */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Preferred Days
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {weekDays.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          formData.preferredDays.includes(day)
                            ? "bg-purple-500 text-white"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Times */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Preferred Times
                  </label>
                  <div className="space-y-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => toggleTime(time)}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition text-left ${
                          formData.preferredTimes.includes(time)
                            ? "bg-purple-500 text-white"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Parent Notes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.parentNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentNotes: e.target.value }))}
                    placeholder="Any other information we should know..."
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button type="button" variant="outline" onClick={() => setShowNewRequest(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
