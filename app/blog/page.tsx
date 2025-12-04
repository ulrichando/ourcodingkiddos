import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Calendar, Eye, MessageCircle, Heart, BookOpen, Star } from "lucide-react";

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

const categoryLabels: Record<string, { label: string; color: string }> = {
  NEWS: { label: "News", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  TUTORIAL: { label: "Tutorial", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  STUDENT_SPOTLIGHT: { label: "Student Spotlight", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  PARENT_RESOURCES: { label: "Parent Resources", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
  CODING_TIPS: { label: "Coding Tips", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300" },
  EVENTS: { label: "Events", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300" },
  ANNOUNCEMENTS: { label: "Announcements", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" },
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
    <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 text-center bg-gradient-to-b from-purple-50 via-white to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-900">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">
            Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Coding tips, tutorials, student success stories, and the latest news from Our Coding Kiddos.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 px-4 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3">
          <Link
            href="/blog"
            className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
          >
            All Posts
          </Link>
          {Object.entries(categoryLabels).map(([key, { label, color }]) => (
            <Link
              key={key}
              href={`/blog?category=${key}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${color} hover:opacity-80 transition`}
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Featured Posts
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post) => (
                <FeaturedPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-12 px-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Latest Posts</h2>
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                No blog posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
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
}

function PostCard({ post }: PostCardProps) {
  const categoryInfo = categoryLabels[post.category] || categoryLabels.NEWS;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-white/50" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryInfo.color}`}>
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

        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(post.publishedAt)}
          </div>
          <div className="flex items-center gap-3">
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
        </div>
      </div>
    </Link>
  );
}

function FeaturedPostCard({ post }: PostCardProps) {
  const categoryInfo = categoryLabels[post.category] || categoryLabels.NEWS;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border-2 border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="md:flex">
        {/* Thumbnail */}
        <div className="relative md:w-2/5 h-48 md:h-auto bg-gradient-to-br from-purple-500 to-pink-500">
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white/50" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="md:w-3/5 p-6">
          <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-3 ${categoryInfo.color}`}>
            {categoryInfo.label}
          </span>
          <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>{post.authorName || "Admin"}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.viewCount}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {post._count.likes}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
