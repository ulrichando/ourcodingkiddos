"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  RefreshCw,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  HelpCircle,
  Calendar,
  Shield,
} from "lucide-react";
import { emails } from "@/lib/emails";

export default function RefundPolicyPage() {
  const lastUpdated = "December 2025";

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
                <RefreshCw className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Refund Policy
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Introduction */}
          <section className="space-y-3">
            <p className="text-slate-700 dark:text-slate-300">
              At Coding Kiddos, we want you and your child to be completely satisfied with our
              coding courses and programs. We understand that circumstances may change, and we strive
              to provide a fair and transparent refund policy for all our customers.
            </p>
          </section>

          {/* Satisfaction Guarantee */}
          <section className="space-y-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                100% Satisfaction Guarantee
              </h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              We offer a <strong>100% money-back guarantee</strong> for the first 4 sessions of any
              program or course. If you or your child are not satisfied with our service for any
              reason during the trial period, we will provide a full refund, no questions asked.
            </p>
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Try risk-free for your first 4 classes
            </div>
          </section>

          {/* Program Refunds */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Program & Course Refunds
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Before Program Starts
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>More than 14 days before start:</strong> Full refund (100%)
                  </li>
                  <li>
                    <strong>7-14 days before start:</strong> 90% refund or full course credit
                  </li>
                  <li>
                    <strong>Less than 7 days before start:</strong> 75% refund or full course credit
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  After Program Starts
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>Within first 4 sessions:</strong> Full refund (Satisfaction Guarantee)
                  </li>
                  <li>
                    <strong>After 4 sessions:</strong> Prorated refund for remaining sessions minus
                    a $50 administrative fee
                  </li>
                  <li>
                    <strong>More than 50% completed:</strong> Course credit only (no cash refund)
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 1-on-1 Classes */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                1-on-1 Private Classes
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Cancellation Policy
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>More than 24 hours notice:</strong> Full refund or reschedule at no charge
                  </li>
                  <li>
                    <strong>Less than 24 hours notice:</strong> 50% refund or reschedule with $15 fee
                  </li>
                  <li>
                    <strong>No-show without notice:</strong> No refund (session is forfeited)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Package Refunds
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  For prepaid session packages (e.g., 6, 12, or 24 sessions), refunds are calculated
                  based on the number of unused sessions at the single-session rate, minus any
                  package discounts received.
                </p>
              </div>
            </div>
          </section>

          {/* Processing Time */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Refund Processing
              </h2>
            </div>

            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li>
                Refunds are processed within <strong>5-7 business days</strong> of approval
              </li>
              <li>
                Refunds are issued to the original payment method used for the purchase
              </li>
              <li>
                Credit card refunds may take an additional 3-5 business days to appear on your statement
              </li>
              <li>
                Course credits are applied to your account immediately and never expire
              </li>
            </ul>
          </section>

          {/* What Qualifies */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              What Qualifies for a Refund
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Eligible */}
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Eligible for Refund
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Service not meeting expectations
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Technical issues preventing access
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Schedule conflicts (with notice)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Medical emergencies
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Duplicate purchases
                  </li>
                </ul>
              </div>

              {/* Not Eligible */}
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Not Eligible for Refund
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Completed courses/sessions
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Violation of Terms of Service
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    No-shows without notice
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Requests after 90 days
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Promotional/free classes
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Special Circumstances */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Special Circumstances
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Medical or Family Emergencies
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  We understand that emergencies happen. In cases of documented medical or family
                  emergencies, we will work with you to provide a full refund or course credit,
                  regardless of the timing. Please contact us with documentation to discuss your
                  situation.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Service Disruptions
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  If classes are cancelled or significantly disrupted due to issues on our end
                  (technical problems, instructor unavailability, etc.), you will receive a full
                  credit for the affected sessions or a prorated refund at your choice.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Student Behavior Issues
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  If a student is removed from a class or program due to behavior that violates our
                  Acceptable Use Policy, no refund will be provided. We reserve the right to remove
                  students who disrupt class or behave inappropriately.
                </p>
              </div>
            </div>
          </section>

          {/* How to Request */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                How to Request a Refund
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                To request a refund, please follow these steps:
              </p>

              <ol className="list-decimal pl-5 space-y-3 text-slate-700 dark:text-slate-300">
                <li>
                  <strong>Email us at</strong>{" "}
                  <a
                    href={`mailto:${emails.billing}`}
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    {emails.billing}
                  </a>{" "}
                  with the subject line &quot;Refund Request&quot;
                </li>
                <li>
                  <strong>Include in your email:</strong>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Your account email address</li>
                    <li>Student name and course/program name</li>
                    <li>Reason for the refund request</li>
                    <li>Any supporting documentation (if applicable)</li>
                  </ul>
                </li>
                <li>
                  <strong>Wait for confirmation:</strong> Our team will review your request and
                  respond within 2 business days
                </li>
                <li>
                  <strong>Receive your refund:</strong> Once approved, refunds are processed within
                  5-7 business days
                </li>
              </ol>
            </div>
          </section>

          {/* Course Credits */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Course Credits
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              As an alternative to a cash refund, you may choose to receive course credits:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li>Course credits never expire</li>
              <li>Credits can be used for any course, program, or 1-on-1 session</li>
              <li>Credits are transferable to other students within your family</li>
              <li>
                Choosing credits instead of refund may provide additional bonus credit (varies by
                situation)
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Questions About Refunds?
              </h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              If you have any questions about our refund policy or need assistance, please contact us:
            </p>
            <div className="space-y-1 text-slate-700 dark:text-slate-300">
              <p>
                Email:{" "}
                <a
                  href={`mailto:${emails.billing}`}
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  {emails.billing}
                </a>
              </p>
              <p>
                Website:{" "}
                <a
                  href="https://ourcodingkiddos.com/contact"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  ourcodingkiddos.com/contact
                </a>
              </p>
            </div>
          </section>

          {/* Related Links */}
          <section className="flex flex-wrap gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Link
              href="/terms"
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Privacy Policy
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
