import { cn } from "../../lib/utils";
import type { HTMLAttributes } from "react";

type CardVariant = "default" | "elevated" | "outlined" | "ghost" | "interactive";

const cardVariants: Record<CardVariant, string> = {
  default: [
    "bg-white dark:bg-slate-900",
    "border border-slate-200 dark:border-slate-800",
    "shadow-sm",
  ].join(" "),
  elevated: [
    "bg-white dark:bg-slate-900",
    "border border-slate-200/50 dark:border-slate-700/50",
    "shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50",
  ].join(" "),
  outlined: [
    "bg-transparent",
    "border border-slate-200 dark:border-slate-700",
  ].join(" "),
  ghost: [
    "bg-slate-50/50 dark:bg-slate-800/50",
    "border border-transparent",
  ].join(" "),
  interactive: [
    "bg-white dark:bg-slate-900",
    "border border-slate-200 dark:border-slate-800",
    "shadow-sm",
    "transition-all duration-300 ease-out",
    "hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50",
    "hover:border-slate-300 dark:hover:border-slate-700",
    "cursor-pointer",
  ].join(" "),
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden",
        cardVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-5 py-4 border-t border-slate-100 dark:border-slate-800",
        "bg-slate-50/50 dark:bg-slate-800/30",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-5 py-4 border-b border-slate-100 dark:border-slate-800",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-semibold text-slate-900 dark:text-slate-100",
        "leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-sm text-slate-500 dark:text-slate-400",
        "mt-1.5",
        className
      )}
      {...props}
    />
  );
}

// Gradient border card variant
export function GradientCard({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative rounded-xl p-[1px]",
        "bg-gradient-to-br from-violet-500/50 via-purple-500/50 to-pink-500/50",
        className
      )}
      {...props}
    >
      <div className="rounded-[11px] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

// Feature card with icon
interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description, className, ...props }: FeatureCardProps) {
  return (
    <Card variant="interactive" className={cn("group", className)} {...props}>
      <CardContent className="space-y-4">
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Stats card with animated number
interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
}

export function StatCard({ value, label, icon, trend, className, ...props }: StatCardProps) {
  return (
    <Card variant="default" className={className} {...props}>
      <CardContent>
        <div className="flex items-start justify-between">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
              {icon}
            </div>
          )}
          {trend && (
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.isPositive
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {value}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
