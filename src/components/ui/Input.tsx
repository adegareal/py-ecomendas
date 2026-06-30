import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

function Input({ label, className, ...props }: InputProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-700">
      {label ? <span>{label}</span> : null}
      <input
        className={cn(
          "h-11 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          className
        )}
        {...props}
      />
    </label>
  );
}

export default Input;