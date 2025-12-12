"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "../../../../components/ui/card";
import Button from "../../../../components/ui/button";
import { Calendar, Clock, User, BookOpen, Plus, CheckCircle, XCircle, AlertCircle, Loader2, Users, CreditCard } from "lucide-react";
import ParentLayout from "../../../../components/parent/ParentLayout";

// Force dynamic rendering
export const dynamic = 'force-dynamic';



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
  preferredInstructorName?: string;
  instructorName?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt: string;
  parentNotes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  numberOfSessions?: number;
  daysPerWeek?: number;
  numberOfWeeks?: number;
  totalPrice?: number;
  paymentStatus?: string;
};

type PricingInfo = {
  basePrice: number;
  basePriceFormatted: string;
  discount: number;
  discountFormatted: string;
  discountPercent: number;
  totalPrice: number;
  totalPriceFormatted: string;
  pricePerSession: number;
  pricePerSessionFormatted: string;
};

type RecurringAvailability = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: true;
};

type SpecificDateAvailability = {
  id: string;
  specificDate: string;
  startTime: string;
  endTime: string;
  isRecurring: false;
};

type Instructor = {
  id: string;
  name: string;
  email: string;
  image?: string;
  availability: RecurringAvailability[];
  specificDateAvailability: SpecificDateAvailability[];
};

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

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
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState<ClassRequest[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);

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
    daysPerWeek: "1",
    numberOfWeeks: "4",
    parentNotes: "",
    preferredInstructorId: "",
    preferredInstructorName: ""
  });

  // Calculate total sessions from days per week and weeks
  const totalSessions = parseInt(formData.daysPerWeek) * parseInt(formData.numberOfWeeks);

  // Check for payment status in URL
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      alert("Payment successful! Your class request has been submitted and we'll review it shortly.");
    } else if (paymentStatus === "cancelled") {
      alert("Payment was cancelled. You can try again when you're ready.");
    }
  }, [searchParams]);

  useEffect(() => {
    loadRequests();
    loadStudents();
    loadInstructors();
  }, []);

  // Calculate pricing when duration, days per week, or weeks change
  useEffect(() => {
    const fetchPricing = async () => {
      setPricingLoading(true);
      try {
        const res = await fetch(`/api/one-on-one/checkout?duration=${formData.duration}&sessions=${totalSessions}`);
        const data = await res.json();
        if (!data.error) {
          setPricing(data);
        }
      } catch (error) {
        console.error("Failed to fetch pricing:", error);
      } finally {
        setPricingLoading(false);
      }
    };
    fetchPricing();
  }, [formData.duration, formData.daysPerWeek, formData.numberOfWeeks, totalSessions]);

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

  const loadInstructors = async () => {
    try {
      const res = await fetch("/api/instructors");
      const data = await res.json();
      setInstructors(data.instructors || []);
    } catch (error) {
      console.error("Failed to load instructors:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Submit request for admin review (no payment yet)
      const res = await fetch("/api/class-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          studentAge: formData.studentAge ? parseInt(formData.studentAge) : undefined,
          duration: parseInt(formData.duration),
          numberOfSessions: totalSessions,
          daysPerWeek: parseInt(formData.daysPerWeek),
          numberOfWeeks: parseInt(formData.numberOfWeeks),
          totalPrice: pricing?.totalPrice,
          pricePerSession: pricing?.pricePerSession,
          discountApplied: pricing?.discount
        })
      });

      const data = await res.json();

      if (data.success) {
        setShowNewRequest(false);
        loadRequests();
        alert("Your request has been submitted and is pending admin review. You'll be able to pay once it's approved.");
        // Reset form
        setFormData({
          studentId: "",
          studentName: "",
          studentAge: "",
          requestedTopic: "",
          description: "",
          preferredDays: [],
          preferredTimes: [],
          duration: "60",
          daysPerWeek: "1",
          numberOfWeeks: "4",
          parentNotes: "",
          preferredInstructorId: "",
          preferredInstructorName: ""
        });
      } else {
        alert(`Error: ${data.error || "Failed to submit request"}`);
      }
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayNow = async (requestId: string) => {
    try {
      const res = await fetch(`/api/one-on-one/checkout/${requestId}`, {
        method: "POST"
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(`Error: ${data.error || "Failed to create checkout session"}`);
      }
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      alert("Failed to initiate payment. Please try again.");
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
    <ParentLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">1-on-1 Class Requests</h1>
            <p className="text-slate-600 dark:text-slate-400">Request personalized lessons for your child</p>
          </div>
          <Button onClick={() => setShowNewRequest(true)} className="self-start">
            <Plus className="w-4 h-4" />
            New Request
          </Button>
        </div>

        {/* Instructor Availability Section */}
        {instructors.length > 0 && instructors.some(i => i.availability.length > 0 || i.specificDateAvailability?.length > 0) && (
          <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Instructor Availability
                </h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                See when our instructors are available for 1-on-1 sessions
              </p>
              <div className="grid gap-4">
                {instructors.filter(i => i.availability.length > 0 || i.specificDateAvailability?.length > 0).map((instructor) => {
                  const totalSlots = instructor.availability.length + (instructor.specificDateAvailability?.length || 0);
                  return (
                    <div
                      key={instructor.id}
                      className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          {instructor.image ? (
                            <img
                              src={instructor.image}
                              alt={instructor.name || "Instructor"}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {instructor.name || "Instructor"}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {totalSlots} time slot{totalSlots !== 1 ? 's' : ''} available
                          </p>
                        </div>
                      </div>

                      {/* Recurring Weekly Availability */}
                      {instructor.availability.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                            Weekly Schedule
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {DAYS_OF_WEEK.map((day, dayIndex) => {
                              const daySlots = instructor.availability.filter(a => a.dayOfWeek === dayIndex);
                              if (daySlots.length === 0) return null;
                              return (
                                <div key={day} className="flex items-center gap-1">
                                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                    {day.substring(0, 3)}:
                                  </span>
                                  {daySlots.map((slot) => (
                                    <span
                                      key={slot.id}
                                      className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded"
                                    >
                                      {formatTime(slot.startTime)}-{formatTime(slot.endTime)}
                                    </span>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Specific Date Availability */}
                      {instructor.specificDateAvailability && instructor.specificDateAvailability.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                            Upcoming Dates
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {instructor.specificDateAvailability.map((slot) => {
                              const date = new Date(slot.specificDate);
                              const formattedDate = date.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              });
                              return (
                                <div key={slot.id} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-2 py-1">
                                  <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                    {formattedDate}:
                                  </span>
                                  <span className="text-xs text-blue-600 dark:text-blue-400">
                                    {formatTime(slot.startTime)}-{formatTime(slot.endTime)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

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
                <Plus className="w-4 h-4" />
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
                          {request.numberOfSessions && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {request.numberOfSessions} session{request.numberOfSessions !== 1 ? 's' : ''}
                              {request.daysPerWeek && request.numberOfWeeks && (
                                <span className="text-xs text-slate-500">
                                  ({request.daysPerWeek}×/wk × {request.numberOfWeeks} wks)
                                </span>
                              )}
                            </div>
                          )}
                          {request.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {request.duration} minutes
                            </div>
                          )}
                          {request.totalPrice && (
                            <div className="flex items-center gap-1">
                              <CreditCard className="w-4 h-4" />
                              ${(request.totalPrice / 100).toFixed(2)}
                              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded ${
                                request.paymentStatus === 'PAID'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                              }`}>
                                {request.paymentStatus || 'UNPAID'}
                              </span>
                            </div>
                          )}
                          {request.preferredInstructorName && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span className="text-xs text-slate-500">Requested:</span> {request.preferredInstructorName}
                            </div>
                          )}
                          {request.instructorName && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4 text-green-600" />
                              <span className="text-xs text-green-600">Assigned:</span> {request.instructorName}
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

                        {/* Pay Now button for APPROVED requests */}
                        {request.status === "APPROVED" && request.paymentStatus !== "PAID" && (
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div>
                                <p className="font-semibold text-green-700 dark:text-green-300">Request Approved!</p>
                                <p className="text-sm text-green-600 dark:text-green-400">
                                  Your request has been approved. Please complete the payment to proceed.
                                </p>
                              </div>
                              <Button
                                onClick={() => handlePayNow(request.id)}
                                className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                              >
                                <CreditCard className="w-4 h-4" />
                                Pay Now {request.totalPrice ? `($${(request.totalPrice / 100).toFixed(2)})` : ''}
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Pending review notice */}
                        {request.status === "PENDING" && (
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-3">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              <AlertCircle className="w-4 h-4 inline mr-1" />
                              Your request is being reviewed. You'll be able to pay once it's approved.
                            </p>
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
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg my-4">
            <form onSubmit={handleSubmit}>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Request 1-on-1 Class</h2>
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
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                    >
                      <option value="">Select a student...</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Instructor Selection */}
                {instructors.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Instructor (Optional)
                    </label>
                    <select
                      value={formData.preferredInstructorId}
                      onChange={(e) => {
                        const instructor = instructors.find(i => i.id === e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          preferredInstructorId: e.target.value,
                          preferredInstructorName: instructor?.name || ""
                        }));
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                    >
                      <option value="">No preference</option>
                      {instructors.map(instructor => (
                        <option key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Topic */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Topic / Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.requestedTopic}
                    onChange={(e) => setFormData(prev => ({ ...prev, requestedTopic: e.target.value }))}
                    placeholder="e.g., Python Basics, JavaScript, Game Dev"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell us what you'd like to focus on..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                  />
                </div>

                {/* Duration, Days & Weeks */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Duration
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                    >
                      <option value="30">30 min - $40</option>
                      <option value="60">60 min - $75</option>
                      <option value="90">90 min - $100</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Days/Week
                    </label>
                    <select
                      value={formData.daysPerWeek}
                      onChange={(e) => setFormData(prev => ({ ...prev, daysPerWeek: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                    >
                      <option value="1">1 day</option>
                      <option value="2">2 days</option>
                      <option value="3">3 days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Weeks
                    </label>
                    <select
                      value={formData.numberOfWeeks}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberOfWeeks: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                    >
                      <option value="1">1 week</option>
                      <option value="2">2 weeks</option>
                      <option value="4">4 weeks</option>
                      <option value="8">8 weeks</option>
                      <option value="12">12 weeks</option>
                    </select>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                  {pricingLoading ? (
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Calculating...
                    </div>
                  ) : pricing ? (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-medium">{totalSessions} session{totalSessions !== 1 ? 's' : ''}</span>
                        <span className="text-xs ml-1">({formData.daysPerWeek}×/wk × {formData.numberOfWeeks} wks)</span>
                        {pricing.discount > 0 && (
                          <span className="ml-2 text-green-600 dark:text-green-400 text-xs font-medium">
                            {pricing.discountPercent}% off
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{pricing.totalPriceFormatted}</span>
                        <p className="text-xs text-slate-500">{pricing.pricePerSessionFormatted}/session</p>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Preferred Days */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Days
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {weekDays.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-2 py-1 rounded text-xs font-medium transition ${
                          formData.preferredDays.includes(day)
                            ? "bg-purple-500 text-white"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Times */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Times
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => toggleTime(time)}
                        className={`px-2 py-1 rounded text-xs font-medium transition ${
                          formData.preferredTimes.includes(time)
                            ? "bg-purple-500 text-white"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Parent Notes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    value={formData.parentNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentNotes: e.target.value }))}
                    placeholder="Any other information..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <Button type="button" variant="outline" onClick={() => setShowNewRequest(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting || pricingLoading}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Submit Request {pricing ? `(${pricing.totalPriceFormatted})` : ''}
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
                  Your request will be reviewed by our team. Payment will be required once approved.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </ParentLayout>
  );
}
