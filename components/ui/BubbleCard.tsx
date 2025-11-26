import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
  accent?: "mint" | "sun" | "sky" | "grape";
  emoji?: string;
  className?: string;
}>;

const accentMap = {
  mint: "bg-emerald-100 text-emerald-900",
  sun: "bg-amber-100 text-amber-900",
  sky: "bg-sky-100 text-sky-900",
  grape: "bg-purple-100 text-purple-900",
};

export function BubbleCard({ title, accent = "sky", emoji = "⭐", className = "", children }: Props) {
  const accentClass = accentMap[accent] ?? accentMap.sky;
  return (
    <div className={`rounded-2xl p-4 border border-white shadow-md bg-white/80 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-xl ${accentClass}`}>
          {emoji}
        </span>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="text-sm text-slate-700 space-y-1">{children}</div>
    </div>
  );
}

export default BubbleCard;
