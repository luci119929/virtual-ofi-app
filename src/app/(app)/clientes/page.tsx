import Link from "next/link";
import type { InterestLevel } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { InterestBadge } from "@/components/clientes/interest-badge";
import { requireAccess } from "@/lib/auth/dal";
import { listClients, countByInterest } from "@/lib/clients/queries";
import {
  interestLabels,
  interestValues,
  sourceLabels,
  type ClientRequirements,
} from "@/lib/clients/labels";
import { cn } from "@/lib/cn";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ interes?: string }>;
}) {
  const user = await requireAccess("/clientes");
  const { interes } = await searchParams;
  const active = interestValues.includes(interes as InterestLevel)
    ? (interes as InterestLevel)
    : undefined;

  const [clients, counts] = await Promise.all([
    listClients(user.orgId, { interest: active }),
    countByInterest(user.orgId),
  ]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader title="Clientes / Leads" className="mb-0" />
        <Button href="/clientes/nuevo" size="sm" className="w-auto">
          + Nuevo cliente
        </Button>
      </div>

      <div className="mb-5 mt-4 flex flex-wrap gap-2">
        <FilterPill href="/clientes" active={!active} label={`Todos (${total})`} />
        {interestValues.map((lv) =>
          counts[lv] ? (
            <FilterPill
              key={lv}
              href={`/clientes?interes=${lv}`}
              active={active === lv}
              label={`${interestLabels[lv]} (${counts[lv]})`}
            />
          ) : null,
        )}
      </div>

      {clients.length ? (
        <ul className="flex flex-col gap-2">
          {clients.map((c) => {
            const req = (c.requirements ?? {}) as ClientRequirements;
            const wants = [
              req.tipo,
              req.zona,
              req.ambientes ? `${req.ambientes} amb` : null,
            ]
              .filter(Boolean)
              .join(" · ");
            return (
              <li key={c.id}>
                <Link
                  href={`/clientes/${c.id}`}
                  className="flex items-center gap-3 rounded-xl border border-cream/12 bg-maroon/25 px-4 py-3 transition-colors hover:border-cream/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[15px] font-bold text-cream">
                        {c.name}
                      </span>
                      <InterestBadge level={c.interestLevel} score={c.score} />
                    </div>
                    <p className="mt-0.5 truncate text-[12px] text-cream-dim">
                      {sourceLabels[c.source]}
                      {wants ? ` · ${wants}` : ""}
                      {c._count.communications
                        ? ` · ${c._count.communications} contacto${c._count.communications > 1 ? "s" : ""}`
                        : ""}
                    </p>
                  </div>
                  <span className="shrink-0 font-display text-[11px] uppercase tracking-[0.12em] text-cream-dim">
                    {c.phone ?? ""}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-card border border-dashed border-cream/20 bg-maroon/20 px-8 py-12 text-center">
          <p className="text-[14px] text-cream-dim">
            {active
              ? "No hay clientes en este nivel de interés."
              : "Todavía no cargaste ningún cliente."}
          </p>
          {!active ? (
            <Link
              href="/clientes/nuevo"
              className="mt-3 font-display text-[12px] uppercase tracking-[0.14em] text-orange"
            >
              Cargar el primero →
            </Link>
          ) : null}
        </div>
      )}
    </>
  );
}

function FilterPill({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-pill border px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.04em] transition-colors",
        active
          ? "border-cream bg-cream text-maroon"
          : "border-cream/25 text-cream-dim hover:border-cream/50 hover:text-cream",
      )}
    >
      {label}
    </Link>
  );
}
