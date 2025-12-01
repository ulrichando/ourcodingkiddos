"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import { Card, CardContent } from "../../../../components/ui/card";
import Button from "../../../../components/ui/button";
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

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
};

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  SCHEDULED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  COMPLETED: "bg-gray-100 text-gray-800",
};

export default function AdminClassRequestsPage() {
  const [requests, setRequests] = useState<ClassRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">1-on-1 Class Requests</h1>
          <p className="text-slate-600">Manage parent requests for personalized classes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Approved</p>
                  <p className="text-2xl font-bold text-blue-600">{approvedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Scheduled</p>
                  <p className="text-2xl font-bold text-green-600">{scheduledCount}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total</p>
                  <p className="text-2xl font-bold text-slate-900">{requests.length}</p>
                </div>
                <User className="w-8 h-8 text-slate-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <p className="text-slate-500">No class requests yet</p>
              </CardContent>
            </Card>
          ) : (
            requests.map(request => (
              <Card key={request.id} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">{request.requestedTopic}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[request.status as keyof typeof statusColors]}`}>
                            {request.status}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p><strong>Parent:</strong> {request.parentName || request.parentEmail}</p>
                          {request.studentName && <p><strong>Student:</strong> {request.studentName} {request.studentAge && `(Age ${request.studentAge})`}</p>}
                          {request.duration && <p><strong>Duration:</strong> {request.duration} minutes</p>}
                          {request.instructorName && <p><strong>Instructor:</strong> {request.instructorName}</p>}
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
                        className="text-sm text-purple-600 hover:underline"
                      >
                        {expandedId === request.id ? "Hide Details" : "Show Details"}
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {expandedId === request.id && (
                      <div className="border-t pt-4 space-y-3">
                        {request.description && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1">Description:</p>
                            <p className="text-sm text-slate-700">{request.description}</p>
                          </div>
                        )}

                        {request.preferredDays && request.preferredDays.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1">Preferred Days:</p>
                            <div className="flex flex-wrap gap-2">
                              {request.preferredDays.map(day => (
                                <span key={day} className="text-xs px-2 py-1 bg-slate-100 rounded">{day}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {request.preferredTimes && request.preferredTimes.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1">Preferred Times:</p>
                            <div className="flex flex-wrap gap-2">
                              {request.preferredTimes.map(time => (
                                <span key={time} className="text-xs px-2 py-1 bg-slate-100 rounded">{time}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {request.parentNotes && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1">Parent Notes:</p>
                            <p className="text-sm text-slate-700">{request.parentNotes}</p>
                          </div>
                        )}

                        {request.adminNotes && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs font-semibold text-blue-700 mb-1">Admin Notes:</p>
                            <p className="text-sm text-blue-900">{request.adminNotes}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      {request.status === "PENDING" && (
                        <>
                          <Button size="sm" onClick={() => handleUpdateStatus(request.id, "APPROVED")}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(request.id, "REJECTED")}>
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {(request.status === "APPROVED" || request.status === "PENDING") && (
                        <Button size="sm" variant="outline" onClick={() => handleAssignInstructor(request.id)}>
                          <User className="w-4 h-4 mr-1" />
                          Assign & Schedule
                        </Button>
                      )}
                      {request.status === "SCHEDULED" && (
                        <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(request.id, "COMPLETED")}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Completed
                        </Button>
                      )}
                    </div>

                    <div className="text-xs text-slate-500">
                      Requested on {new Date(request.createdAt).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
