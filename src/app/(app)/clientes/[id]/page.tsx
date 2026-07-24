import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { InterestBadge } from "@/components/clientes/interest-badge";
import { InteractionForm } from "@/components/clientes/interaction-form";
import { DeleteClientButton } from "@/components/clientes/delete-button";
import { requireAccess } from "@/lib/auth/dal";
import { getClient } from "@/lib/clients/queries";
import { formatPrice, formatDate } from "@/lib/format";
import {
  sourceLabels,
  channelLabels,
  reqOperationLabels,
  type ClientRequirements,
} from "@/lib/clients/labels";

const WRITE_ROLES = ["ADMIN", "SUPERVISOR", "AGENT"];
const DELETE_ROLES = ["ADMIN", "SUPERVISOR"];

export default async function ClienteDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAccess("/clientes");
  const { id } = await params;
  const client = await getClient(user.orgId, id);
  if (!client) notFound();

  const req = (client.requirements ?? {}) as ClientRequirements;
  const canWrite = WRITE_ROLES.includes(user.role);
  const canDelete = DELETE_ROLES.includes(user.role);

  const budget =
    req.presupuestoMin || req.presupuestoMax
      ? `${req.presupuestoMin ? formatPrice(req.presupuestoMin) : "…"} – ${
          req.presupuestoMax ? formatPrice(req.presupuestoMax) : "…"
        }`
      : null;

  const wants: { label: string; value: string }[] = [];
  if (req.operacion) wants.push({ label: "Operación", value: reqOperationLabels[req.operacion] });
  if (req.tipo) wants.push({ label: "Tipo", value: req.tipo });
  if (req.zona) wants.push({ label: "Zona", value: req.zona });
  if (budget) wants.push({ label: "Presupuesto", value: budget });
  if (req.ambientes) wants.push({ label: "Ambientes", value: String(req.ambientes) });
  if (req.dormitorios) wants.push({ label: "Dormitorios", value: String(req.dormitorios) });

  return (
    <>
      <div className="mb-4">
        <Link
          href="/clientes"
          className="font-display text-[11px] uppercase tracking-[0.14em] text-cream-dim hover:text-cream"
        >
          ← Clientes
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title={client.name}
          meta={`${sourceLabels[client.source]}${client.phone ? ` · ${client.phone}` : ""}`}
          className="mb-0"
        />
        <InterestBadge level={client.interestLevel} score={client.score} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-5">
          {/* Interés automático */}
          <div className="rounded-card border border-cream/12 bg-maroon/25 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[11px] uppercase tracking-[0.16em] text-orange">
                Nivel de interés
              </h2>
              <InterestBadge level={client.interestLevel} score={client.score} />
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-pill bg-cream/15">
              <div
                className="h-full bg-gradient-to-r from-orange to-red"
                style={{ width: `${client.score}%` }}
              />
            </div>
            <p className="mt-2 text-[12px] text-cream-dim">
              Calculado automáticamente según comportamiento: comunicaciones,
              recencia del contacto, visitas y necesidades declaradas. Registrá
              una interacción y el nivel se actualiza solo.
            </p>
          </div>

          {/* Necesidades */}
          <div className="rounded-card border border-cream/12 bg-maroon/25 p-5">
            <h2 className="mb-4 font-display text-[11px] uppercase tracking-[0.16em] text-orange">
              ¿Qué busca?
            </h2>
            {wants.length ? (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                {wants.map((w) => (
                  <div key={w.label}>
                    <dt className="text-[11px] uppercase tracking-[0.04em] text-cream-dim">
                      {w.label}
                    </dt>
                    <dd className="text-[15px] font-bold text-cream">{w.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-[13px] text-cream-dim">Sin necesidades cargadas.</p>
            )}
            {req.notas ? (
              <p className="mt-4 border-t border-cream/10 pt-3 text-[13px] text-cream-dim">
                {req.notas}
              </p>
            ) : null}
          </div>

          {/* Historial de comunicaciones */}
          <div className="rounded-card border border-cream/12 bg-maroon/25 p-5">
            <h2 className="mb-4 font-display text-[11px] uppercase tracking-[0.16em] text-orange">
              Comunicaciones
            </h2>
            {client.communications.length ? (
              <ul className="flex flex-col gap-3">
                {client.communications.map((c) => (
                  <li key={c.id} className="flex gap-3 text-[13px]">
                    <span
                      aria-hidden
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange"
                    />
                    <div className="min-w-0">
                      <p className="text-cream">
                        <span className="font-bold">
                          {channelLabels[c.channel]}
                        </span>
                        {" — "}
                        {c.content}
                      </p>
                      <p className="text-[11px] text-cream-dim">
                        {formatDate(c.createdAt)}
                        {c.user ? ` · ${c.user.name}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-cream-dim">
                Sin comunicaciones registradas.
              </p>
            )}
          </div>
        </div>

        {/* Columna lateral */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-card border border-cream/12 bg-maroon/25 p-5">
            <p className="text-[11px] uppercase tracking-[0.04em] text-cream-dim">
              Agente asignado
            </p>
            <p className="text-[15px] font-bold text-cream">
              {client.agent?.name ?? "Sin asignar"}
            </p>
            {client.email ? (
              <p className="mt-2 text-[13px] text-cream-dim">{client.email}</p>
            ) : null}
          </div>

          {canWrite ? (
            <div className="rounded-card border border-cream/12 bg-maroon/25 p-5">
              <h2 className="mb-3 font-display text-[11px] uppercase tracking-[0.16em] text-orange">
                Registrar interacción
              </h2>
              <InteractionForm clientId={client.id} />
            </div>
          ) : null}

          {canWrite ? (
            <div className="flex flex-col gap-3 rounded-card border border-cream/12 bg-maroon/25 p-5">
              <Button href={`/clientes/${client.id}/editar`} size="sm">
                Editar
              </Button>
              {canDelete ? <DeleteClientButton id={client.id} /> : null}
            </div>
          ) : null}
        </aside>
      </div>
    </>
  );
}
