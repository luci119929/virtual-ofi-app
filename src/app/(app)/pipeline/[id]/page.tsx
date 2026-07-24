import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { InterestBadge } from "@/components/clientes/interest-badge";
import { MoveControl } from "@/components/pipeline/move-control";
import { DeleteDealButton } from "@/components/pipeline/delete-button";
import { requireAccess } from "@/lib/auth/dal";
import { getDeal } from "@/lib/deals/queries";
import { formatPrice, formatDate } from "@/lib/format";
import { stageLabels, stageTone } from "@/lib/deals/labels";

const WRITE_ROLES = ["ADMIN", "SUPERVISOR", "AGENT"];
const DELETE_ROLES = ["ADMIN", "SUPERVISOR"];

export default async function DealDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAccess("/pipeline");
  const { id } = await params;
  const deal = await getDeal(user.orgId, id);
  if (!deal) notFound();

  const canWrite = WRITE_ROLES.includes(user.role);
  const canDelete = DELETE_ROLES.includes(user.role);

  return (
    <>
      <div className="mb-4">
        <Link
          href="/pipeline"
          className="font-display text-[11px] uppercase tracking-[0.14em] text-cream-dim hover:text-cream"
        >
          ← Pipeline
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title={deal.client.name}
          meta={deal.property ? deal.property.title : "Sin propiedad asociada"}
          className="mb-0"
        />
        <Chip tone={stageTone[deal.stage]}>{stageLabels[deal.stage]}</Chip>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-5">
          <div className="rounded-card border border-cream/12 bg-maroon/25 p-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.04em] text-cream-dim">
                  Valor
                </p>
                <p className="font-display text-[18px] font-extrabold text-orange">
                  {formatPrice(deal.value as number | null, deal.currency)}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.04em] text-cream-dim">
                  Cliente
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/clientes/${deal.client.id}`}
                    className="text-[15px] font-bold text-cream hover:underline"
                  >
                    {deal.client.name}
                  </Link>
                  <InterestBadge level={deal.client.interestLevel} />
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.04em] text-cream-dim">
                  Agente
                </p>
                <p className="text-[15px] font-bold text-cream">
                  {deal.agent?.name ?? "Sin asignar"}
                </p>
              </div>
            </div>
            {deal.stage === "PERDIDO" && deal.lostReason ? (
              <p className="mt-4 border-t border-cream/10 pt-3 text-[13px] text-cream-dim">
                <span className="font-bold text-cream">Motivo de pérdida:</span>{" "}
                {deal.lostReason}
              </p>
            ) : null}
          </div>

          {/* Historial de movimientos */}
          <div className="rounded-card border border-cream/12 bg-maroon/25 p-5">
            <h2 className="mb-4 font-display text-[11px] uppercase tracking-[0.16em] text-orange">
              Historial de movimientos
            </h2>
            <ul className="flex flex-col gap-3">
              {deal.history.map((h) => (
                <li key={h.id} className="flex gap-3 text-[13px]">
                  <span
                    aria-hidden
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange"
                  />
                  <div>
                    <p className="text-cream">
                      {h.fromStage ? (
                        <>
                          <span className="text-cream-dim">
                            {stageLabels[h.fromStage]}
                          </span>
                          {" → "}
                        </>
                      ) : (
                        "Creada en "
                      )}
                      <span className="font-bold text-orange">
                        {stageLabels[h.toStage]}
                      </span>
                    </p>
                    <p className="text-[11px] text-cream-dim">
                      {formatDate(h.movedAt)}
                      {h.movedBy ? ` · ${h.movedBy.name}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lateral */}
        {canWrite ? (
          <aside className="flex flex-col gap-4">
            <div className="rounded-card border border-cream/12 bg-maroon/25 p-5">
              <p className="mb-2 font-display text-[11px] uppercase tracking-[0.14em] text-cream-dim">
                Mover etapa
              </p>
              <MoveControl dealId={deal.id} current={deal.stage} />
            </div>
            <div className="flex flex-col gap-3 rounded-card border border-cream/12 bg-maroon/25 p-5">
              <Button href={`/pipeline/${deal.id}/editar`} size="sm">
                Editar
              </Button>
              {canDelete ? <DeleteDealButton id={deal.id} /> : null}
            </div>
          </aside>
        ) : null}
      </div>
    </>
  );
}
