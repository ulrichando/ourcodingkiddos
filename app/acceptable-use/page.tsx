"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Shield,
  Users,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Heart,
  BookOpen,
  Mail,
  Ban,
  Eye,
} from "lucide-react";
import { emails } from "@/lib/emails";

export default function AcceptableUsePolicyPage() {
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
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Acceptable Use Policy
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Introduction */}
          <section className="space-y-3">
            <p className="text-slate-700 dark:text-slate-300">
              Coding Kiddos is committed to providing a safe, respectful, and productive learning
              environment for all students. This Acceptable Use Policy outlines the expected behavior
              and prohibited activities on our platform to ensure everyone can learn and grow together.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              By using our services, students, parents, and instructors agree to follow these guidelines.
              Violations may result in warnings, suspension, or permanent removal from the platform.
            </p>
          </section>

          {/* Our Values */}
          <section className="space-y-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Our Community Values
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Respect</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Treat everyone with kindness and respect
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Safety</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Keep our community safe for all ages
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Learning</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Focus on growth and helping others learn
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Integrity</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Be honest and do your own work
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Expected Behavior */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Expected Behavior
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  During Live Classes
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Be on time and prepared for class</li>
                  <li>Keep your camera on when required (or use a profile picture)</li>
                  <li>Mute your microphone when not speaking</li>
                  <li>Raise your hand or use chat to ask questions</li>
                  <li>Listen actively and participate constructively</li>
                  <li>Be patient with yourself and others while learning</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  On the Platform
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Use your real name or an appropriate username</li>
                  <li>Choose an appropriate avatar or profile picture</li>
                  <li>Report any bugs, issues, or concerns to support</li>
                  <li>Help others when you can and celebrate their successes</li>
                  <li>Complete your own work and cite sources when using others&apos; code</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  In Communications
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Use appropriate language at all times</li>
                  <li>Be kind and constructive in feedback</li>
                  <li>Respect different opinions and skill levels</li>
                  <li>Ask for help when you need it - questions are welcome!</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Prohibited Activities
              </h2>
            </div>

            <p className="text-slate-700 dark:text-slate-300">
              The following activities are strictly prohibited and may result in immediate removal
              from the platform:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Harassment & Bullying
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Bullying, intimidating, or threatening other users
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Making fun of or mocking other students
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Discrimination based on race, gender, religion, or any other factor
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Unwanted contact or repeated messaging after being asked to stop
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Inappropriate Content
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Sharing violent, sexual, or inappropriate content
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Using profanity, hate speech, or offensive language
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Posting spam, advertisements, or irrelevant content
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Sharing personal information of others without consent
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Security & Safety Violations
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Sharing login credentials or accessing others&apos; accounts
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Attempting to hack, exploit, or compromise the platform
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Sharing meeting links or class access codes with non-enrolled users
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Recording or distributing class content without permission
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Disruptive Behavior
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Repeatedly disrupting classes or other students&apos; learning
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Ignoring instructor directions or rules
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Using the platform for purposes other than learning
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Creating multiple accounts or impersonating others
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Parental Responsibility */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Parental Responsibility
              </h2>
            </div>

            <p className="text-slate-700 dark:text-slate-300">
              Parents and guardians play a crucial role in ensuring a positive learning experience:
            </p>

            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li>
                <strong>Supervision:</strong> We encourage parents to be aware of their child&apos;s
                online activities and periodically observe classes
              </li>
              <li>
                <strong>Environment:</strong> Ensure your child has a quiet, appropriate space for
                learning
              </li>
              <li>
                <strong>Equipment:</strong> Verify that camera and microphone are working properly
                before class
              </li>
              <li>
                <strong>Communication:</strong> Discuss online safety and appropriate behavior with
                your child
              </li>
              <li>
                <strong>Reporting:</strong> Notify us immediately if you have any concerns about
                safety or behavior
              </li>
            </ul>
          </section>

          {/* Reporting */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Reporting Violations
              </h2>
            </div>

            <p className="text-slate-700 dark:text-slate-300">
              If you witness or experience any behavior that violates this policy, please report it
              immediately:
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Email Report</p>
                  <a
                    href={`mailto:${emails.support}`}
                    className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    {emails.support}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">During Class</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Use the private chat feature to message your instructor
                  </p>
                </div>
              </div>
            </div>

            <p className="text-slate-700 dark:text-slate-300">
              All reports are taken seriously and investigated promptly. Reports can be made
              anonymously, and we will not retaliate against anyone who reports in good faith.
            </p>
          </section>

          {/* Consequences */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Consequences of Violations
              </h2>
            </div>

            <p className="text-slate-700 dark:text-slate-300">
              Violations of this policy may result in the following actions, depending on severity:
            </p>

            <ol className="list-decimal pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              <li>
                <strong>Verbal Warning:</strong> A reminder from the instructor during class
              </li>
              <li>
                <strong>Written Warning:</strong> Email notification to parent/guardian
              </li>
              <li>
                <strong>Temporary Suspension:</strong> Removal from classes for 1-7 days
              </li>
              <li>
                <strong>Extended Suspension:</strong> Removal from classes for 2-4 weeks
              </li>
              <li>
                <strong>Permanent Ban:</strong> Permanent removal from the platform with no refund
              </li>
            </ol>

            <p className="text-slate-700 dark:text-slate-300">
              Serious violations (threats, harassment, illegal activity) may result in immediate
              permanent ban without prior warnings.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Questions?
              </h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              If you have questions about this policy, please contact us:
            </p>
            <div className="space-y-1 text-slate-700 dark:text-slate-300">
              <p>
                Email:{" "}
                <a
                  href={`mailto:${emails.support}`}
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  {emails.support}
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
              href="/safety"
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Child Safety
            </Link>
          </section>
        </Card>
      </div>
    </main>
  );
}
