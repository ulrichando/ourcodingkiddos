"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Button from "../../../../components/ui/button";
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Loader2, ChevronDown, ChevronUp, MoreHorizontal, CreditCard, DollarSign } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';



type ClassRequest = {
  id: string;
  requestedTopic: string;
  description?: string;
  parentEmail: string;
  parentName?: string;
  studentName?: string;
  studentAge?: number;
  preferredDays?: string[];
  preferredTimes?: string[];
  duration?: number;
  status: string;
  instructorEmail?: string;
  instructorName?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt: string;
  parentNotes?: string;
  adminNotes?: string;
  // Pricing fields
  numberOfSessions?: number;
  daysPerWeek?: number;
  numberOfWeeks?: number;
  totalPrice?: number;
  pricePerSession?: number;
  paymentStatus?: string;
  preferredInstructorName?: string;
};

const statusConfig = {
  PENDING: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-500/30",
    dot: "bg-amber-500"
  },
  APPROVED: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-500/30",
    dot: "bg-blue-500"
  },
  SCHEDULED: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-500/30",
    dot: "bg-emerald-500"
  },
  REJECTED: {
    bg: "bg-red-50 dark:bg-red-500/10",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-500/30",
    dot: "bg-red-500"
  },
  COMPLETED: {
    bg: "bg-slate-50 dark:bg-slate-500/10",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-500/30",
    dot: "bg-slate-400"
  },
};

