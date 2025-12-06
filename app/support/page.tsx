"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "../../components/ui/card";
import Button from "../../components/ui/button";
import { HelpCircle, Plus, MessageSquare, Send, Loader2, AlertCircle, CheckCircle, Clock, X, ArrowLeft } from "lucide-react";

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

type TicketReply = {
  id: string;
  message: string;
  fromName?: string;
  fromRole: string;
  isInternal: boolean;
  createdAt: string;
};

type TicketWithReplies = Ticket & {
  replies: TicketReply[];
};

const statusColors = {
  OPEN: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  WAITING_FOR_CUSTOMER: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  RESOLVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  CLOSED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

const priorityColors = {
  LOW: "text-slate-600 dark:text-slate-400",
  MEDIUM: "text-blue-600 dark:text-blue-400",
  HIGH: "text-orange-600 dark:text-orange-400",
  URGENT: "text-red-600 dark:text-red-400",
};

const categoryLabels = {
  TECHNICAL: "Technical",
  BILLING: "Billing",
  ACCOUNT: "Account",
  COURSE_CONTENT: "Course Content",
  BOOKING: "Booking",
  GENERAL: "General",
};

export default function SupportPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<TicketWithReplies | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "GENERAL",
    priority: "MEDIUM"
  });

  const userRole = (session as any)?.user?.role?.toUpperCase();
  const isAdmin = userRole === "ADMIN";

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

  const loadTicketDetails = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/support-tickets?id=${ticketId}`);
      const data = await res.json();
      setActiveTicket(data.ticket);
    } catch (error) {
      console.error("Failed to load ticket details:", error);
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
        alert("Support ticket created successfully! We'll get back to you soon.");
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

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/support-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reply",
          ticketId: activeTicket.id,
          message: replyText
        })
      });

      const data = await res.json();

      if (data.success) {
        setReplyText("");
        loadTicketDetails(activeTicket.id);
        loadTickets(); // Refresh list
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
      alert("Failed to send reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      const res = await fetch("/api/support-tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ticketId, status })
      });

      const data = await res.json();

      if (data.success) {
        loadTickets();
        if (activeTicket?.id === ticketId) {
          loadTicketDetails(ticketId);
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Show ticket details view
  if (activeTicket) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTicket(null)}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Ticket #{activeTicket.ticketNumber}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">{activeTicket.subject}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[activeTicket.status as keyof typeof statusColors]}`}>
              {activeTicket.status.replace(/_/g, " ")}
            </span>
          </div>

          {/* Admin Actions */}
          {isAdmin && activeTicket.status !== "CLOSED" && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Admin Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {activeTicket.status !== "IN_PROGRESS" && (
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(activeTicket.id, "IN_PROGRESS")}>
                      Mark In Progress
                    </Button>
                  )}
                  {activeTicket.status !== "RESOLVED" && (
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(activeTicket.id, "RESOLVED")}>
                      Mark Resolved
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(activeTicket.id, "CLOSED")}>
                    Close Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Original Message */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {activeTicket.userName || activeTicket.userEmail}
                    </p>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(activeTicket.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{activeTicket.description}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                      {categoryLabels[activeTicket.category as keyof typeof categoryLabels]}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${priorityColors[activeTicket.priority as keyof typeof priorityColors]}`}>
                      {activeTicket.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Replies */}
          <div className="space-y-4">
            {activeTicket.replies?.map((reply) => {
              if (reply.isInternal && !isAdmin) return null;

              return (
                <Card key={reply.id} className={`border-0 shadow-sm ${reply.isInternal ? "bg-amber-50 dark:bg-amber-900/20" : ""}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${reply.fromRole === "ADMIN" ? "bg-purple-100 dark:bg-purple-900/30" : "bg-slate-100 dark:bg-slate-800"}`}>
                        <MessageSquare className={`w-5 h-5 ${reply.fromRole === "ADMIN" ? "text-purple-600 dark:text-purple-400" : "text-slate-600 dark:text-slate-400"}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {reply.fromName || "Support"}
                            {reply.fromRole === "ADMIN" && " (Admin)"}
                          </p>
                          {reply.isInternal && (
                            <span className="text-xs px-2 py-0.5 bg-amber-200 dark:bg-amber-700 text-amber-900 dark:text-amber-100 rounded">
                              Internal Note
                            </span>
                          )}
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(reply.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{reply.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Reply Form */}
          {activeTicket.status !== "CLOSED" && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <form onSubmit={handleSubmitReply} className="space-y-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600"
                    required
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={submitting || !replyText.trim()}>
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Reply
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    );
  }

  // Show tickets list
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Support Tickets</h1>
            <p className="text-slate-600 dark:text-slate-400">Get help from our support team</p>
          </div>
          <Button onClick={() => setShowNewTicket(true)} className="self-start">
            <Plus className="w-4 h-4" />
            New Ticket
          </Button>
        </div>

        {/* Tickets List */}
        {tickets.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center space-y-4">
              <HelpCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto" />
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">No support tickets yet</p>
                <p className="text-slate-600 dark:text-slate-400">Create a ticket to get help from our team</p>
              </div>
              <Button onClick={() => setShowNewTicket(true)}>
                <Plus className="w-4 h-4" />
                Create Ticket
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => loadTicketDetails(ticket.id)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                          <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">#{ticket.ticketNumber}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[ticket.status as keyof typeof statusColors]}`}>
                              {ticket.status.replace(/_/g, " ")}
                            </span>
                            <span className={`text-xs font-semibold ${priorityColors[ticket.priority as keyof typeof priorityColors]}`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{ticket.subject}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{ticket.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>{categoryLabels[ticket.category as keyof typeof categoryLabels]}</span>
                            {ticket._count && ticket._count.replies > 0 && (
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {ticket._count.replies} {ticket._count.replies === 1 ? "reply" : "replies"}
                              </span>
                            )}
                            {ticket.assignedToName && (
                              <span>Assigned to {ticket.assignedToName}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    Created {new Date(ticket.createdAt).toLocaleDateString()} • Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4">
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
                    placeholder="Provide details about your issue..."
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
    </main>
  );
}
