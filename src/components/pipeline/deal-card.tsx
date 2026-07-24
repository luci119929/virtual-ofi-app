import Link from "next/link";
import type { DealStage, InterestLevel } from "@prisma/client";
import { InterestBadge } from "@/components/clientes/interest-badge";
import { MoveControl } from "./move-control";
import { formatPrice } from "@/lib/format";

type CardDeal = {
  id: string;
  stage: DealStage;
  value: unknown;
  currency: string;
  client: { name: string; interestLevel: InterestLevel };
  property: { title: string } | null;
  agent: { name: string } | null;
};

export function DealCard({ deal }: { deal: CardDeal }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-cream/12 bg-maroon/40 p-3">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/pipeline/${deal.id}`}
          className="text-[13px] font-bold leading-tight text-cream hover:underline"
        >
          {deal.client.name}
        </Link>
        <InterestBadge level={deal.client.interestLevel} />
      </div>

      {deal.property ? (
        <p className="truncate text-[11px] text-cream-dim">
          {deal.property.title}
        </p>
      ) : (
        <p className="text-[11px] italic text-cream-dim/70">Sin propiedad</p>
      )}

      {deal.value != null ? (
        <p className="font-display text-[13px] font-extrabold text-orange">
          {formatPrice(deal.value as number, deal.currency)}
        </p>
      ) : null}

      <div className="mt-1">
        <MoveControl dealId={deal.id} current={deal.stage} />
      </div>
    </div>
  );
}
