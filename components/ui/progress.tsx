import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ProgressProps = HTMLAttributes<HTMLDivElement> & {
  value: number;
};

export function Progress({ value, className, ...props }: ProgressProps) {
  const safe = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("w-full h-2 rounded-full bg-slate-200 overflow-hidden", className)} {...props}>
      <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${safe}%` }} />
    </div>
  );
}

export default Progress;
