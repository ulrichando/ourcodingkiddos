import React from "react";
import { Flame, Star, ChevronRight, BookOpen } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Button from "../ui/button";
import XPBar from "../ui/XPBar";
import Link from "next/link";

const avatars = ["🦊", "🐼", "🦁", "🐯", "🐸", "🦉", "🐙", "🦄", "🐲", "🤖", "👾", "🎮"];

type Student = {
  id: string;
  name: string;
  age?: number;
  avatar?: number | string;
  total_xp?: number;
  current_level?: number;
  streak_days?: number;
};

type Props = {
  student: Student;
  onSelect?: (student: Student) => void;
};

export default function StudentCard({ student, onSelect }: Props) {
  const avatar = typeof student.avatar === "number" ? avatars[student.avatar] : student.avatar || "🎮";
  const currentLevel = student.current_level || 1;
  const levelXP = 500;
  const currentXP = (student.total_xp || 0) % levelXP;

  return (
    <Card
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      onClick={() => onSelect?.(student)}
    >
      <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400" />

      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-3xl shadow-inner">
            {avatar}
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-800 group-hover:text-purple-600 transition-colors">{student.name}</h3>
            {student.age && <p className="text-slate-500 text-sm">Age {student.age}</p>}

            <div className="flex items-center gap-3 mt-2">
              {student.streak_days && student.streak_days > 0 && (
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm font-medium">{student.streak_days} day streak</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">{student.total_xp || 0} XP</span>
              </div>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
        </div>

        <div className="mt-4">
          <XPBar currentXP={currentXP} levelXP={levelXP} level={currentLevel} size="sm" />
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-500 text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Continue Learning</span>
          </div>
          <Link
            href={`/dashboard/student?name=${encodeURIComponent(student.name || "Coder")}&id=${encodeURIComponent(
              student.id || ""
            )}&xp=${encodeURIComponent(String(student.total_xp || 0))}&level=${encodeURIComponent(
              String(student.current_level || 1)
            )}&streak=${encodeURIComponent(String(student.streak_days || 0))}&avatar=${encodeURIComponent(
              typeof student.avatar === "string" ? student.avatar : ""
            )}`}
          >
            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
              View Progress
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
