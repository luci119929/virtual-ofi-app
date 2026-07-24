import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { PipelineBoard } from "@/components/pipeline/pipeline-board";
import { requireAccess } from "@/lib/auth/dal";
import { listDeals } from "@/lib/deals/queries";
import { formatPrice } from "@/lib/format";

export default async function PipelinePage() {
  const user = await requireAccess("/pipeline");
  const deals = await listDeals(user.orgId);

  // Valor de oportunidades abiertas (no cerradas ni perdidas)
  const openValue = deals
    .filter((d) => d.stage !== "CERRADO" && d.stage !== "PERDIDO")
    .reduce((sum, d) => sum + (d.value ? Number(d.value) : 0), 0);
  const won = deals.filter((d) => d.stage === "CERRADO").length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader
          title="Pipeline comercial"
          meta={`${deals.length} oportunidades · ${won} cerradas`}
          className="mb-0"
        />
        <Button href="/pipeline/nueva" size="sm" className="w-auto">
          + Nueva oportunidad
        </Button>
      </div>

      <p className="mb-5 mt-1 text-[13px] text-cream-dim">
        En juego (abiertas):{" "}
        <span className="font-display font-bold text-orange">
          {formatPrice(openValue)}
        </span>
      </p>

      {deals.length ? (
        <PipelineBoard deals={deals} />
      ) : (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-card border border-dashed border-cream/20 bg-maroon/20 px-8 py-12 text-center">
          <p className="text-[14px] text-cream-dim">
            Todavía no hay oportunidades en el pipeline.
          </p>
          <Link
            href="/pipeline/nueva"
            className="mt-3 font-display text-[12px] uppercase tracking-[0.14em] text-orange"
          >
            Crear la primera →
          </Link>
        </div>
      )}
    </>
  );
}
