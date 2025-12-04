"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, BookOpen, ArrowRight, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";

interface EnrollmentDetails {
  id: string;
  status: string;
  sessionsCompleted: number;
  program: {
    title: string;
    sessionCount: number;
    language: string;
  };
  studentProfile: {
    name: string | null;
  };
}

export default function ProgramSuccessPage() {
  const searchParams = useSearchParams();
  const enrollmentId = searchParams.get("enrollment");
  const [enrollment, setEnrollment] = useState<EnrollmentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#9333ea", "#ec4899", "#f59e0b"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#9333ea", "#ec4899", "#f59e0b"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  useEffect(() => {
    async function verifyEnrollment() {
      if (!enrollmentId) {
        setLoading(false);
        return;
      }

      try {
        // Verify and activate the enrollment
        const res = await fetch(`/api/enrollments/${enrollmentId}/verify`, {
          method: "POST",
        });

        if (res.ok) {
          const data = await res.json();
          setEnrollment(data.enrollment);
        }
      } catch (error) {
        console.error("Failed to verify enrollment:", error);
      } finally {
        setLoading(false);
      }
    }

    verifyEnrollment();
  }, [enrollmentId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            <PartyPopper className="w-8 h-8 inline-block mr-2 text-yellow-500" />
            Enrollment Successful!
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {enrollment
              ? `${enrollment.studentProfile.name || "Your student"} is now enrolled in ${enrollment.program.title}!`
              : "Your payment was successful and the enrollment is confirmed!"}
          </p>
        </div>

        {enrollment && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8 text-left">
            <h2 className="font-semibold text-lg mb-4 text-slate-900 dark:text-slate-100">
              Enrollment Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Program</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {enrollment.program.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Student</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {enrollment.studentProfile.name || "Student"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Sessions</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {enrollment.program.sessionCount} sessions
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Status</span>
                <span className="font-semibold text-green-600 dark:text-green-400">Active</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">What&apos;s Next?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Schedule Sessions</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Book your first session with an instructor
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Start Learning</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Access course materials and start coding
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard/parent"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:brightness-110 transition"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/schedule"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Schedule Sessions
          </Link>
        </div>

        <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </main>
  );
}
