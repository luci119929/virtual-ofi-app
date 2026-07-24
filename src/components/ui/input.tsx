import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  label: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

/** Campo con label en mayúsculas + input tipo píldora crema. */
export function Field({ label, className, id, ...rest }: FieldProps) {
  const inputId = id ?? `f-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={inputId}
        className="text-[12px] font-extrabold uppercase tracking-[0.02em] text-cream"
      >
        {label}
      </label>
      <input
        id={inputId}
        className="h-10 w-full rounded-pill border-0 bg-cream px-4 text-[14px] text-maroon placeholder:text-maroon/45"
        {...rest}
      />
    </div>
  );
}
