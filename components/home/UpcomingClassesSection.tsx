"use client";

import Link from "next/link";
import { ArrowRight, Code, Gamepad2 } from "lucide-react";

export default function UpcomingClassesSection() {
  return (
    <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-6xl lg:max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            Live Classes
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Weekly Program Schedule
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Join our weekly coding classes every Saturday and Sunday
          </p>
        </div>

        {/* Two Program Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Saturday - JavaScript Game Development */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-xl transition">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-600" />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                      Every Saturday
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                    JavaScript Game Development
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    Learn to build interactive games using JavaScript. Perfect for kids who love gaming and want to create their own!
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">9:00 AM - 11:00 AM</span>
                    <span>•</span>
                    <span>2 hours</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:underline"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Sunday - Intro to Programming */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-xl transition">
            <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-600" />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                  <Code className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400">
                      Every Sunday
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                    Intro to Programming
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    Start your coding journey with the fundamentals. Great for beginners who are new to programming!
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">9:00 AM - 11:00 AM</span>
                    <span>•</span>
                    <span>2 hours</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 font-semibold hover:underline"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Browse All Programs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
