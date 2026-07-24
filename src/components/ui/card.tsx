import { cn } from "@/lib/cn";

type CardProps = {
  title?: string;
  className?: string;
  children: React.ReactNode;
};

/** Card con borde crema de 2px, tal como las pantallas de auth. */
export function Card({ title, className, children }: CardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border-2 border-cream bg-maroon/35",
        className,
      )}
    >
      {title ? (
        <div className="border-b-2 border-cream px-4 py-3 text-center text-[15px] font-extrabold uppercase tracking-[0.03em] text-cream">
          {title}
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </div>
  );
}
