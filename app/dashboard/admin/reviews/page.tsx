"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Star,
  Check,
  X,
  Trash2,
  Award,
  Clock,
  MessageSquare,
  User,
  Loader2,
  AlertCircle,
  Plus,
  Edit,
  Save,
} from "lucide-react";

interface Review {
  id: string;
  authorEmail: string;
  authorName: string;
  authorPhoto: string | null;
  childName: string | null;
  childAge: number | null;
  rating: number;
  title: string | null;
  content: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

const emptyForm = {
  authorName: "",
  authorEmail: "",
  authorPhoto: "",
  childName: "",
  childAge: "",
  rating: 5,
  title: "",
  content: "",
  isApproved: true,
  isFeatured: false,
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "featured">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetch("/api/reviews?all=true");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingReview(null);
    setFormData(emptyForm);
    setShowModal(true);
  }

  function openEditModal(review: Review) {
    setEditingReview(review);
    setFormData({
      authorName: review.authorName,
      authorEmail: review.authorEmail,
      authorPhoto: review.authorPhoto || "",
      childName: review.childName || "",
      childAge: review.childAge?.toString() || "",
      rating: review.rating,
      title: review.title || "",
      content: review.content,
      isApproved: review.isApproved,
      isFeatured: review.isFeatured,
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingReview(null);
    setFormData(emptyForm);
  }

  async function handleSave() {
    if (!formData.authorName || !formData.authorEmail || !formData.content) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const url = editingReview ? `/api/reviews/${editingReview.id}` : "/api/reviews";
      const method = editingReview ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        closeModal();
        fetchReviews();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save review");
      }
    } catch (error) {
      console.error("Failed to save review:", error);
      alert("Failed to save review");
    } finally {
      setSaving(false);
    }
  }

  async function handleApprove(id: string, approve: boolean) {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: approve }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isApproved: approve } : r))
        );
      }
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  }

  async function handleFeature(id: string, feature: boolean) {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: feature }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isFeatured: feature } : r))
        );
      }
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  }

  const filteredReviews = reviews.filter((r) => {
    if (filter === "pending") return !r.isApproved;
    if (filter === "approved") return r.isApproved && !r.isFeatured;
    if (filter === "featured") return r.isFeatured;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.isApproved).length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;
  const featuredCount = reviews.filter((r) => r.isFeatured).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Parent Reviews
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage and moderate parent reviews
              </p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Review
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`p-4 rounded-xl border transition-all ${
              filter === "all"
                ? "bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {reviews.length}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Total Reviews</div>
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`p-4 rounded-xl border transition-all ${
              filter === "pending"
                ? "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {pendingCount}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Pending Review</div>
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`p-4 rounded-xl border transition-all ${
              filter === "approved"
                ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {approvedCount}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Approved</div>
          </button>
          <button
            onClick={() => setFilter("featured")}
            className={`p-4 rounded-xl border transition-all ${
              filter === "featured"
                ? "bg-pink-50 dark:bg-pink-900/20 border-pink-300 dark:border-pink-700"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
              {featuredCount}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Featured</div>
          </button>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No reviews found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              {filter === "pending"
                ? "No reviews pending approval"
                : filter === "featured"
                ? "No featured reviews yet"
                : "No reviews have been submitted yet"}
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Review
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl border ${
                  !review.isApproved
                    ? "border-amber-300 dark:border-amber-700"
                    : review.isFeatured
                    ? "border-pink-300 dark:border-pink-700"
                    : "border-slate-200 dark:border-slate-700"
                } p-6`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden">
                      {review.authorPhoto ? (
                        <img
                          src={review.authorPhoto}
                          alt={review.authorName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {review.authorName}
                        </span>
                        {review.childName && (
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            Parent of {review.childName}
                            {review.childAge && `, ${review.childAge}`}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-300 dark:text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        {!review.isApproved && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                        {review.isFeatured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-xs font-medium">
                            <Award className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>
                      {review.title && (
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                          {review.title}
                        </h3>
                      )}
                      <p className="text-slate-700 dark:text-slate-300">{review.content}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        {review.authorEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(review)}
                      className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    {!review.isApproved ? (
                      <button
                        onClick={() => handleApprove(review.id, true)}
                        className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApprove(review.id, false)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        title="Unapprove"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleFeature(review.id, !review.isFeatured)}
                      className={`p-2 rounded-lg transition-colors ${
                        review.isFeatured
                          ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 hover:bg-pink-200"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                      }`}
                      title={review.isFeatured ? "Remove from featured" : "Feature on homepage"}
                    >
                      <Award className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {editingReview ? "Edit Review" : "Add New Review"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {editingReview
                  ? "Update the review details below"
                  : "Create a review on behalf of a parent"}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Author Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Author Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="Parent's name"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Author Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.authorEmail}
                    onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                    placeholder="parent@example.com"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Photo URL <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.authorPhoto}
                  onChange={(e) => setFormData({ ...formData, authorPhoto: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Child Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Child&apos;s Name <span className="text-slate-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.childName}
                    onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                    placeholder="First name"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Child&apos;s Age <span className="text-slate-400">(optional)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.childAge}
                    onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                    placeholder="Age"
                    min="5"
                    max="18"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || formData.rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-300 dark:text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Review Title <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Sum up the experience"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Review Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the review content (min 20 characters)..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
                />
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isApproved}
                    onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Approved</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Featured</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.authorName || !formData.authorEmail || formData.content.length < 20}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingReview ? "Update Review" : "Create Review"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
