import { Sparkles } from "lucide-react";

type Size = "sm" | "md" | "lg";

type XPBarProps = {
  currentXP: number;
  levelXP: number;
  level: number;
  size?: Size;
};

const SIZE_CLASSES: Record<
  Size,
  {
    bar: string;
    text: string;
  }
> = {
  sm: { bar: "h-2", text: "text-xs" },
  md: { bar: "h-3", text: "text-sm" },
  lg: { bar: "h-4", text: "text-base" },
};

export default function XPBar({ currentXP, levelXP, level, size = "md" }: XPBarProps) {
  const progress = Math.min((currentXP / Math.max(levelXP, 1)) * 100, 100);
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <div className={`flex items-center gap-1 ${sizeClass.text} font-semibold text-purple-600`}>
          <Sparkles className="w-4 h-4" />
          <span>Level {level}</span>
        </div>
        <span className={`${sizeClass.text} text-slate-500`}>
          {currentXP.toLocaleString()} / {levelXP.toLocaleString()} XP
        </span>
      </div>
      <div className={`w-full ${sizeClass.bar} bg-slate-200 rounded-full overflow-hidden`}>
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
