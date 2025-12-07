"use client";

import Link from "next/link";
import { Calendar, Eye, Award } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Button from "../ui/button";
import Badge from "../ui/badge";

type Certificate = {
  id: string;
  course_title: string;
  student_name: string;
  issued_date: string | Date;
  achievement_type: "course_completion" | "track_completion" | "special_achievement";
};

const achievementColors: Record<
  Certificate["achievement_type"],
  { bg: string; text: string; label: string }
> = {
  course_completion: { bg: "bg-purple-100", text: "text-purple-700", label: "Course Completion" },
  track_completion: { bg: "bg-amber-100", text: "text-amber-700", label: "Track Completion" },
  special_achievement: { bg: "bg-pink-100", text: "text-pink-700", label: "Special Achievement" },
};

function formatDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CertificateCard({ certificate }: { certificate: Certificate }) {
  const typeConfig = achievementColors[certificate.achievement_type] || achievementColors.course_completion;
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-32 bg-gradient-to-br from-amber-100 via-amber-50 to-white border-b-4 border-amber-400 flex items-center justify-center relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-2 w-16 h-16 border-4 border-amber-400 rounded-full" />
          <div className="absolute bottom-2 right-2 w-12 h-12 border-4 border-amber-400 rounded-full" />
        </div>
        <div className="text-center z-10">
          <Award className="w-10 h-10 text-amber-500 mx-auto mb-1" />
          <p className="text-xs text-amber-700 font-medium">CERTIFICATE</p>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">{certificate.course_title}</h3>
            <p className="text-sm text-slate-500">{certificate.student_name}</p>
          </div>
          <Badge className={`${typeConfig.bg} ${typeConfig.text} border-0`}>{typeConfig.label}</Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(certificate.issued_date)}</span>
        </div>

        <Link href={`/certificates/${certificate.id}`}>
          <Button className="w-full">
            <Eye className="w-4 h-4" />
            View Certificate
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
