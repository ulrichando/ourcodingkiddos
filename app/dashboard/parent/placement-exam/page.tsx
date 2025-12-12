"use client";

import { useState } from "react";
import Link from "next/link";
import ParentLayout from "@/components/parent/ParentLayout";
import { Brain, CheckCircle, Clock, ArrowRight, Users } from "lucide-react";
import Button from "@/components/ui/button";

// Force dynamic rendering
export const dynamic = 'force-dynamic';


export default function ParentPlacementExamPage() {



  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const examFeatures = [
    { icon: Clock, title: "15-20 Minutes", desc: "Quick assessment to find the right level" },
    { icon: Brain, title: "Adaptive Questions", desc: "Questions adjust based on answers" },
    { icon: CheckCircle, title: "Instant Results", desc: "Get placement recommendation immediately" },
  ];

  return (
    <ParentLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Placement Exam</h1>
          <p className="text-slate-600 dark:text-slate-400">Find the right coding level for your child</p>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 sm:p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Coding Skills Assessment</h2>
              <p className="text-violet-100 mb-4">
                Our adaptive placement exam evaluates your child&apos;s current coding knowledge and recommends
                the perfect starting point in our curriculum.
              </p>
              <Link href="/placement-exam">
                <Button className="bg-white text-violet-600 hover:bg-violet-50">
                  Start Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-4">
          {examFeatures.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">How It Works</h3>
          <div className="space-y-4">
            {[
              { step: 1, title: "Select Your Child", desc: "Choose which student will take the assessment" },
              { step: 2, title: "Answer Questions", desc: "Your child answers coding questions at their own pace" },
              { step: 3, title: "Get Recommendation", desc: "Receive a personalized learning path recommendation" },
              { step: 4, title: "Start Learning", desc: "Begin with courses matched to their skill level" },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-violet-600 dark:text-violet-400">{item.step}</span>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">{item.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 text-center">
          <Users className="w-10 h-10 text-violet-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Ready to find the right level?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            The assessment takes about 15-20 minutes and can be retaken anytime.
          </p>
          <Link href="/placement-exam">
            <Button>
              Take the Placement Exam
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </ParentLayout>
  );
}
