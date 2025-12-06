import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  Calendar,
  Eye,
  MessageCircle,
  Heart,
  BookOpen,
  Star,
  ArrowRight,
  Sparkles,
  User,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - Coding Tips, News & Student Spotlights",
  description: "Read the latest coding tips, tutorials, student success stories, and news from Our Coding Kiddos. Learn from expert instructors and get inspired by young coders.",
  keywords: ["coding blog", "kids coding tips", "programming tutorials", "student spotlight", "coding news"],
  openGraph: {
    title: "Blog - Our Coding Kiddos",
    description: "Coding tips, tutorials, and inspiring stories from young coders.",
    url: "https://ourcodingkiddos.com/blog",
    type: "website",
  },
};

const categoryLabels: Record<string, { label: string; color: string; border: string }> = {
  NEWS: {
    label: "News",
    color: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
  },
  TUTORIAL: {
    label: "Tutorial",
    color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  STUDENT_SPOTLIGHT: {
    label: "Student Spotlight",
    color: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
  },
  PARENT_RESOURCES: {
    label: "Parent Resources",
    color: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
  },
  CODING_TIPS: {
    label: "Coding Tips",
    color: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    border: "border-cyan-200 dark:border-cyan-800",
  },
  EVENTS: {
    label: "Events",
    color: "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
    border: "border-pink-200 dark:border-pink-800",
  },
  ANNOUNCEMENTS: {
    label: "Announcements",
    color: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
  },
};

function formatDate(date: Date | string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function getBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      authorName: true,
      category: true,
      tags: true,
      isFeatured: true,
      viewCount: true,
      publishedAt: true,
      _count: {
        select: { comments: true, likes: true },
      },
    },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
  });
  return posts;
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  const featuredPosts = posts.filter((p) => p.isFeatured);
  const regularPosts = posts.filter((p) => !p.isFeatured);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-slate-50 to-slate-50 dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-200/40 dark:bg-pink-900/20 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto relative text-center space-y-6">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 px-4 py-1.5 rounded-full text-xs font-semibold border border-purple-200 dark:border-purple-800">
              <Sparkles className="w-3.5 h-3.5" />
              Stories & Insights
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 animate-fade-in-up">
            Our <span className="text-gradient">Blog</span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Coding tips, tutorials, student success stories, and the latest news from Our Coding Kiddos.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 px-4 bg-white dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-600 text-white shadow-md shadow-purple-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30"
            >
              All Posts
            </Link>
            {Object.entries(categoryLabels).map(([key, { label, color, border }], index) => (
              <Link
                key={key}
                href={`/blog?category=${key}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${color} border ${border} hover:shadow-md transition-all duration-200 animate-fade-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400 fill-yellow-500" />
              </div>
              Featured Posts
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <FeaturedPostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 px-4 bg-white dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Latest Posts</h2>
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/50 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Coming Soon</h3>
              <p className="text-slate-500 dark:text-slate-400">
                No blog posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Stay Updated with Our Latest Posts
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Subscribe to our newsletter for coding tips, success stories, and exclusive content.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-purple-600 font-semibold px-8 py-4 rounded-xl hover:bg-slate-100 transition-all duration-200 shadow-lg shadow-purple-900/30 hover:shadow-xl hover:shadow-purple-900/40 active:scale-95 group"
              >
                Subscribe Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImage: string | null;
    authorName: string | null;
    category: string;
    viewCount: number;
    publishedAt: Date | null;
    _count: { comments: number; likes: number };
  };
  index?: number;
}

function PostCard({ post, index = 0 }: PostCardProps) {
  const categoryInfo = categoryLabels[post.category] || categoryLabels.NEWS;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1 hover:border-purple-300 dark:hover:border-purple-600 animate-fade-in-up"
      style={{ animationDelay: `${index * 75}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-white/30" />
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryInfo.color} border ${categoryInfo.border}`}>
            {categoryInfo.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            {formatDate(post.publishedAt)}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="tabular-nums">{post.viewCount}</span>
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span className="tabular-nums">{post._count.likes}</span>
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span className="tabular-nums">{post._count.comments}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeaturedPostCard({ post, index = 0 }: PostCardProps) {
  const categoryInfo = categoryLabels[post.category] || categoryLabels.NEWS;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border-2 border-purple-300 dark:border-purple-700/50 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm shadow-lg transition-all duration-500 hover:shadow-xl hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 hover:-translate-y-1 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="md:flex">
        {/* Thumbnail */}
        <div className="relative md:w-2/5 h-48 md:h-auto min-h-[200px] bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden">
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white/30" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
              <Star className="w-3.5 h-3.5 fill-yellow-900" />
              Featured
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="md:w-3/5 p-6">
          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${categoryInfo.color} border ${categoryInfo.border}`}>
            {categoryInfo.label}
          </span>
          <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span>{post.authorName || "Admin"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="tabular-nums">{post.viewCount}</span>
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span className="tabular-nums">{post._count.likes}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
