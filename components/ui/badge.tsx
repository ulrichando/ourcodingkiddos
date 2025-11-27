import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "outline";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";
  const styles =
    variant === "outline"
      ? "border border-slate-200 text-slate-700 bg-white"
      : "bg-slate-900 text-white";

  return <div className={cn(base, styles, className)} {...props} />;
}

export default Badge;
