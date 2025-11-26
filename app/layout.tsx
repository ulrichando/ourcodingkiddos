import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import ChatWidget from "../components/chat/ChatWidget";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900" suppressHydrationWarning>
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
              <Link href="/" className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                  CK
                </span>
                <span className="text-lg font-semibold text-slate-800">Coding Kiddos</span>
              </Link>
              <nav className="flex items-center gap-5 text-sm font-semibold text-slate-700">
                <Link href="/dashboard/parent" className="hover:text-slate-900">
                  Dashboard
                </Link>
                <Link href="/courses/intro" className="hover:text-slate-900">
                  Courses
                </Link>
                <Link href="/schedule" className="hover:text-slate-900">
                  Schedule
                </Link>
                <Link href="/dashboard/parent" className="hover:text-slate-900">
                  Messages
                </Link>
              </nav>
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-2 shadow-md hover:brightness-105"
                >
                  Go to Dashboard →
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="bg-slate-900 text-slate-200">
            <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2">
                  <span className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    CK
                  </span>
                  <div className="text-lg font-semibold">Coding Kiddos</div>
                </div>
                <p className="text-sm text-slate-400">Empowering the next generation of coders, one lesson at a time.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Courses</h4>
                <ul className="text-sm space-y-1 text-slate-400">
                  <li>HTML & CSS</li>
                  <li>JavaScript</li>
                  <li>Python</li>
                  <li>Roblox Studio</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Company</h4>
                <ul className="text-sm space-y-1 text-slate-400">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Blog</li>
                  <li>Contact</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Legal</h4>
                <ul className="text-sm space-y-1 text-slate-400">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Cookie Policy</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} Our Coding Kiddos. All rights reserved.
            </div>
          </footer>
          <ChatWidget />
        </div>
      </body>
    </html>
  );
}
