"use client";

import Link from "next/link";
import { Home, Search, BookOpen, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-[150px] sm:text-[200px] font-bold text-slate-200 dark:text-slate-800 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
              <span className="text-4xl sm:text-5xl">🔍</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Page Not Found
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Oops! Looks like this page went on an adventure and got lost. Let&apos;s help you find your way back.
          </p>
        </div>

        {/* Suggested Actions */}
        <div className="grid sm:grid-cols-2 gap-4 max-w-sm mx-auto">
          <Link href="/" className="block">
            <Button className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12">
              <Home className="w-5 h-5" />
              Go Home
            </Button>
          </Link>
          <Link href="/courses" className="block">
            <Button variant="outline" className="w-full inline-flex items-center justify-center gap-2 h-12">
              <BookOpen className="w-5 h-5" />
              Browse Courses
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Popular destinations:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: "HTML Course", href: "/courses?language=html" },
              { label: "Python Course", href: "/courses?language=python" },
              { label: "Playground", href: "/playground" },
              { label: "Pricing", href: "/pricing" },
              { label: "Contact Us", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-sm rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.history.back();
          }}
          className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to previous page
        </Link>
      </div>
    </main>
  );
}
