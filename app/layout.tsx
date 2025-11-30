import "./globals.css";
import AppHeader from "../components/navigation/AppHeader";
import ChatBot from "../components/chat/ChatBot";
import AuthProvider from "../components/providers/AuthProvider";
import ThemeHydrator from "../components/providers/ThemeHydrator";
import { ErrorBoundary } from "../components/ErrorBoundary";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-[#050812]" suppressHydrationWarning>
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
        <style>{`
          :root {
            --color-primary: #8B5CF6;
            --color-primary-dark: #7C3AED;
            --color-secondary: #EC4899;
            --color-accent: #F59E0B;
          }
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-track { background: #f1f5f9; }
          ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
          @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .animate-gradient { background-size: 200% 200%; animation: gradient-shift 3s ease infinite; }
        `}</style>

        <AuthProvider>
          <ThemeHydrator />
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col">
              <AppHeader />
              <main className="flex-1">{children}</main>
            <footer className="site-footer bg-slate-900 text-slate-200">
              <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-6">
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
                    <li>
                      <a href="/courses?language=html" className="hover:text-white">HTML & CSS</a>
                    </li>
                    <li>
                      <a href="/courses?language=javascript" className="hover:text-white">JavaScript</a>
                    </li>
                    <li>
                      <a href="/courses?language=python" className="hover:text-white">Python</a>
                    </li>
                    <li>
                      <a href="/courses?language=roblox" className="hover:text-white">Roblox Studio</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Resources</h4>
                  <ul className="text-sm space-y-1 text-slate-400">
                    <li>
                      <a href="/courses" className="hover:text-white">All Courses</a>
                    </li>
                    <li>
                      <a href="/playground" className="hover:text-white">Code Playground</a>
                    </li>
                    <li>
                      <a href="/schedule" className="hover:text-white">Live Classes</a>
                    </li>
                    <li>
                      <a href="/contact" className="hover:text-white">Contact</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Legal</h4>
                  <ul className="text-sm space-y-1 text-slate-400">
                    <li>
                      <a href="/privacy" className="hover:text-white">Privacy Policy</a>
                    </li>
                    <li>
                      <a href="/terms" className="hover:text-white">Terms of Service</a>
                    </li>
                    <li>
                      <a href="/cookies" className="hover:text-white">Cookie Policy</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
                © {new Date().getFullYear()} Our Coding Kiddos. All rights reserved.
              </div>
            </footer>
            <ChatBot />
            </div>
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
