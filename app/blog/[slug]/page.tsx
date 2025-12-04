"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  ArrowLeft,
  Share2,
  BookOpen,
  User,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  authorEmail: string;
  authorName: string | null;
  category: string;
  tags: string[];
  viewCount: number;
  publishedAt: string | null;
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

const categoryLabels: Record<string, { label: string; color: string }> = {
  NEWS: { label: "News", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  TUTORIAL: { label: "Tutorial", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  STUDENT_SPOTLIGHT: { label: "Student Spotlight", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  PARENT_RESOURCES: { label: "Parent Resources", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
  CODING_TIPS: { label: "Coding Tips", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300" },
  EVENTS: { label: "Events", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300" },
  ANNOUNCEMENTS: { label: "Announcements", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" },
};

function formatDate(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostPage() {
  const params = useParams();
  const { data: session } = useSession();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liking, setLiking] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (!res.ok) {
          throw new Error("Blog post not found");
        }
        const data = await res.json();
        setPost(data.post);
        setUserHasLiked(data.userHasLiked);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  const handleLike = async () => {
    if (!session?.user?.email || !post || liking) return;

    setLiking(true);
    try {
      const res = await fetch("/api/likes", {
        method: userHasLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogPostId: post.id }),
      });

      if (res.ok) {
        setUserHasLiked(!userHasLiked);
        setPost((prev) =>
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
    if (!session?.user?.email || !post || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogPostId: post.id,
          content: newComment.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPost((prev) =>
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
        title: post?.title,
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

  if (error || !post) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Post Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  const categoryInfo = categoryLabels[post.category] || categoryLabels.NEWS;

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Breadcrumb */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="w-full h-64 md:h-96 bg-gradient-to-br from-purple-500 to-pink-500">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${categoryInfo.color}`}>
              {categoryInfo.label}
            </span>
            {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="flex gap-2">
                {post.tags.slice(0, 3).map((tag, i) => (
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                {post.authorName?.charAt(0) || "A"}
              </div>
              <span>{post.authorName || "Admin"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt)}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.viewCount} views
            </div>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-slate dark:prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

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
            {post._count.likes} {post._count.likes === 1 ? "Like" : "Likes"}
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
            Comments ({post._count.comments})
          </h2>

          {/* Comment Form */}
          {session ? (
            <form onSubmit={handleComment} className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
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
            {post.comments.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              post.comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))
            )}
          </div>
        </section>
      </article>
    </main>
  );
}

function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {comment.authorName?.charAt(0) || <User className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {comment.authorName || "Anonymous"}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
            {comment.authorRole === "ADMIN" && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                Admin
              </span>
            )}
          </div>
          <p className="text-slate-700 dark:text-slate-300">{comment.content}</p>
          <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
            <button className="flex items-center gap-1 hover:text-red-500 transition">
              <Heart className="w-4 h-4" />
              {comment._count.likes}
            </button>
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="p-3 rounded-lg bg-white dark:bg-slate-700">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {reply.authorName?.charAt(0) || "?"}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      {reply.authorName || "Anonymous"}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{reply.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
