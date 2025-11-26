import { NextResponse } from "next/server";

type Faq = { topic: string; keywords: string[]; answer: string };

const faqs: Faq[] = [
  {
    topic: "getting-started",
    keywords: ["start", "begin", "course", "signup"],
    answer: "Create an account, pick a course, and enroll. The first lesson unlocks immediately after enrollment.",
  },
  {
    topic: "billing",
    keywords: ["billing", "payment", "price", "refund", "invoice"],
    answer: "Parents manage billing. You can view invoices and update payment methods from the parent dashboard.",
  },
  {
    topic: "schedule",
    keywords: ["schedule", "booking", "reschedule", "calendar"],
    answer: "Book 1:1 or group sessions from the scheduler. Reschedules must be requested 24 hours in advance.",
  },
  {
    topic: "progress",
    keywords: ["progress", "xp", "badges", "certificate"],
    answer: "XP is earned from lessons and quizzes. Badges unlock automatically. Certificates issue when a course is 100% complete.",
  },
];

function matchFaq(question: string | undefined) {
  if (!question) return { answer: "Ask me about billing, scheduling, or getting started!", topic: "fallback" };
  const normalized = question.toLowerCase();
  const hit = faqs.find((faq) => faq.keywords.some((k) => normalized.includes(k)));
  if (!hit) return { answer: "I couldn't find that. Try asking about billing, scheduling, or progress.", topic: "unknown" };
  return { answer: hit.answer, topic: hit.topic };
}

// POST /api/chatbot/faq - simple FAQ/navigator
export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const question = payload?.question ?? payload?.q;
  const result = matchFaq(typeof question === "string" ? question : undefined);
  return NextResponse.json({ status: "ok", ...result });
}

// GET /api/chatbot/faq - echo guidance
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "POST a JSON body like { question: 'How do I reschedule?' }",
    topics: faqs.map((faq) => faq.topic),
  });
}
