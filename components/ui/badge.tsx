import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "outline";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";
  const styles =
    variant === "outline"
      ? "border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800"
      : "bg-slate-900 dark:bg-purple-600 text-white";

  return <div className={cn(base, styles, className)} {...props} />;
}

export default Badge;
