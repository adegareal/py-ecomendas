import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

function Select({ label, className, children, ...props }: SelectProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-700">
      {label ? <span>{label}</span> : null}
      <select
        className={cn(
          "h-11 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export default Select;