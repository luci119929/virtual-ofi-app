import { cn } from "@/lib/cn";

type LogoProps = {
  /** "stacked" apila VIRTUAL / OFI · "inline" en una línea */
  variant?: "stacked" | "inline";
  className?: string;
};

/**
 * Marca Virtual Ofi. El cuadrado tipo cursor después de "OFI"
 * es el isotipo característico de las pantallas de referencia.
 */
export function Logo({ variant = "inline", className }: LogoProps) {
  return (
    <span
      className={cn(
        "font-display font-extrabold uppercase leading-none tracking-[0.02em] text-cream",
        className,
      )}
    >
      {variant === "stacked" ? (
        <>
          VIRTUAL
          <br />
          OFI
        </>
      ) : (
        <>VIRTUAL OFI</>
      )}
      <span
        aria-hidden
        className="ml-[0.1em] inline-block h-[0.34em] w-[0.34em] -translate-y-[0.32em] bg-cream"
        style={{ clipPath: "polygon(0 0,100% 45%,55% 55%,45% 100%)" }}
      />
    </span>
  );
}
