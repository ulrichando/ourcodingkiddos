import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Clock, Star } from "lucide-react";
import LanguageIcon from "../ui/LanguageIcon";

type Props = {
  course: any;
  progress?: number;
  onClick?: () => void;
};

export default function CourseCard({ course, progress = 0, onClick }: Props) {
  const levelColors: Record<string, string> = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  };

  const level = (course.level || "beginner").toString().toLowerCase();
  const language = (course.language || "html").toString().toLowerCase();
  const ageGroup = course.age_group || course.ageGroup || (course.age ? course.age.replace("Ages ", "") : "7-10");
  const estimatedHours = course.estimated_hours ?? course.estimatedHours ?? 5;
  const totalXp = course.total_xp ?? course.totalXp ?? 500;

  return (
    <Card
      className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white"
      onClick={onClick}
    >
      <div className="relative h-40 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-4 left-4">
          <LanguageIcon language={language} size="lg" />
        </div>
        <div className="absolute bottom-4 right-4">
          <Badge className={`${levelColors[level] || levelColors.beginner} border-0 font-medium`}>{level}</Badge>
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
          Ages {ageGroup}
        </Badge>
        <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">{course.description || "Fun coding journey for kids."}</p>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{estimatedHours}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{totalXp} XP</span>
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
