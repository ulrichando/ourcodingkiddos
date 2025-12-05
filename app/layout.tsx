import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppHeader from "../components/navigation/AppHeader";
import AuthProvider from "../components/providers/AuthProvider";
import ThemeHydrator from "../components/providers/ThemeHydrator";
import { ErrorBoundary } from "../components/ErrorBoundary";
import StructuredData from "../components/seo/StructuredData";
import LazyComponents from "../components/providers/LazyComponents";
import NewsletterForm from "../components/footer/NewsletterForm";

// Optimize font loading - prevents layout shift
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Our Coding Kiddos - Learn to Code",
    template: "%s | Our Coding Kiddos"
  },
  description: "Empowering young minds with coding skills. Interactive online coding classes for kids in HTML, CSS, JavaScript, Python, and Roblox.",
  keywords: ["coding for kids", "programming classes", "learn to code", "kids coding", "online coding courses", "HTML for kids", "Python for kids", "JavaScript for kids"],
  authors: [{ name: "Our Coding Kiddos" }],
  creator: "Our Coding Kiddos",
  publisher: "Our Coding Kiddos",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" }
    ]
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Our Coding Kiddos"
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Our Coding Kiddos",
    title: "Our Coding Kiddos - Learn to Code",
    description: "Empowering young minds with coding skills. Interactive online coding classes for kids.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Coding Kiddos - Learn to Code",
    description: "Empowering young minds with coding skills. Interactive online coding classes for kids.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-[#050812]`} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem("ok-theme");
                  const theme = stored || "light";
                  document.documentElement.classList.toggle("dark", theme === "dark");
                  document.documentElement.setAttribute("data-theme", theme);
                  if (!stored) localStorage.setItem("ok-theme", theme);
                } catch (_) {}
              })();
            `,
          }}
        />
        <StructuredData />
        <AuthProvider>
          <ThemeHydrator />
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col">
              <AppHeader />
              <main className="flex-1" role="main">{children}</main>
            <footer className="site-footer bg-slate-900 text-slate-300" role="contentinfo">
              {/* Newsletter */}
              <div className="border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">Subscribe to our newsletter</p>
                        <p className="text-sm text-slate-400">Weekly coding tips & updates</p>
                      </div>
                    </div>
                    <NewsletterForm />
                  </div>
                </div>
              </div>

              {/* Main Footer */}
              <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">
                  {/* Brand */}
                  <div className="col-span-2 md:col-span-4 lg:col-span-3">
                    <a href="/" className="inline-flex items-center gap-3 mb-4">
                      <span className="h-11 w-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/25">
                        CK
                      </span>
                      <span className="text-xl font-bold text-white">Coding Kiddos</span>
                    </a>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                      Empowering young minds with coding skills through fun, interactive lessons designed for kids ages 7-18.
                    </p>
                    <div className="flex gap-3">
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-purple-600 flex items-center justify-center transition-all hover:scale-110">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all hover:scale-110">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      </a>
                    </div>
                  </div>

                  {/* Courses */}
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="text-white font-semibold mb-4">Courses</h4>
                    <ul className="space-y-3 text-sm">
                      <li><a href="/courses?language=html" className="text-slate-400 hover:text-white transition-colors">HTML & CSS</a></li>
                      <li><a href="/courses?language=javascript" className="text-slate-400 hover:text-white transition-colors">JavaScript</a></li>
                      <li><a href="/courses?language=python" className="text-slate-400 hover:text-white transition-colors">Python</a></li>
                      <li><a href="/courses?language=roblox" className="text-slate-400 hover:text-white transition-colors">Roblox Studio</a></li>
                    </ul>
                  </div>

                  {/* Resources */}
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="text-white font-semibold mb-4">Resources</h4>
                    <ul className="space-y-3 text-sm">
                      <li><a href="/programs" className="text-slate-400 hover:text-white transition-colors">Learning Programs</a></li>
                      <li><a href="/courses" className="text-slate-400 hover:text-white transition-colors">All Courses</a></li>
                      <li><a href="/playground" className="text-slate-400 hover:text-white transition-colors">Code Playground</a></li>
                      <li><a href="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                      <li><a href="/showcase" className="text-slate-400 hover:text-white transition-colors">Student Showcase</a></li>
                    </ul>
                  </div>

                  {/* Company */}
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="text-white font-semibold mb-4">Company</h4>
                    <ul className="space-y-3 text-sm">
                      <li><a href="/about" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
                      <li><a href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
                      <li><a href="/faq" className="text-slate-400 hover:text-white transition-colors">FAQ</a></li>
                    </ul>
                  </div>

                  {/* Legal */}
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="text-white font-semibold mb-4">Legal</h4>
                    <ul className="space-y-3 text-sm">
                      <li><a href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                      <li><a href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
                      <li><a href="/cookies" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</a></li>
                      <li><a href="/refund-policy" className="text-slate-400 hover:text-white transition-colors">Refund Policy</a></li>
                      <li><a href="/acceptable-use" className="text-slate-400 hover:text-white transition-colors">Acceptable Use</a></li>
                      <li><a href="/safety" className="text-slate-400 hover:text-white transition-colors">Child Safety</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-sm text-slate-500">© {new Date().getFullYear()} Our Coding Kiddos. All rights reserved.</p>
                  <p className="text-sm text-slate-500">Made for young coders everywhere</p>
                </div>
              </div>
            </footer>
            <LazyComponents />
            </div>
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
