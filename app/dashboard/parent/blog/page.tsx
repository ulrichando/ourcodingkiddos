"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ParentLayout from "@/components/parent/ParentLayout";
import { Newspaper, Calendar, Clock, ChevronRight, Loader2, Search, Tag } from "lucide-react";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  imageUrl: string | null;
  category: string | null;
  publishedAt: string | null;
  createdAt: string;
  author?: {
    name: string;
  };
  readTime?: number;
};

export default function ParentBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error("Failed to load blog posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const categories = ["all", ...Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c))))];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || post.category === category;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <ParentLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Blog</h1>
          <p className="text-slate-600 dark:text-slate-400">News, tips, and updates from Our Coding Kiddos</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
          </div>
          {categories.length > 1 && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm capitalize"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <Newspaper className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No Articles Found</h3>
            <p className="text-slate-500 dark:text-slate-400">Check back soon for new articles.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Featured Post */}
            {filteredPosts[0] && (
              <Link
                href={`/blog/${filteredPosts[0].slug}`}
                className="block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="md:flex">
                  <div className="md:w-2/5 aspect-video md:aspect-auto bg-slate-100 dark:bg-slate-700">
                    {filteredPosts[0].imageUrl ? (
                      <img
                        src={filteredPosts[0].imageUrl}
                        alt={filteredPosts[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[200px] flex items-center justify-center">
                        <Newspaper className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                      </div>
                    )}
                  </div>
                  <div className="md:w-3/5 p-6">
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                      {filteredPosts[0].category && (
                        <span className="flex items-center gap-1 text-violet-600 dark:text-violet-400">
                          <Tag className="w-3.5 h-3.5" />
                          {filteredPosts[0].category}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(filteredPosts[0].publishedAt || filteredPosts[0].createdAt)}
                      </span>
                      {filteredPosts[0].readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {filteredPosts[0].readTime} min read
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {filteredPosts[0].title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 line-clamp-3 mb-4">
                      {filteredPosts[0].excerpt || "Read more about this article..."}
                    </p>
                    <span className="text-sm font-medium text-violet-600 dark:text-violet-400 flex items-center">
                      Read More
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Other Posts Grid */}
            {filteredPosts.length > 1 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPosts.slice(1).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="aspect-video bg-slate-100 dark:bg-slate-700">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                        {post.category && (
                          <span className="text-violet-600 dark:text-violet-400">{post.category}</span>
                        )}
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {post.excerpt || "Read more..."}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
