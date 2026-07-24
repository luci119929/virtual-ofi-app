import { cn } from "@/lib/cn";

type ChipTone =
  | "frio"
  | "tibio"
  | "caliente"
  | "ok"
  | "neutral"
  | "outline";

const tones: Record<ChipTone, string> = {
  frio: "bg-cream/20 border border-cream/55 text-cream",
  tibio: "bg-orange text-ink",
  caliente: "bg-red text-cream",
  ok: "bg-leaf/85 text-ink",
  neutral: "bg-cream/15 text-cream",
  outline: "border border-cream/55 text-cream-dim",
};

export function Chip({
  tone = "neutral",
  children,
  className,
}: {
  tone?: ChipTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-pill px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.08em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
