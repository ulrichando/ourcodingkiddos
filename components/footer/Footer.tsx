"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Facebook, ArrowUpRight, Mail } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

const footerLinks = {
  learn: {
    title: "Learn",
    links: [
      { label: "Curriculum", href: "/curriculum" },
      { label: "All Courses", href: "/courses" },
      { label: "Programs", href: "/programs" },
      { label: "Playground", href: "/playground" },
      { label: "Placement Exam", href: "/placement-exam" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Student Showcase", href: "/showcase" },
      { label: "Schedule", href: "/schedule" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/our-story" },
      { label: "Contact", href: "/contact" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Class Policies", href: "/policies" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Child Safety", href: "/safety" },
    ],
  },
};

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61578690800757",
    icon: Facebook,
    hoverColor: "hover:text-blue-500",
  },
];

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide footer on dashboard routes (they have their own layout)
  const isDashboard = pathname?.startsWith("/dashboard");
  if (isDashboard) return null;

  return (
    <footer className="relative bg-slate-950 text-slate-400 overflow-hidden" role="contentinfo">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-violet-600/5 blur-3xl" />
        <div className="absolute -bottom-[40%] -left-[20%] w-[60%] h-[60%] rounded-full bg-purple-600/5 blur-3xl" />
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4 text-center lg:text-left">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  Stay in the loop
                </h3>
                <p className="text-slate-400 text-sm">
                  Get coding tips, course updates, and special offers delivered weekly
                </p>
              </div>
            </div>
            <div className="w-full lg:w-auto">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-3">
            <Link href="/" className="inline-flex items-center gap-3 group mb-6">
              <Image
                src="/icon.svg"
                alt="Coding Kiddos Logo"
                width={48}
                height={48}
                className="rounded-xl shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow"
              />
              <span className="text-xl font-bold text-white">
                Coding Kiddos
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-xs">
              Empowering young minds with coding skills through fun, interactive lessons designed for kids ages 7-18.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center transition-all duration-200 hover:scale-110 ${social.hoverColor}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className="col-span-1 md:col-span-2">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} Our Coding Kiddos. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/policies"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Policies
              </Link>
              <span className="text-sm text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>
          {/* Trademark Disclaimer */}
          <p className="text-xs text-slate-600 text-center mt-4 max-w-3xl mx-auto">
            All third-party company names, logos, and trademarks referenced on this site are for illustrative purposes only and remain the property of their respective owners. We are not affiliated with or endorsed by these companies.
          </p>
        </div>
      </div>
    </footer>
  );
}
