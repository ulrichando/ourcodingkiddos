"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Search,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";

interface Program {
  id: string;
  title: string;
  slug: string;
  language: string;
  ageGroup: string;
  sessionCount: number;
  priceCents: number;
  isPublished: boolean;
  isFeatured: boolean;
  _count: { enrollments: number };
}

const languageLabels: Record<string, string> = {
  HTML: "HTML & CSS",
  JAVASCRIPT: "JavaScript",
  PYTHON: "Python",
  ROBLOX: "Roblox",
  AI_ML: "AI & ML",
  GAME_DEVELOPMENT: "Game Dev",
  WEB_DEVELOPMENT: "Web Dev",
};

const ageGroupLabels: Record<string, string> = {
  AGES_7_10: "7-10",
  AGES_11_14: "11-14",
  AGES_15_18: "15-18",
};

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    shortDescription: "",
    language: "PYTHON",
    ageGroup: "AGES_11_14",
    level: "BEGINNER",
    sessionCount: 12,
    sessionDuration: 60,
    priceCents: 34900,
    originalPriceCents: 0,
    features: [] as string[],
    startDate: "",
    endDate: "",
    isPublished: false,
    isFeatured: false,
  });
  const [newFeature, setNewFeature] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  async function fetchPrograms() {
    try {
      const res = await fetch("/api/programs");
      if (res.ok) {
        const data = await res.json();
        setPrograms(data.programs || []);
      }
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = editingProgram ? `/api/programs/${editingProgram.id}` : "/api/programs";
      const method = editingProgram ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingProgram(null);
        resetForm();
        fetchPrograms();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save program");
      }
    } catch (error) {
      console.error("Failed to save program:", error);
      alert("Failed to save program");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this program?")) return;

    try {
      const res = await fetch(`/api/programs/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPrograms();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete program");
      }
    } catch (error) {
      console.error("Failed to delete program:", error);
    }
  }

  async function togglePublish(program: Program) {
    try {
      const res = await fetch(`/api/programs/${program.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !program.isPublished }),
      });
      if (res.ok) {
        fetchPrograms();
      }
    } catch (error) {
      console.error("Failed to toggle publish:", error);
    }
  }

  async function toggleFeatured(program: Program) {
    try {
      const res = await fetch(`/api/programs/${program.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !program.isFeatured }),
      });
      if (res.ok) {
        fetchPrograms();
      }
    } catch (error) {
      console.error("Failed to toggle featured:", error);
    }
  }

  function resetForm() {
    setFormData({
      title: "",
      slug: "",
      description: "",
      shortDescription: "",
      language: "PYTHON",
      ageGroup: "AGES_11_14",
      level: "BEGINNER",
      sessionCount: 12,
      sessionDuration: 60,
      priceCents: 34900,
      originalPriceCents: 0,
      features: [],
      startDate: "",
      endDate: "",
      isPublished: false,
      isFeatured: false,
    });
    setNewFeature("");
  }

  function openEditModal(program: Program) {
    setEditingProgram(program);
    // Fetch full program details
    fetch(`/api/programs/${program.id}`)
      .then((res) => res.json())
      .then((data) => {
        const p = data.program;
        setFormData({
          title: p.title,
          slug: p.slug,
          description: p.description,
          shortDescription: p.shortDescription || "",
          language: p.language,
          ageGroup: p.ageGroup,
          level: p.level,
          sessionCount: p.sessionCount,
          sessionDuration: p.sessionDuration,
          priceCents: p.priceCents,
          originalPriceCents: p.originalPriceCents || 0,
          features: p.features || [],
          startDate: p.startDate ? new Date(p.startDate).toISOString().split("T")[0] : "",
          endDate: p.endDate ? new Date(p.endDate).toISOString().split("T")[0] : "",
          isPublished: p.isPublished,
          isFeatured: p.isFeatured,
        });
        setShowModal(true);
      });
  }

  function addFeature() {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  }

  function removeFeature(index: number) {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  }

  const filteredPrograms = programs.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Programs</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage learning programs and enrollments
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingProgram(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:brightness-110 transition"
          >
            <Plus className="w-5 h-5" />
            New Program
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
        </div>

        {/* Programs Table */}
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
                    Program
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Sessions
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Enrollments
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
                {filteredPrograms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      No programs found. Create your first program!
                    </td>
                  </tr>
                ) : (
                  filteredPrograms.map((program) => (
                    <tr key={program.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {program.isFeatured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {program.title}
                            </div>
                            <div className="text-sm text-slate-500">
                              {languageLabels[program.language]} &bull;{" "}
                              {ageGroupLabels[program.ageGroup]}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          <Clock className="w-4 h-4" />
                          {program.sessionCount}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
                          <DollarSign className="w-4 h-4" />
                          {(program.priceCents / 100).toFixed(0)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          <Users className="w-4 h-4" />
                          {program._count.enrollments}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            program.isPublished
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {program.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleFeatured(program)}
                            className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${
                              program.isFeatured ? "text-yellow-500" : "text-slate-400"
                            }`}
                            title={program.isFeatured ? "Remove featured" : "Make featured"}
                          >
                            <Star className={`w-4 h-4 ${program.isFeatured ? "fill-current" : ""}`} />
                          </button>
                          <button
                            onClick={() => togglePublish(program)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                            title={program.isPublished ? "Unpublish" : "Publish"}
                          >
                            {program.isPublished ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => openEditModal(program)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(program.id)}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
                            title="Delete"
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

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {editingProgram ? "Edit Program" : "Create New Program"}
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Language</label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      <option value="PYTHON">Python</option>
                      <option value="JAVASCRIPT">JavaScript</option>
                      <option value="HTML">HTML & CSS</option>
                      <option value="ROBLOX">Roblox</option>
                      <option value="AI_ML">AI & ML</option>
                      <option value="GAME_DEVELOPMENT">Game Development</option>
                      <option value="WEB_DEVELOPMENT">Web Development</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Age Group</label>
                    <select
                      value={formData.ageGroup}
                      onChange={(e) => setFormData((prev) => ({ ...prev, ageGroup: e.target.value }))}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      <option value="AGES_7_10">Ages 7-10</option>
                      <option value="AGES_11_14">Ages 11-14</option>
                      <option value="AGES_15_18">Ages 15-18</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sessions</label>
                    <input
                      type="number"
                      value={formData.sessionCount}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, sessionCount: parseInt(e.target.value) }))
                      }
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (min)</label>
                    <input
                      type="number"
                      value={formData.sessionDuration}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, sessionDuration: parseInt(e.target.value) }))
                      }
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                    <input
                      type="number"
                      value={formData.priceCents / 100}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, priceCents: parseFloat(e.target.value) * 100 }))
                      }
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Original Price ($)</label>
                    <input
                      type="number"
                      value={formData.originalPriceCents / 100}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          originalPriceCents: parseFloat(e.target.value) * 100,
                        }))
                      }
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                {/* Program Dates */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                      }
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                      }
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Features</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature..."
                      className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-sm"
                      >
                        {feature}
                        <button onClick={() => removeFeature(i)} className="text-red-500">
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
                  {saving ? "Saving..." : editingProgram ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
