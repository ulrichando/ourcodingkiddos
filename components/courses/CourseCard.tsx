import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Clock, Star } from "lucide-react";
import LanguageIcon from "../ui/LanguageIcon";

type Course = {
  id: string;
  title: string;
  description?: string;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  age_group?: string;
  thumbnail_url?: string;
  total_xp?: number;
  estimated_hours?: number;
};

type Props = {
  course: Course;
  progress?: number;
  onClick?: () => void;
};

export default function CourseCard({ course, progress = 0, onClick }: Props) {
  const levelColors: Record<Course["level"], string> = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white"
      onClick={onClick}
    >
      <div className="relative h-40 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-4 left-4">
          <LanguageIcon language={course.language} size="lg" />
        </div>
        <div className="absolute bottom-4 right-4">
          <Badge className={`${levelColors[course.level]} border-0 font-medium`}>{course.level}</Badge>
        </div>
        {course.thumbnail_url && (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
          />
        )}
      </div>

      <CardContent className="p-5">
        <Badge variant="outline" className="mb-2 text-xs">
          Ages {course.age_group || "7-10"}
        </Badge>
        <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">{course.description || "Fun coding journey for kids."}</p>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.estimated_hours || 5}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{course.total_xp || 500} XP</span>
          </div>
        </div>
      </CardContent>

      {progress > 0 && (
        <CardFooter className="px-5 pb-5 pt-0">
          <div className="w-full">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
