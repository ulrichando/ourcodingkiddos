import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner",
        "focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
export default Input;
