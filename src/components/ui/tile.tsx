import { cn } from "@/lib/cn";

type TileTone = "orange" | "red" | "soft";

const tones: Record<TileTone, string> = {
  orange: "bg-orange/30 border border-cream/15",
  red: "bg-red/55 border border-cream/10",
  soft: "bg-maroon/55 border border-cream/10",
};

/** Tile del dashboard: número grande + etiqueta, estilo panel de control. */
export function Tile({
  tone = "soft",
  value,
  label,
  className,
  children,
}: {
  tone?: TileTone;
  value?: React.ReactNode;
  label?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[80px] flex-col justify-between rounded-2xl p-4",
        tones[tone],
        className,
      )}
    >
      {children ?? (
        <>
          <div className="font-display text-[26px] font-extrabold leading-none tabular-nums">
            {value}
          </div>
          <div className="mt-1.5 text-[11px] uppercase tracking-[0.03em] text-cream-dim">
            {label}
          </div>
        </>
      )}
    </div>
  );
}
