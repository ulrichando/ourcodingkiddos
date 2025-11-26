import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900" suppressHydrationWarning>
        <div className="min-h-screen flex flex-col">
          <header className="glass-panel sticky top-0 z-20">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <span className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-400 via-emerald-400 to-amber-300 flex items-center justify-center text-xl shadow-lg">
                  🚀
                </span>
                <div>
                  <div className="logo text-lg">Our Coding Kiddos</div>
                  <p className="text-xs text-slate-500 -mt-1">Playful coding adventures</p>
                </div>
              </Link>
              <nav className="flex items-center gap-4 text-sm font-semibold text-slate-700">
                <Link href="/courses/intro" className="hover:text-slate-900">
                  Courses
                </Link>
                <Link href="/schedule" className="hover:text-slate-900">
                  Schedule
                </Link>
                <Link href="/dashboard/student" className="hover:text-slate-900">
                  Student
                </Link>
                <Link href="/dashboard/parent" className="hover:text-slate-900">
                  Parent
                </Link>
                <Link href="/dashboard/instructor" className="hover:text-slate-900">
                  Instructor
                </Link>
                <Link
                  href="/auth/login"
                  className="px-3 py-2 rounded-full bg-sky-500 text-white shadow hover:bg-sky-600"
                >
                  Login
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="glass-panel mt-10">
            <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-4 md:items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-300 to-sky-400 flex items-center justify-center text-lg shadow">
                  🌈
                </span>
                <div>
                  <div className="logo text-base">Our Coding Kiddos</div>
                  <p>Colorful coding journeys for ages 7–18.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Link href="/courses/intro" className="hover:text-slate-900">
                  Courses
                </Link>
                <Link href="/schedule" className="hover:text-slate-900">
                  Schedule
                </Link>
                <Link href="/auth/register" className="hover:text-slate-900">
                  Sign up
                </Link>
              </div>
              <p className="text-xs text-slate-500">© {new Date().getFullYear()} Our Coding Kiddos</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
