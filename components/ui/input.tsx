import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type InputVariant = "default" | "filled" | "ghost";
type InputSize = "sm" | "md" | "lg";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  inputSize?: InputSize;
  error?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<InputVariant, string> = {
  default: [
    "border border-slate-200 dark:border-slate-700",
    "bg-white dark:bg-slate-900",
    "hover:border-slate-300 dark:hover:border-slate-600",
  ].join(" "),
  filled: [
    "border border-transparent",
    "bg-slate-100 dark:bg-slate-800",
    "hover:bg-slate-50 dark:hover:bg-slate-700",
  ].join(" "),
  ghost: [
    "border border-transparent",
    "bg-transparent",
    "hover:bg-slate-100 dark:hover:bg-slate-800",
  ].join(" "),
};

const sizeClasses: Record<InputSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-4 text-base",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "default", inputSize = "md", error, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            // Base styles
            "w-full rounded-lg transition-all duration-200",
            "text-slate-900 dark:text-slate-100",
            "placeholder:text-slate-400 dark:placeholder:text-slate-500",
            // Focus styles
            "focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-500/30",
            "focus:border-violet-500 dark:focus:border-violet-400",
            // Disabled styles
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800",
            // Error styles
            error && "border-red-500 dark:border-red-400 focus:ring-red-500/20 focus:border-red-500",
            // Variant and size
            variantClasses[variant],
            sizeClasses[inputSize],
            // Icon padding
            icon ? "pl-10" : "",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export default Input;
