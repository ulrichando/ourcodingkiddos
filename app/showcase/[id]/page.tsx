"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  Heart,
  MessageCircle,
  ArrowLeft,
  Share2,
  Github,
  ExternalLink,
  Code2,
  User,
  Award,
} from "lucide-react";

interface StudentProject {
  id: string;
  title: string;
  description: string;
  githubUrl: string | null;
  demoUrl: string | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  language: string | null;
  tags: string[];
  viewCount: number;
  createdAt: string;
  studentProfile: {
    id: string;
    name: string | null;
    avatar: string | null;
    ageGroup: string | null;
    currentLevel: number;
  };
  comments: Comment[];
  _count: { likes: number; comments: number };
}

interface Comment {
  id: string;
  content: string;
  authorEmail: string;
  authorName: string | null;
  authorRole: string;
  createdAt: string;
  replies: Comment[];
  _count: { likes: number };
}

const languageLabels: Record<string, string> = {
  HTML: "HTML & CSS",
  JAVASCRIPT: "JavaScript",
  PYTHON: "Python",
  ROBLOX: "Roblox Studio",
  AI_ML: "AI & Machine Learning",
  GAME_DEVELOPMENT: "Game Development",
  WEB_DEVELOPMENT: "Web Development",
};

const ageGroupLabels: Record<string, string> = {
  AGES_7_10: "Ages 7-10",
  AGES_11_14: "Ages 11-14",
  AGES_15_18: "Ages 15-18",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const projectId = params.id as string;

  const [project, setProject] = useState<StudentProject | null>(null);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liking, setLiking] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/showcase/${projectId}`);
        if (!res.ok) {
          throw new Error("Project not found");
        }
        const data = await res.json();
        setProject(data.project);
        setUserHasLiked(data.userHasLiked);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId]);

  const handleLike = async () => {
    if (!session?.user?.email || !project || liking) return;

    setLiking(true);
    try {
      const res = await fetch("/api/likes", {
        method: userHasLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentProjectId: project.id }),
      });

      if (res.ok) {
        setUserHasLiked(!userHasLiked);
        setProject((prev) =>
          prev
            ? {
                ...prev,
                _count: {
                  ...prev._count,
                  likes: prev._count.likes + (userHasLiked ? -1 : 1),
                },
              }
            : prev
        );
      }
    } catch {
      // Ignore errors
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email || !project || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentProjectId: project.id,
          content: newComment.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProject((prev) =>
          prev
            ? {
                ...prev,
                comments: [data.comment, ...prev.comments],
                _count: { ...prev._count, comments: prev._count.comments + 1 },
              }
            : prev
        );
        setNewComment("");
      }
    } catch {
      // Ignore errors
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: project?.title,
        text: `Check out this project by ${project?.studentProfile.name}!`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Code2 className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Project Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <Link
            href="/showcase"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Showcase
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Breadcrumb */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Link
            href="/showcase"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Showcase
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thumbnail / Video */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 aspect-video">
              {project.videoUrl ? (
                <iframe
                  src={project.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : project.thumbnailUrl ? (
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Code2 className="w-24 h-24 text-white/50" />
                </div>
              )}
            </div>

            {/* Title and Meta */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                {project.language && (
                  <span className="text-sm font-semibold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                    {languageLabels[project.language] || project.language}
                  </span>
                )}
                {project.tags && Array.isArray(project.tags) && project.tags.length > 0 && (
                  <div className="flex gap-2">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {project.viewCount} views
                </span>
                <span>
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg">{project.description}</p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-700 text-white font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:brightness-110 transition"
                >
                  <ExternalLink className="w-5 h-5" />
                  View Live Demo
                </a>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 py-6 border-t border-b border-slate-200 dark:border-slate-700">
              <button
                onClick={handleLike}
                disabled={!session || liking}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  userHasLiked
                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-red-100 hover:text-red-600"
                } ${!session ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Heart className={`w-5 h-5 ${userHasLiked ? "fill-current" : ""}`} />
                {project._count.likes} {project._count.likes === 1 ? "Like" : "Likes"}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-purple-100 hover:text-purple-600 transition"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Comments Section */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Comments ({project._count.comments})
              </h2>

              {/* Comment Form */}
              {session ? (
                <form onSubmit={handleComment} className="mb-8">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Leave a comment for this project..."
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={!newComment.trim() || submittingComment}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {submittingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    Sign in to leave a comment
                  </p>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:brightness-110 transition"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {project.comments.length === 0 ? (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                    No comments yet. Be the first to encourage this young coder!
                  </p>
                ) : (
                  project.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {comment.authorName?.charAt(0) || <User className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">
                              {comment.authorName || "Anonymous"}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar - Creator Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
              <h3 className="font-semibold text-lg mb-4">Created By</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                  {project.studentProfile.avatar ? (
                    <img
                      src={project.studentProfile.avatar}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    project.studentProfile.name?.charAt(0) || "S"
                  )}
                </div>
                <div>
                  <div className="font-bold text-lg">
                    {project.studentProfile.name || "Young Coder"}
                  </div>
                  {project.studentProfile.ageGroup && (
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {ageGroupLabels[project.studentProfile.ageGroup]}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span>Level {project.studentProfile.currentLevel} Coder</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <Link
                  href="/programs"
                  className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-center hover:brightness-110 transition"
                >
                  Start Learning to Code
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
