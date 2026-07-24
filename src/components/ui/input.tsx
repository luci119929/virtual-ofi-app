import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  label: string;
  error?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

/** Campo con label en mayúsculas + input tipo píldora crema. */
export function Field({ label, error, className, id, ...rest }: FieldProps) {
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
        aria-invalid={error ? true : undefined}
        className={cn(
          "h-10 w-full rounded-pill border-0 bg-cream px-4 text-[14px] text-maroon placeholder:text-maroon/45",
          error && "ring-2 ring-red-bright",
        )}
        {...rest}
      />
      {error ? (
        <p className="px-1 text-[12px] font-medium text-orange">{error}</p>
      ) : null}
    </div>
  );
}
