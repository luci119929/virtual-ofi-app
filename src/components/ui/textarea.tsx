import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextareaField({
  label,
  hint,
  error,
  className,
  id,
  ...rest
}: TextareaFieldProps) {
  const areaId = id ?? `t-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={areaId}
        className="text-[12px] font-extrabold uppercase tracking-[0.02em] text-cream"
      >
        {label}
      </label>
      <textarea
        id={areaId}
        className={cn(
          "min-h-[84px] w-full rounded-2xl border-0 bg-cream px-4 py-3 text-[14px] text-maroon placeholder:text-maroon/45",
          error && "ring-2 ring-red-bright",
        )}
        {...rest}
      />
      {hint ? <p className="px-1 text-[12px] text-cream-dim">{hint}</p> : null}
      {error ? (
        <p className="px-1 text-[12px] font-medium text-orange">{error}</p>
      ) : null}
    </div>
  );
}