export default function AdminClassRequestsPage() {
  const [requests, setRequests] = useState<ClassRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClick = () => setActionMenuId(null);
    if (actionMenuId) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [actionMenuId]);

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

  const handleUpdateStatus = async (id: string, status: string) => {
    const adminNotes = status === "REJECTED"
      ? prompt("Please provide a reason for rejection:")
      : status === "APPROVED"
      ? prompt("Admin notes (optional):")
      : null;

    if (status === "REJECTED" && !adminNotes) return;

    try {
      const res = await fetch("/api/class-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          adminNotes: adminNotes || undefined,
          rejectionReason: status === "REJECTED" ? adminNotes : undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        loadRequests();
        alert("Request updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update request:", error);
      alert("Failed to update request.");
    }
  };

  const handleAssignInstructor = async (id: string) => {
    const instructorEmail = prompt("Enter instructor email:");
    if (!instructorEmail) return;

    const instructorName = prompt("Enter instructor name:");
    if (!instructorName) return;

    try {
      const res = await fetch("/api/class-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          instructorEmail,
          instructorName,
          status: "SCHEDULED"
        })
      });

      const data = await res.json();
      if (data.success) {
        loadRequests();
        alert("Instructor assigned successfully!");
      }
    } catch (error) {
      console.error("Failed to assign instructor:", error);
      alert("Failed to assign instructor.");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </AdminLayout>
    );
  }

  const pendingCount = requests.filter(r => r.status === "PENDING").length;
  const approvedCount = requests.filter(r => r.status === "APPROVED").length;
  const scheduledCount = requests.filter(r => r.status === "SCHEDULED").length;

  const filteredRequests = filter === "all"
    ? requests
    : requests.filter(r => r.status === filter);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Class Requests</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Class Requests</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {requests.length} total request{requests.length !== 1 ? "s" : ""} - Manage 1-on-1 class requests from parents
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setFilter(filter === "PENDING" ? "all" : "PENDING")}
            className={`p-4 rounded-xl border transition-all ${
              filter === "PENDING"
                ? "border-amber-300 dark:border-amber-500/50 bg-amber-50 dark:bg-amber-500/10"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div className="text-left">
                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{pendingCount}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setFilter(filter === "APPROVED" ? "all" : "APPROVED")}
            className={`p-4 rounded-xl border transition-all ${
              filter === "APPROVED"
                ? "border-blue-300 dark:border-blue-500/50 bg-blue-50 dark:bg-blue-500/10"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="text-left">
                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{approvedCount}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Approved</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setFilter(filter === "SCHEDULED" ? "all" : "SCHEDULED")}
            className={`p-4 rounded-xl border transition-all ${
              filter === "SCHEDULED"
                ? "border-emerald-300 dark:border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/10"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="text-left">
                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{scheduledCount}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Scheduled</p>
              </div>
            </div>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
          {["all", "PENDING", "APPROVED", "SCHEDULED", "COMPLETED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                filter === status
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">No requests found</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                {filter !== "all" ? "Try changing the filter" : "Class requests will appear here"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredRequests.map(request => {
                const config = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.PENDING;
                const isExpanded = expandedId === request.id;

                return (
                  <div key={request.id} className="group">
                    {/* Main Row */}
                    <div className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      {/* Status Indicator */}
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dot}`} />

                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                            {request.requestedTopic}
                          </h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${config.bg} ${config.text} ${config.border}`}>
                            {request.status}
                          </span>
                          {/* Payment Status Badge */}
                          {request.paymentStatus && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border flex items-center gap-1 ${
                              request.paymentStatus === 'PAID'
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                                : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                            }`}>
                              <CreditCard className="w-3 h-3" />
                              {request.paymentStatus}
                            </span>
                          )}
                          {/* Show "Awaiting Payment" for approved but unpaid */}
                          {request.status === 'APPROVED' && !request.paymentStatus && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Awaiting Payment
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {request.parentName || request.parentEmail}
                          </span>
                          {request.studentName && (
                            <span>Student: {request.studentName}</span>
                          )}
                          {request.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {request.duration}min
                            </span>
                          )}
                          {request.numberOfSessions && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {request.numberOfSessions} sessions
                            </span>
                          )}
                          {request.totalPrice && (
                            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                              <DollarSign className="w-3.5 h-3.5" />
                              ${(request.totalPrice / 100).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                        {formatDate(request.createdAt)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {/* Quick Actions */}
                        {request.status === "PENDING" && (
                          <div className="hidden sm:flex items-center gap-1">
                            <Button
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleUpdateStatus(request.id, "APPROVED"); }}
                              className="h-8"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => { e.stopPropagation(); handleUpdateStatus(request.id, "REJECTED"); }}
                              className="h-8"
                            >
                              Reject
                            </Button>
                          </div>
                        )}

                        {/* More Actions Menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuId(actionMenuId === request.id ? null : request.id);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4 text-slate-500" />
                          </button>

                          {actionMenuId === request.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                              {request.status === "PENDING" && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(request.id, "APPROVED")}
                                    className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(request.id, "REJECTED")}
                                    className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                  >
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    Reject
                                  </button>
                                </>
                              )}
                              {(request.status === "APPROVED" || request.status === "PENDING") && (
                                <button
                                  onClick={() => handleAssignInstructor(request.id)}
                                  className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                >
                                  <User className="w-4 h-4 text-blue-500" />
                                  Assign Instructor
                                </button>
                              )}
                              {request.status === "SCHEDULED" && (
                                <button
                                  onClick={() => handleUpdateStatus(request.id, "COMPLETED")}
                                  className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                >
                                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                                  Mark Completed
                                </button>
                              )}
                              <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                              <button
                                onClick={() => setExpandedId(isExpanded ? null : request.id)}
                                className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                              >
                                {isExpanded ? (
                                  <><ChevronUp className="w-4 h-4" /> Hide Details</>
                                ) : (
                                  <><ChevronDown className="w-4 h-4" /> View Details</>
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Expand Button */}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : request.id)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        {/* Workflow Status Banner */}
                        <div className="mt-4 mb-4 p-3 rounded-lg border">
                          {request.status === 'PENDING' && (
                            <div className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 p-3 rounded-lg">
                              <p className="font-medium">Step 1: Review Request</p>
                              <p className="text-sm mt-1">Review this request and approve or reject it. Once approved, the parent will be notified to complete payment.</p>
                            </div>
                          )}
                          {request.status === 'APPROVED' && (!request.paymentStatus || request.paymentStatus !== 'PAID') && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200 p-3 rounded-lg">
                              <p className="font-medium">Step 2: Awaiting Payment</p>
                              <p className="text-sm mt-1">Request approved. Waiting for parent to complete payment before scheduling can proceed.</p>
                            </div>
                          )}
                          {request.status === 'APPROVED' && request.paymentStatus === 'PAID' && (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 p-3 rounded-lg">
                              <p className="font-medium">Step 3: Ready to Schedule</p>
                              <p className="text-sm mt-1">Payment received! You can now assign an instructor and schedule the sessions.</p>
                            </div>
                          )}
                          {request.status === 'SCHEDULED' && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 p-3 rounded-lg">
                              <p className="font-medium">Scheduled</p>
                              <p className="text-sm mt-1">This request has been scheduled with an instructor. Mark as completed when sessions are done.</p>
                            </div>
                          )}
                        </div>

                        {/* Pricing Summary */}
                        {(request.totalPrice || request.numberOfSessions) && (
                          <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                            <p className="text-xs font-medium text-purple-700 dark:text-purple-400 uppercase tracking-wide mb-2">Pricing Details</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                              {request.numberOfSessions && (
                                <div>
                                  <span className="text-slate-500 dark:text-slate-400">Sessions:</span>{" "}
                                  <span className="font-medium text-slate-900 dark:text-slate-100">{request.numberOfSessions}</span>
                                  {request.daysPerWeek && request.numberOfWeeks && (
                                    <span className="text-slate-400 dark:text-slate-500"> ({request.daysPerWeek}×/wk × {request.numberOfWeeks} wks)</span>
                                  )}
                                </div>
                              )}
                              {request.pricePerSession && (
                                <div>
                                  <span className="text-slate-500 dark:text-slate-400">Per Session:</span>{" "}
                                  <span className="font-medium text-slate-900 dark:text-slate-100">${(request.pricePerSession / 100).toFixed(2)}</span>
                                </div>
                              )}
                              {request.totalPrice && (
                                <div>
                                  <span className="text-slate-500 dark:text-slate-400">Total:</span>{" "}
                                  <span className="font-bold text-purple-700 dark:text-purple-300">${(request.totalPrice / 100).toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Left Column */}
                          <div className="space-y-3">
                            {request.description && (
                              <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Description</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{request.description}</p>
                              </div>
                            )}

                            {request.studentAge && (
                              <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Student Age</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{request.studentAge} years old</p>
                              </div>
                            )}

                            {request.preferredInstructorName && (
                              <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Preferred Instructor</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{request.preferredInstructorName}</p>
                              </div>
                            )}

                            {request.instructorName && (
                              <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Assigned Instructor</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{request.instructorName}</p>
                              </div>
                            )}
                          </div>

                          {/* Right Column */}
                          <div className="space-y-3">
                            {request.preferredDays && request.preferredDays.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Preferred Days</p>
                                <div className="flex flex-wrap gap-1">
                                  {request.preferredDays.map(day => (
                                    <span key={day} className="px-2 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                                      {day}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {request.preferredTimes && request.preferredTimes.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Preferred Times</p>
                                <div className="flex flex-wrap gap-1">
                                  {request.preferredTimes.map(time => (
                                    <span key={time} className="px-2 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                                      {time}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {request.parentNotes && (
                              <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Parent Notes</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{request.parentNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {request.adminNotes && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-1">Admin Notes</p>
                            <p className="text-sm text-blue-900 dark:text-blue-200">{request.adminNotes}</p>
                          </div>
                        )}

                        {/* Mobile Actions */}
                        <div className="flex flex-wrap gap-2 mt-4 sm:hidden">
                          {request.status === "PENDING" && (
                            <>
                              <Button size="sm" onClick={() => handleUpdateStatus(request.id, "APPROVED")}>
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(request.id, "REJECTED")}>
                                <XCircle className="w-4 h-4" />
                                Reject
                              </Button>
                            </>
                          )}
                          {(request.status === "APPROVED" || request.status === "PENDING") && (
                            <Button size="sm" variant="outline" onClick={() => handleAssignInstructor(request.id)}>
                              <User className="w-4 h-4" />
                              Assign
                            </Button>
                          )}
                          {request.status === "SCHEDULED" && (
                            <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(request.id, "COMPLETED")}>
                              <CheckCircle className="w-4 h-4" />
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
