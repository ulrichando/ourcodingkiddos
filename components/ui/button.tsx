import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

type Variant = "default" | "secondary" | "outline" | "ghost" | "destructive" | "success" | "warning" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<Variant, string> = {
  default: [
    "bg-gradient-to-r from-violet-600 to-purple-600 text-white",
    "shadow-lg shadow-violet-500/25",
    "hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/40",
    "active:scale-[0.98]",
  ].join(" "),
  secondary: [
    "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100",
    "hover:bg-slate-200 dark:hover:bg-slate-700",
    "active:scale-[0.98]",
  ].join(" "),
  outline: [
    "border border-slate-200 dark:border-slate-700",
    "text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900",
    "hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600",
    "active:scale-[0.98]",
  ].join(" "),
  ghost: [
    "bg-transparent text-slate-600 dark:text-slate-400",
    "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
    "active:scale-[0.98]",
  ].join(" "),
  destructive: [
    "bg-red-600 text-white",
    "shadow-lg shadow-red-500/25",
    "hover:bg-red-500 hover:shadow-red-500/40",
    "active:scale-[0.98]",
  ].join(" "),
  danger: [
    "bg-red-600 text-white",
    "shadow-lg shadow-red-500/25",
    "hover:bg-red-700 hover:shadow-red-500/40",
    "active:scale-[0.98]",
  ].join(" "),
  success: [
    "bg-gradient-to-r from-emerald-600 to-teal-600 text-white",
    "shadow-lg shadow-emerald-500/25",
    "hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/40",
    "active:scale-[0.98]",
  ].join(" "),
  warning: [
    "bg-amber-500 text-white",
    "shadow-lg shadow-amber-500/25",
    "hover:bg-amber-600 hover:shadow-amber-500/40",
    "active:scale-[0.98]",
  ].join(" "),
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 min-h-[44px] px-3 text-xs gap-1.5",
  md: "h-10 min-h-[44px] px-4 text-sm gap-2",
  lg: "h-12 min-h-[44px] px-6 text-base gap-2.5",
  icon: "h-10 w-10 min-h-[44px] min-w-[44px] p-0",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        // Base styles
        "relative inline-flex items-center justify-center font-medium",
        "rounded-lg transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
        // Variant and size
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>{children}</span>
    </button>
  )
);

Button.displayName = "Button";

export { Button };
export default Button;
