"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import { Card, CardContent } from "../../../../components/ui/card";
import Button from "../../../../components/ui/button";
import { HelpCircle, MessageSquare, Clock, CheckCircle, Loader2, AlertCircle, User, Plus, X } from "lucide-react";

type Ticket = {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  userEmail: string;
  userName?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    replies: number;
  };
};

const statusColors = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  WAITING_FOR_CUSTOMER: "bg-orange-100 text-orange-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  LOW: "text-slate-600",
  MEDIUM: "text-blue-600",
  HIGH: "text-orange-600",
  URGENT: "text-red-600",
};

const categoryLabels: Record<string, string> = {
  TECHNICAL: "Technical",
  BILLING: "Billing",
  ACCOUNT: "Account",
  COURSE_CONTENT: "Course Content",
  BOOKING: "Booking",
  GENERAL: "General",
};

export default function AdminSupportTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "GENERAL",
    priority: "MEDIUM"
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await fetch("/api/support-tickets");
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Failed to load tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/support-tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });

      const data = await res.json();
      if (data.success) {
        loadTickets();
      }
    } catch (error) {
      console.error("Failed to update ticket:", error);
    }
  };

  const handleAssign = async (id: string) => {
    const assignedToName = prompt("Enter your name to assign this ticket to yourself:");
    if (!assignedToName) return;

    const assignedToEmail = prompt("Enter your email:");
    if (!assignedToEmail) return;

    try {
      const res = await fetch("/api/support-tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          assignedToName,
          assignedToEmail,
          status: "IN_PROGRESS"
        })
      });

      const data = await res.json();
      if (data.success) {
        loadTickets();
        alert("Ticket assigned successfully!");
      }
    } catch (error) {
      console.error("Failed to assign ticket:", error);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/support-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          ...formData
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Support ticket created successfully!");
        setShowNewTicket(false);
        setFormData({
          subject: "",
          description: "",
          category: "GENERAL",
          priority: "MEDIUM"
        });
        loadTickets();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to create ticket:", error);
      alert("Failed to create ticket. Please try again.");
    } finally {
      setSubmitting(false);
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

  const filteredTickets = filter === "all"
    ? tickets
    : tickets.filter(t => t.status === filter);

  const openCount = tickets.filter(t => t.status === "OPEN").length;
  const inProgressCount = tickets.filter(t => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter(t => t.status === "RESOLVED").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Support Tickets</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage customer support requests</p>
          </div>
          <Button onClick={() => setShowNewTicket(true)} className="self-start">
            <Plus className="w-4 h-4" />
            Create Ticket
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Open</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{openCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{inProgressCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Resolved</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{resolvedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{tickets.length}</p>
                </div>
                <HelpCircle className="w-8 h-8 text-slate-600 dark:text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All Tickets
          </Button>
          <Button
            size="sm"
            variant={filter === "OPEN" ? "default" : "outline"}
            onClick={() => setFilter("OPEN")}
          >
            Open
          </Button>
          <Button
            size="sm"
            variant={filter === "IN_PROGRESS" ? "default" : "outline"}
            onClick={() => setFilter("IN_PROGRESS")}
          >
            In Progress
          </Button>
          <Button
            size="sm"
            variant={filter === "RESOLVED" ? "default" : "outline"}
            onClick={() => setFilter("RESOLVED")}
          >
            Resolved
          </Button>
          <Button
            size="sm"
            variant={filter === "CLOSED" ? "default" : "outline"}
            onClick={() => setFilter("CLOSED")}
          >
            Closed
          </Button>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <p className="text-slate-500 dark:text-slate-400">No tickets found</p>
              </CardContent>
            </Card>
          ) : (
            filteredTickets.map(ticket => (
              <Card
                key={ticket.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => window.location.href = `/support?ticket=${ticket.id}`}
              >
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono text-slate-500">#{ticket.ticketNumber}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[ticket.status as keyof typeof statusColors]}`}>
                            {ticket.status.replace(/_/g, " ")}
                          </span>
                          <span className={`text-xs font-semibold ${priorityColors[ticket.priority as keyof typeof priorityColors]}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{ticket.subject}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">{ticket.description}</p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {ticket.userName || ticket.userEmail}
                      </div>
                      {ticket._count && ticket._count.replies > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {ticket._count.replies} {ticket._count.replies === 1 ? "reply" : "replies"}
                        </div>
                      )}
                      {ticket.assignedToName && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            Assigned to {ticket.assignedToName}
                          </span>
                        </div>
                      )}
                      <div className="text-xs">
                        Category: {ticket.category.replace(/_/g, " ")}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t" onClick={(e) => e.stopPropagation()}>
                      {ticket.status === "OPEN" && !ticket.assignedToName && (
                        <Button size="sm" onClick={() => handleAssign(ticket.id)}>
                          <User className="w-4 h-4 mr-1" />
                          Assign to Me
                        </Button>
                      )}
                      {ticket.status === "IN_PROGRESS" && (
                        <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(ticket.id, "WAITING_FOR_CUSTOMER")}>
                          Waiting for Customer
                        </Button>
                      )}
                      {(ticket.status === "IN_PROGRESS" || ticket.status === "WAITING_FOR_CUSTOMER") && (
                        <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(ticket.id, "RESOLVED")}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Resolved
                        </Button>
                      )}
                      {ticket.status === "RESOLVED" && (
                        <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(ticket.id, "CLOSED")}>
                          Close Ticket
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.location.href = `/support?ticket=${ticket.id}`}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        View & Reply
                      </Button>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Created {new Date(ticket.createdAt).toLocaleString()} • Updated {new Date(ticket.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl">
            <form onSubmit={handleSubmitTicket}>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create Support Ticket</h2>
                  <button
                    type="button"
                    onClick={() => setShowNewTicket(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide details about the issue..."
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      {Object.entries(categoryLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button type="button" variant="outline" onClick={() => setShowNewTicket(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Create Ticket
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
