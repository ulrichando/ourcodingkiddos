import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type BadgeVariant = "default" | "secondary" | "outline" | "success" | "warning" | "error" | "info";
type BadgeSize = "sm" | "md" | "lg";

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  icon?: React.ReactNode;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: [
    "bg-slate-900 dark:bg-slate-100",
    "text-white dark:text-slate-900",
    "border-transparent",
  ].join(" "),
  secondary: [
    "bg-slate-100 dark:bg-slate-800",
    "text-slate-700 dark:text-slate-300",
    "border-transparent",
  ].join(" "),
  outline: [
    "bg-transparent",
    "text-slate-700 dark:text-slate-300",
    "border-slate-200 dark:border-slate-700",
  ].join(" "),
  success: [
    "bg-emerald-50 dark:bg-emerald-500/10",
    "text-emerald-700 dark:text-emerald-400",
    "border-emerald-200 dark:border-emerald-500/30",
  ].join(" "),
  warning: [
    "bg-amber-50 dark:bg-amber-500/10",
    "text-amber-700 dark:text-amber-400",
    "border-amber-200 dark:border-amber-500/30",
  ].join(" "),
  error: [
    "bg-red-50 dark:bg-red-500/10",
    "text-red-700 dark:text-red-400",
    "border-red-200 dark:border-red-500/30",
  ].join(" "),
  info: [
    "bg-blue-50 dark:bg-blue-500/10",
    "text-blue-700 dark:text-blue-400",
    "border-blue-200 dark:border-blue-500/30",
  ].join(" "),
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-white dark:bg-slate-900",
  secondary: "bg-slate-500 dark:bg-slate-400",
  outline: "bg-slate-500 dark:bg-slate-400",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

export function Badge({
  className,
  variant = "default",
  size = "md",
  dot,
  pulse,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        // Base styles
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        "border transition-colors duration-200",
        // Variant and size
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                dotColors[variant]
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              dotColors[variant]
            )}
          />
        </span>
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </div>
  );
}

// Status Badge - Specialized badge for status indicators
type StatusBadgeProps = {
  status: "online" | "offline" | "busy" | "away" | "pending";
  showLabel?: boolean;
  className?: string;
};

const statusConfig: Record<StatusBadgeProps["status"], { variant: BadgeVariant; label: string }> = {
  online: { variant: "success", label: "Online" },
  offline: { variant: "secondary", label: "Offline" },
  busy: { variant: "error", label: "Busy" },
  away: { variant: "warning", label: "Away" },
  pending: { variant: "info", label: "Pending" },
};

export function StatusBadge({ status, showLabel = true, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} size="sm" dot pulse={status === "online"} className={className}>
      {showLabel && config.label}
    </Badge>
  );
}

// Count Badge - For showing counts like notifications
type CountBadgeProps = {
  count: number;
  max?: number;
  variant?: BadgeVariant;
  className?: string;
};

export function CountBadge({ count, max = 99, variant = "error", className }: CountBadgeProps) {
  const displayCount = count > max ? `${max}+` : count.toString();
  return (
    <Badge
      variant={variant}
      size="sm"
      className={cn("min-w-[1.25rem] justify-center tabular-nums", className)}
    >
      {displayCount}
    </Badge>
  );
}

export default Badge;
