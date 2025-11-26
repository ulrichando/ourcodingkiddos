import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  color?: "mint" | "sun" | "sky" | "grape";
  className?: string;
}>;

const colorMap = {
  mint: "bg-emerald-50 border-emerald-200",
  sun: "bg-amber-50 border-amber-200",
  sky: "bg-sky-50 border-sky-200",
  grape: "bg-purple-50 border-purple-200",
};

export function Section({ title, subtitle, color = "mint", className = "", children }: Props) {
  const colorClasses = colorMap[color] ?? colorMap.mint;
  return (
    <section className={`border rounded-2xl p-4 md:p-6 shadow-sm ${colorClasses} ${className}`}>
      {(title || subtitle) && (
        <header className="mb-3">
          {title && <h2 className="text-xl font-bold text-slate-800">{title}</h2>}
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </header>
      )}
      <div className="space-y-2">{children}</div>
    </section>
  );
}

export default Section;
