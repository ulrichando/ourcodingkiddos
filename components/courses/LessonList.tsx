import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";
import { cn } from "../../lib/utils";

type Lesson = {
  id: string;
  title: string;
  xp_reward?: number;
  xpReward?: number;
  video_url?: string | null;
  videoUrl?: string | null;
};

type Props = {
  lessons: Lesson[];
  currentLessonId?: string;
  completedLessons?: string[];
  onSelectLesson?: (lesson: Lesson) => void;
};

export default function LessonList({ lessons, currentLessonId, completedLessons = [], onSelectLesson }: Props) {
  return (
    <div className="space-y-2">
      {lessons.map((lesson, index) => {
        const xp = lesson.xp_reward ?? lesson.xpReward ?? 50;
        const videoUrl = lesson.video_url ?? lesson.videoUrl;
        const isCompleted = completedLessons.includes(lesson.id);
        const isCurrent = lesson.id === currentLessonId;
        const prevCompleted = index === 0 || completedLessons.includes(lessons[index - 1]?.id);
        const isLocked = !isCompleted && !isCurrent && !prevCompleted;

        return (
          <button
            key={lesson.id}
            onClick={() => !isLocked && onSelectLesson?.(lesson)}
            disabled={isLocked}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 text-left",
              isCurrent && "bg-purple-100 border-2 border-purple-500",
              isCompleted && !isCurrent && "bg-green-50 hover:bg-green-100",
              !isCompleted && !isCurrent && !isLocked && "bg-white hover:bg-slate-50 border border-slate-200",
              isLocked && "bg-slate-100 opacity-60 cursor-not-allowed"
            )}
          >
            <div className="flex-shrink-0">
              {isLocked ? (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
              ) : isCompleted ? (
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              ) : isCurrent ? (
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center animate-pulse">
                  <PlayCircle className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <Circle className="w-5 h-5 text-slate-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">Lesson {index + 1}</span>
                {videoUrl && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Video</span>
                )}
              </div>
              <h4
                className={cn(
                  "font-semibold truncate",
                  isCurrent ? "text-purple-700" : isCompleted ? "text-green-700" : "text-slate-700"
                )}
              >
                {lesson.title}
              </h4>
            </div>

            <div className="flex-shrink-0 text-right">
              <span className="text-sm font-medium text-amber-500">+{xp} XP</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
