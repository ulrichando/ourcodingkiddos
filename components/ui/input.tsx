import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm shadow-inner",
        "placeholder:text-slate-400 dark:placeholder:text-slate-500",
        "focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 focus:border-purple-300 dark:focus:border-purple-500",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
export default Input;
