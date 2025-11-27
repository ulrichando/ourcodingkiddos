import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Play, Clock, BookOpen, Star } from "lucide-react";
import LanguageIcon from "../../../components/ui/LanguageIcon";
import { courses } from "../../../data/courses";

const levelColor: Record<(typeof courses)[number]["level"], string> = {
  beginner: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-purple-100 text-purple-700",
};

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const course = courses.find((c) => c.id === params.courseId);
  if (!course) return notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-8 items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <LanguageIcon language={course.language} size="sm" />
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelColor[course.level]}`}>
                {course.level}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{course.age}</span>
            </div>

            <h1 className="text-4xl font-bold text-slate-900">{course.title}</h1>
            <p className="text-slate-600 text-lg max-w-3xl">{course.description}</p>

            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-500" /> {course.hours} hours
              </span>
              <span className="inline-flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-slate-500" /> {course.lessons.length} lessons
              </span>
              <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                <Star className="w-4 h-4" /> {course.xp} XP
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <div>
              <p className="text-sm text-slate-500">Ready to Start?</p>
              <h3 className="text-2xl font-bold text-slate-900">Continue your coding journey</h3>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3"
            >
              <Play className="w-4 h-4" />
              Start Learning
            </Link>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckIcon /> Full course access
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon /> Code playground
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon /> Quizzes & exercises
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon /> Earn badges & XP
              </li>
            </ul>
          </div>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Course Content</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {course.lessons.map((lesson, idx) => (
              <div key={lesson.title} className="flex items-center gap-4 p-6">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{lesson.title}</p>
                  <p className="text-sm text-slate-600">{lesson.description}</p>
                </div>
                <span className="text-xs font-semibold text-slate-700 px-3 py-1 rounded-full bg-slate-100">
                  {lesson.xp} XP
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414L8.5 11.836l6.543-6.543a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function generateStaticParams() {
  return courses.map((course) => ({ courseId: course.id }));
}
