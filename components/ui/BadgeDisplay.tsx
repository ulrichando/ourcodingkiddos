import { Trophy, Flame, Star, Zap, Award, Target, BookOpen, Code2 } from "lucide-react";

type Badge = {
  name: string;
  description?: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
  icon?: keyof typeof badgeIcons;
};

const badgeIcons = {
  trophy: Trophy,
  flame: Flame,
  star: Star,
  zap: Zap,
  award: Award,
  target: Target,
  book: BookOpen,
  code: Code2,
};

const rarityColors: Record<NonNullable<Badge["rarity"]>, string> = {
  common: "from-slate-400 to-slate-500 ring-slate-300",
  rare: "from-blue-400 to-blue-500 ring-blue-300",
  epic: "from-purple-400 to-purple-500 ring-purple-300",
  legendary: "from-amber-400 to-orange-500 ring-amber-300",
};

type Size = "sm" | "md" | "lg";

const sizeClasses: Record<Size, string> = {
  sm: "w-8 h-8 p-1.5",
  md: "w-12 h-12 p-2.5",
  lg: "w-16 h-16 p-3",
};

type BadgeDisplayProps = {
  badge: Badge;
  size?: Size;
  showTooltip?: boolean;
};

export default function BadgeDisplay({ badge, size = "md", showTooltip = true }: BadgeDisplayProps) {
  const Icon = badgeIcons[badge.icon || "trophy"] ?? Trophy;
  const rarity = badge.rarity || "common";
  const tooltip = showTooltip ? `${badge.name} · ${badge.description || ""}`.trim() : undefined;

  return (
    <div
      title={tooltip}
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${rarityColors[rarity]} ring-2 ring-offset-2 shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform`}
    >
      <Icon className="w-full h-full text-white drop-shadow" />
    </div>
  );
}
