import { Code2, Palette, FileCode, Terminal, Gamepad2 } from "lucide-react";

const languageConfig: Record<
  string,
  { icon: typeof Code2; color: string; bg: string; label: string }
> = {
  html: { icon: Code2, color: "text-orange-500", bg: "bg-orange-100", label: "HTML" },
  css: { icon: Palette, color: "text-blue-500", bg: "bg-blue-100", label: "CSS" },
  javascript: { icon: FileCode, color: "text-yellow-500", bg: "bg-yellow-100", label: "JavaScript" },
  python: { icon: Terminal, color: "text-green-500", bg: "bg-green-100", label: "Python" },
  roblox: { icon: Gamepad2, color: "text-red-500", bg: "bg-red-100", label: "Roblox" },
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
