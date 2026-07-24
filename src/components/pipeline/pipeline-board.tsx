import type { DealStage, InterestLevel } from "@prisma/client";
import { DealCard } from "./deal-card";
import { stageLabels, stageOrder } from "@/lib/deals/labels";

type BoardDeal = {
  id: string;
  stage: DealStage;
  value: unknown;
  currency: string;
  client: { name: string; interestLevel: InterestLevel };
  property: { title: string } | null;
  agent: { name: string } | null;
};

/** Tablero Kanban: una columna por etapa, con scroll horizontal. */
export function PipelineBoard({ deals }: { deals: BoardDeal[] }) {
  const byStage = new Map<DealStage, BoardDeal[]>();
  for (const s of stageOrder) byStage.set(s, []);
  for (const d of deals) byStage.get(d.stage)?.push(d);

  return (
    <div className="overflow-x-auto pb-3">
      <div className="flex min-w-max gap-4">
        {stageOrder.map((stage) => {
          const items = byStage.get(stage) ?? [];
          return (
            <div
              key={stage}
              className="flex w-[220px] shrink-0 flex-col rounded-card border border-cream/10 bg-ink/40 p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-[10px] uppercase tracking-[0.12em] text-cream-dim">
                  {stageLabels[stage]}
                </h2>
                <span className="font-display text-[11px] font-bold tabular-nums text-cream">
                  {items.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {items.length ? (
                  items.map((d) => <DealCard key={d.id} deal={d} />)
                ) : (
                  <p className="rounded-xl border border-dashed border-cream/12 px-3 py-4 text-center text-[11px] text-cream-dim/60">
                    Vacío
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
