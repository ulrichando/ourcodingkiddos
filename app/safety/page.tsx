"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Shield,
  Users,
  Lock,
  Eye,
  Heart,
  CheckCircle,
  AlertTriangle,
  Mail,
  BadgeCheck,
  UserCheck,
  MessageCircle,
  Monitor,
  FileText,
} from "lucide-react";
import { emails } from "@/lib/emails";

export default function SafetyPage() {
  const lastUpdated = "December 2024";

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md p-8 space-y-8 leading-relaxed">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Child Safety & COPPA
                </h1>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Keeping Our Young Coders Safe
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Introduction */}
          <section className="space-y-3">
            <p className="text-slate-700 dark:text-slate-300">
              At Our Coding Kiddos, the safety and well-being of children is our highest priority.
              We are committed to creating a secure online learning environment where kids can explore
              coding without worry. This page explains our safety measures and how we comply with the
              Children&apos;s Online Privacy Protection Act (COPPA).
            </p>
          </section>

          {/* COPPA Compliance */}
          <section className="space-y-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                COPPA Compliance
              </h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              The Children&apos;s Online Privacy Protection Act (COPPA) is a U.S. federal law that
              protects the privacy of children under 13. We fully comply with COPPA and similar
              international regulations to protect young users.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Verifiable parental consent required for children under 13
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Limited data collection - only what&apos;s necessary for education
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  No targeted advertising to children
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Parents can review and delete their child&apos;s data
                </span>
              </div>
            </div>
          </section>

          {/* What We Collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Information We Collect from Children
              </h2>
            </div>

            <p className="text-slate-700 dark:text-slate-300">
              We collect only the minimum information necessary to provide our educational services:
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  What We Collect
                </h3>
                <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  <li>- First name (or nickname)</li>
                  <li>- Age range (for appropriate content)</li>
                  <li>- Learning progress and achievements</li>
                  <li>- Code projects created on our platform</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  What We DO NOT Collect from Children
                </h3>
                <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  <li>- Email addresses (parent email used instead)</li>
                  <li>- Phone numbers</li>
                  <li>- Physical addresses</li>
                  <li>- Social media accounts</li>
                  <li>- Photos (unless avatar selected from our library)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Parental Consent */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Parental Consent Process
              </h2>
            </div>

            <p className="text-slate-700 dark:text-slate-300">
              Before any child under 13 can use our platform, we require verifiable parental consent:
            </p>

            <ol className="list-decimal pl-5 space-y-3 text-slate-700 dark:text-slate-300">
              <li>
                <strong>Parent Account Creation:</strong> Only adults (18+) can create a parent
                account on Our Coding Kiddos.
              </li>
              <li>
                <strong>Student Profile Setup:</strong> Parents create student profiles for their
                children, providing their own email as the contact.
              </li>
              <li>
                <strong>Consent Agreement:</strong> Parents must agree to our Terms of Service and
                Privacy Policy, acknowledging they consent to the collection of their child&apos;s
                information.
              </li>
              <li>
                <strong>Email Verification:</strong> We verify the parent&apos;s email address to
                ensure authenticity.
              </li>
            </ol>
          </section>

          {/* Parental Rights */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Parental Rights
              </h2>
            </div>

            <p className="text-slate-700 dark:text-slate-300">
              Parents have full control over their child&apos;s data and account:
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Review Information
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  View all data collected about your child at any time through your dashboard
                </p>
              </div>

              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Modify or Delete
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Request changes to or complete deletion of your child&apos;s data
                </p>
              </div>

              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Withdraw Consent
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Revoke consent and disable your child&apos;s account at any time
                </p>
              </div>

              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <Monitor className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Monitor Activity
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  View your child&apos;s progress, classes attended, and projects created
                </p>
              </div>
            </div>

            <p className="text-slate-700 dark:text-slate-300">
              To exercise any of these rights, contact us at{" "}
              <a
                href={`mailto:${emails.safety}`}
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                {emails.safety}
              </a>
            </p>
          </section>

          {/* Safety Measures */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Our Safety Measures
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Vetted Instructors
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>All instructors undergo background checks</li>
                  <li>Training in child safety and appropriate interactions</li>
                  <li>Continuous monitoring and performance reviews</li>
                  <li>Clear protocols for reporting concerns</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Secure Platform
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>End-to-end encryption for all communications</li>
                  <li>Secure video conferencing with restricted access</li>
                  <li>No public chat rooms or forums accessible to children</li>
                  <li>Monitored class sessions for safety</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Content Moderation
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>Age-appropriate content only</li>
                  <li>No user-to-user direct messaging for students</li>
                  <li>All shared projects reviewed before public display</li>
                  <li>Automated filters for inappropriate content</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Instructor Guidelines */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Instructor Code of Conduct
              </h2>
            </div>

            <p className="text-slate-700 dark:text-slate-300">
              Our instructors are trained to maintain professional, safe interactions with students:
            </p>

            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li>Never request personal information from students</li>
              <li>Never communicate with students outside the platform</li>
              <li>Never share personal social media or contact information</li>
              <li>Always maintain professional boundaries</li>
              <li>Report any concerning behavior immediately</li>
              <li>Encourage parents to participate and observe classes</li>
            </ul>
          </section>

          {/* Reporting */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Reporting Safety Concerns
              </h2>
            </div>

            <p className="text-slate-700 dark:text-slate-300">
              If you have any safety concerns about your child or any student on our platform,
              please contact us immediately:
            </p>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Safety Team</p>
                  <a
                    href={`mailto:${emails.safety}`}
                    className="text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    {emails.safety}
                  </a>
                </div>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                All reports are taken seriously and investigated within 24 hours. For immediate
                emergencies, please contact your local authorities.
              </p>
            </div>
          </section>

          {/* Tips for Parents */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Safety Tips for Parents
              </h2>
            </div>

            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li>
                <strong>Stay Involved:</strong> Periodically observe your child&apos;s classes and
                review their progress
              </li>
              <li>
                <strong>Open Communication:</strong> Talk to your child about their online experience
                and encourage them to report anything that makes them uncomfortable
              </li>
              <li>
                <strong>Supervise Younger Children:</strong> For children under 10, we recommend
                having an adult nearby during classes
              </li>
              <li>
                <strong>Review Progress:</strong> Regularly check your parent dashboard to see what
                your child is learning
              </li>
              <li>
                <strong>Know the Rules:</strong> Review our{" "}
                <Link
                  href="/acceptable-use"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Acceptable Use Policy
                </Link>{" "}
                with your child
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Contact Us
              </h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              For questions about child safety or COPPA compliance:
            </p>
            <div className="space-y-1 text-slate-700 dark:text-slate-300">
              <p>
                Email:{" "}
                <a
                  href={`mailto:${emails.safety}`}
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  {emails.safety}
                </a>
              </p>
            </div>
          </section>

          {/* Related Links */}
          <section className="flex flex-wrap gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Link
              href="/privacy"
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/acceptable-use"
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Acceptable Use Policy
            </Link>
          </section>
        </Card>
      </div>
    </main>
  );
}
