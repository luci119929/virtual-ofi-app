import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Option = { value: string; label: string };

type SelectFieldProps = {
  label: string;
  options: Option[];
  error?: string;
  className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function SelectField({
  label,
  options,
  error,
  className,
  id,
  ...rest
}: SelectFieldProps) {
  const selectId = id ?? `s-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={selectId}
        className="text-[12px] font-extrabold uppercase tracking-[0.02em] text-cream"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={cn(
          "h-10 w-full rounded-pill border-0 bg-cream px-4 text-[14px] text-maroon",
          error && "ring-2 ring-red-bright",
        )}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="px-1 text-[12px] font-medium text-orange">{error}</p>
      ) : null}
    </div>
  );
}
