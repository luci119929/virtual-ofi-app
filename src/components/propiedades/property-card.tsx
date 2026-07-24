import Link from "next/link";
import Image from "next/image";
import type { OperationType, PropertyStatus } from "@prisma/client";
import { StatusBadge } from "./status-badge";
import { operationLabels, type PropertyFeatures } from "@/lib/properties/labels";
import { formatPrice } from "@/lib/format";

type CardProperty = {
  id: string;
  title: string;
  operation: OperationType;
  status: PropertyStatus;
  price: unknown;
  currency: string;
  city: string | null;
  features: unknown;
  media: { url: string }[];
};

export function PropertyCard({ property }: { property: CardProperty }) {
  const f = (property.features ?? {}) as PropertyFeatures;
  const cover = property.media[0]?.url;
  const specs = [
    f.ambientes ? `${f.ambientes} amb` : null,
    f.superficie ? `${f.superficie} m²` : null,
    f.banos ? `${f.banos} baño${f.banos > 1 ? "s" : ""}` : null,
  ].filter(Boolean);

  return (
    <Link
      href={`/propiedades/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-card border border-cream/12 bg-maroon/30 transition-colors hover:border-cream/30"
    >
      <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-orange to-red">
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover"
            unoptimized
          />
        ) : null}
        <div className="absolute right-2 top-2">
          <StatusBadge status={property.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="font-display text-[10px] uppercase tracking-[0.12em] text-cream-dim">
          {operationLabels[property.operation]}
          {property.city ? ` · ${property.city}` : ""}
        </span>
        <h3 className="text-[15px] font-bold leading-tight text-cream">
          {property.title}
        </h3>
        <p className="font-display text-[15px] font-extrabold text-orange">
          {formatPrice(property.price as number | null, property.currency)}
        </p>
        {specs.length ? (
          <p className="mt-1 text-[12px] text-cream-dim">{specs.join(" · ")}</p>
        ) : null}
      </div>
    </Link>
  );
}
