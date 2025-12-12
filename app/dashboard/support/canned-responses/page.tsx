"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SupportLayout from "../../../../components/support/SupportLayout";
import { Card, CardContent } from "../../../../components/ui/card";
import Button from "../../../../components/ui/button";
import {  FileText,
  Loader2,
  Plus,
  Edit,
  Trash2,
  Copy,
  Check,
  Search,
  MessageSquare,
  Tag,
  X,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




type CannedResponse = {
  id: string;
  title: string;
  content: string;
  category: string;
  usageCount: number;
};

const defaultResponses: CannedResponse[] = [
  {
    id: "1",
    title: "Welcome Greeting",
    content: "Hi! Welcome to Coding Kiddos! How can I help you today? I'm here to answer any questions about our coding programs for kids.",
    category: "Greetings",
    usageCount: 45,
  },
  {
    id: "2",
    title: "Program Information",
    content: "We offer coding classes for kids ages 6-18. Our programs include Scratch for beginners, Python, JavaScript, and web development. Each class is designed to be fun and engaging while teaching real programming skills. Would you like more details about a specific program?",
    category: "Programs",
    usageCount: 32,
  },
  {
    id: "3",
    title: "Pricing Inquiry",
    content: "Our classes start at $99/month for group sessions and we also offer 1-on-1 tutoring. We have flexible payment plans available. Would you like me to send you our full pricing details?",
    category: "Pricing",
    usageCount: 28,
  },
  {
    id: "4",
    title: "Free Trial Offer",
    content: "Great news! We offer a free trial class so your child can experience our teaching style before committing. Would you like me to help you schedule a free trial session?",
    category: "Sales",
    usageCount: 56,
  },
  {
    id: "5",
    title: "Technical Support",
    content: "I'm sorry to hear you're having technical difficulties. Let me help you troubleshoot. Could you please describe the issue you're experiencing and what device/browser you're using?",
    category: "Support",
    usageCount: 18,
  },
  {
    id: "6",
    title: "Class Schedule",
    content: "Our classes run throughout the week with various time slots to accommodate different schedules. Classes are typically 1 hour long. Would you like me to check availability for a specific day and time?",
    category: "Schedule",
    usageCount: 24,
  },
  {
    id: "7",
    title: "Thank You & Closing",
    content: "Thank you for chatting with us today! If you have any more questions, feel free to reach out anytime. Have a wonderful day! 🎉",
    category: "Closing",
    usageCount: 67,
  },
];

export default function SupportCannedResponsesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [responses, setResponses] = useState<CannedResponse[]>(defaultResponses);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingResponse, setEditingResponse] = useState<CannedResponse | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "", category: "" });

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/auth/login");
      return;
    }

    const role = session?.user?.role;
    if (role !== "SUPPORT" && role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }
  }, [session, status, router]);

  const categories = Array.from(new Set(responses.map((r) => r.category)));

  const filteredResponses = responses.filter((response) => {
    const matchesSearch =
      response.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || response.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content || !formData.category) return;

    if (editingResponse) {
      setResponses((prev) =>
        prev.map((r) =>
          r.id === editingResponse.id
            ? { ...r, title: formData.title, content: formData.content, category: formData.category }
            : r
        )
      );
    } else {
      const newResponse: CannedResponse = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        category: formData.category,
        usageCount: 0,
      };
      setResponses((prev) => [...prev, newResponse]);
    }
    setShowModal(false);
    setEditingResponse(null);
    setFormData({ title: "", content: "", category: "" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this response?")) {
      setResponses((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const openEditModal = (response: CannedResponse) => {
    setEditingResponse(response);
    setFormData({ title: response.title, content: response.content, category: response.category });
    setShowModal(true);
  };

  if (status === "loading" || loading) {
    return (
      <SupportLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </SupportLayout>
    );
  }

  return (
    <SupportLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 sm:gap-3">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
              Quick Replies
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Manage canned responses for faster support
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingResponse(null);
              setFormData({ title: "", content: "", category: "" });
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Response</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search responses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Responses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResponses.map((response) => (
            <Card key={response.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">{response.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {response.category}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                  {response.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    Used {response.usageCount} times
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(response.content, response.id)}
                      className="h-8"
                    >
                      {copiedId === response.id ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditModal(response)} className="h-8">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(response.id)}
                      className="h-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResponses.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No responses found</p>
            <p className="text-sm mt-1">Create your first quick reply to get started</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {editingResponse ? "Edit Response" : "Add New Response"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingResponse(null);
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Welcome Greeting"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Greetings, Support, Sales"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Message Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter your canned response message..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!formData.title || !formData.content || !formData.category}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
              >
                {editingResponse ? "Save Changes" : "Add Response"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </SupportLayout>
  );
}
