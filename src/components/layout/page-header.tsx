import { cn } from "@/lib/cn";

/** Título de sección con estilo "panel de control" (display + tracking). */
export function PageHeader({
  title,
  meta,
  className,
}: {
  title: string;
  meta?: string;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "mb-5 flex flex-wrap items-baseline justify-between gap-2",
        className,
      )}
    >
      <h1 className="font-display text-[22px] font-extrabold uppercase tracking-[0.06em] text-cream">
        {title}
      </h1>
      {meta ? (
        <span className="font-display text-[11px] uppercase tracking-[0.14em] text-cream-dim">
          {meta}
        </span>
      ) : null}
    </header>
  );
}
