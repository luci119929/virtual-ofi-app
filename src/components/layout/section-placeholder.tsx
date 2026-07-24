import { PageHeader } from "./page-header";

/** Placeholder de sección aún no construida (Fases siguientes). */
export function SectionPlaceholder({
  title,
  phase,
  description,
}: {
  title: string;
  phase: string;
  description: string;
}) {
  return (
    <>
      <PageHeader title={title} meta={phase} />
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-card border border-dashed border-cream/20 bg-maroon/20 px-8 py-12 text-center">
        <p className="max-w-[52ch] text-[14px] text-cream-dim">{description}</p>
        <span className="mt-4 font-display text-[11px] uppercase tracking-[0.16em] text-orange">
          En construcción
        </span>
      </div>
    </>
  );
}
