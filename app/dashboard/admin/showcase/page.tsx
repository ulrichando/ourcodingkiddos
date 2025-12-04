"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  CheckCircle,
  XCircle,
  Star,
  Search,
  Eye,
  Heart,
  MessageCircle,
  Github,
  ExternalLink,
} from "lucide-react";

interface StudentProject {
  id: string;
  title: string;
  description: string;
  githubUrl: string | null;
  demoUrl: string | null;
  thumbnailUrl: string | null;
  language: string | null;
  isPublished: boolean;
  isApproved: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  studentProfile: {
    id: string;
    name: string | null;
    ageGroup: string | null;
  };
  _count: { comments: number; likes: number };
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

export default function AdminShowcasePage() {
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "featured">("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/showcase?limit=100");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProject(id: string, updates: Partial<StudentProject>) {
    try {
      const res = await fetch(`/api/showcase/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  }

  async function approveProject(project: StudentProject) {
    await updateProject(project.id, { isApproved: true });
  }

  async function rejectProject(project: StudentProject) {
    await updateProject(project.id, { isApproved: false, isPublished: false });
  }

  async function toggleFeatured(project: StudentProject) {
    await updateProject(project.id, { isFeatured: !project.isFeatured });
  }

  const filteredProjects = projects
    .filter((p) => {
      if (filter === "pending") return p.isPublished && !p.isApproved;
      if (filter === "approved") return p.isApproved;
      if (filter === "featured") return p.isFeatured;
      return true;
    })
    .filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.studentProfile.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const pendingCount = projects.filter((p) => p.isPublished && !p.isApproved).length;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Student Showcase
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Review and approve student projects for public showcase
            </p>
          </div>
          {pendingCount > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 font-semibold">
              {pendingCount} pending approval
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "approved", "featured"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === f
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === "pending" && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-yellow-500 text-yellow-900">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">
              {filter === "pending"
                ? "No projects pending approval"
                : "No projects found"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`bg-white dark:bg-slate-800 rounded-xl border overflow-hidden ${
                  !project.isApproved && project.isPublished
                    ? "border-yellow-400 dark:border-yellow-600"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative h-40 bg-gradient-to-br from-purple-500 to-pink-500">
                  {project.thumbnailUrl ? (
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50">
                      No Image
                    </div>
                  )}
                  {project.isFeatured && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        project.isApproved
                          ? "bg-green-500 text-white"
                          : project.isPublished
                          ? "bg-yellow-500 text-yellow-900"
                          : "bg-slate-500 text-white"
                      }`}
                    >
                      {project.isApproved
                        ? "Approved"
                        : project.isPublished
                        ? "Pending"
                        : "Draft"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Creator */}
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-xs">
                      {project.studentProfile.name?.charAt(0) || "S"}
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">
                      {project.studentProfile.name || "Student"}
                    </span>
                    {project.studentProfile.ageGroup && (
                      <span className="text-slate-500">
                        ({ageGroupLabels[project.studentProfile.ageGroup]})
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {project.language && (
                      <span>{languageLabels[project.language] || project.language}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {project.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {project._count.likes}
                    </span>
                  </div>

                  {/* Links */}
                  <div className="flex gap-2 mb-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Demo
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!project.isApproved && project.isPublished && (
                      <button
                        onClick={() => approveProject(project)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-semibold hover:bg-green-200 dark:hover:bg-green-900/50 transition"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                    )}
                    {project.isApproved && (
                      <button
                        onClick={() => rejectProject(project)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition"
                      >
                        <XCircle className="w-4 h-4" />
                        Unapprove
                      </button>
                    )}
                    <button
                      onClick={() => toggleFeatured(project)}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold transition ${
                        project.isFeatured
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${project.isFeatured ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
