import { Code2, Palette, FileCode, Terminal, Gamepad2, Wrench, Brain, Bot, Globe, Smartphone, Joystick, Award } from "lucide-react";

const languageConfig: Record<
  string,
  { icon: typeof Code2; color: string; bg: string; label: string }
> = {
  html: { icon: Code2, color: "text-orange-500", bg: "bg-orange-100", label: "HTML" },
  css: { icon: Palette, color: "text-blue-500", bg: "bg-blue-100", label: "CSS" },
  javascript: { icon: FileCode, color: "text-yellow-500", bg: "bg-yellow-100", label: "JavaScript" },
  python: { icon: Terminal, color: "text-green-500", bg: "bg-green-100", label: "Python" },
  roblox: { icon: Gamepad2, color: "text-red-500", bg: "bg-red-100", label: "Roblox" },
  engineering: { icon: Wrench, color: "text-slate-600", bg: "bg-slate-100", label: "Engineering" },
  ai_ml: { icon: Brain, color: "text-purple-500", bg: "bg-purple-100", label: "AI & ML" },
  robotics: { icon: Bot, color: "text-cyan-500", bg: "bg-cyan-100", label: "Robotics" },
  web_development: { icon: Globe, color: "text-indigo-500", bg: "bg-indigo-100", label: "Web Dev" },
  mobile_development: { icon: Smartphone, color: "text-pink-500", bg: "bg-pink-100", label: "Mobile Dev" },
  game_development: { icon: Joystick, color: "text-emerald-500", bg: "bg-emerald-100", label: "Game Dev" },
  career_prep: { icon: Award, color: "text-amber-500", bg: "bg-amber-100", label: "Career Prep" },
};

type Props = {
  language: string;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
};

export default function LanguageIcon({ language, size = "md", showLabel = false }: Props) {
  const config = languageConfig[language] || languageConfig.html;
  const Icon = config.icon;

  const sizeClasses: Record<typeof size, string> = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div className={`inline-flex items-center gap-2 ${config.bg} ${config.color} rounded-lg p-2`}>
      <Icon className={sizeClasses[size]} />
      {showLabel && <span className="font-medium text-sm">{config.label}</span>}
    </div>
  );
}
