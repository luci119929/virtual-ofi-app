"use client";

import type { DealStage } from "@prisma/client";
import { moveDealStage } from "@/lib/deals/actions";
import { stageLabels, stageOrder } from "@/lib/deals/labels";

/** Selector compacto para mover una oportunidad de etapa (registra el movimiento). */
export function MoveControl({
  dealId,
  current,
}: {
  dealId: string;
  current: DealStage;
}) {
  return (
    <form action={moveDealStage.bind(null, dealId)}>
      <label className="sr-only">Mover etapa</label>
      <select
        name="stage"
        defaultValue={current}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="w-full rounded-pill border-0 bg-cream/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.04em] text-maroon"
      >
        {stageOrder.map((s) => (
          <option key={s} value={s}>
            {stageLabels[s]}
          </option>
        ))}
      </select>
    </form>
  );
}
