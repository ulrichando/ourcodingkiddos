"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Search,
  Calendar,
  MessageCircle,
  Heart,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  authorName: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  _count: { comments: number; likes: number };
}

const categoryLabels: Record<string, string> = {
  NEWS: "News",
  TUTORIAL: "Tutorial",
  STUDENT_SPOTLIGHT: "Student Spotlight",
  PARENT_RESOURCES: "Parent Resources",
  CODING_TIPS: "Coding Tips",
  EVENTS: "Events",
  ANNOUNCEMENTS: "Announcements",
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    category: "NEWS",
    tags: [] as string[],
    isPublished: false,
    isFeatured: false,
  });
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = editingPost ? `/api/blog/${editingPost.id}` : "/api/blog";
      const method = editingPost ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingPost(null);
        resetForm();
        fetchPosts();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save post");
      }
    } catch (error) {
      console.error("Failed to save post:", error);
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPosts();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  }

  async function togglePublish(post: BlogPost) {
    try {
      const res = await fetch(`/api/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !post.isPublished }),
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Failed to toggle publish:", error);
    }
  }

  async function toggleFeatured(post: BlogPost) {
    try {
      const res = await fetch(`/api/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !post.isFeatured }),
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Failed to toggle featured:", error);
    }
  }

  function resetForm() {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      category: "NEWS",
      tags: [],
      isPublished: false,
      isFeatured: false,
    });
    setNewTag("");
  }

  function openEditModal(post: BlogPost) {
    setEditingPost(post);
    fetch(`/api/blog/${post.id}`)
      .then((res) => res.json())
      .then((data) => {
        const p = data.post;
        setFormData({
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt || "",
          content: p.content,
          featuredImage: p.featuredImage || "",
          category: p.category,
          tags: p.tags || [],
          isPublished: p.isPublished,
          isFeatured: p.isFeatured,
        });
        setShowModal(true);
      });
  }

  function addTag() {
    if (newTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  }

  function removeTag(index: number) {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  }

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin / Blog</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Blog Management</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manage blog posts and articles
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingPost(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:brightness-110 transition"
          >
            <Plus className="w-5 h-5" />
            New Post
          </button>
        </div>

        {/* Search */}
        <div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
        </div>

        {/* Posts Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Post
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Engagement
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                      No blog posts found. Create your first post!
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {post.isFeatured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {post.title}
                            </div>
                            <div className="text-sm text-slate-500">
                              {post.authorName} &bull;{" "}
                              {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString()
                                : "Draft"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          {categoryLabels[post.category] || post.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.viewCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post._count.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post._count.comments}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            post.isPublished
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {post.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleFeatured(post)}
                            className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${
                              post.isFeatured ? "text-yellow-500" : "text-slate-400"
                            }`}
                          >
                            <Star className={`w-4 h-4 ${post.isFeatured ? "fill-current" : ""}`} />
                          </button>
                          <button
                            onClick={() => togglePublish(post)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                          >
                            {post.isPublished ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => openEditModal(post)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {editingPost ? "Edit Blog Post" : "Create New Post"}
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, ""),
                        }));
                      }}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                    rows={2}
                    placeholder="Short description for cards..."
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content (HTML/Markdown)</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                    rows={10}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Featured Image URL</label>
                  <input
                    type="text"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))}
                    placeholder="https://..."
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-sm"
                      >
                        #{tag}
                        <button onClick={() => removeTag(i)} className="text-red-500">
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Published</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingPost ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
