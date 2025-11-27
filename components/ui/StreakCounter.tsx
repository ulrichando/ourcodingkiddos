import { Flame } from "lucide-react";

type Size = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<
  Size,
  {
    container: string;
    icon: string;
    text: string;
  }
> = {
  sm: { container: "px-2 py-1", icon: "w-4 h-4", text: "text-sm" },
  md: { container: "px-3 py-1.5", icon: "w-5 h-5", text: "text-base" },
  lg: { container: "px-4 py-2", icon: "w-6 h-6", text: "text-lg" },
};

type Props = {
  days: number;
  size?: Size;
};

export default function StreakCounter({ days, size = "md" }: Props) {
  const isHot = days >= 7;
  const isFire = days >= 30;
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${sizeClass.container} rounded-full ${
        isFire
          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
          : isHot
            ? "bg-orange-100 text-orange-600"
            : "bg-slate-100 text-slate-600"
      }`}
    >
      <Flame className={`${sizeClass.icon} ${isFire ? "animate-pulse" : ""}`} />
      <span className={`${sizeClass.text} font-bold`}>{days}</span>
      <span className={`${sizeClass.text} font-medium`}>day streak</span>
    </div>
  );
}
