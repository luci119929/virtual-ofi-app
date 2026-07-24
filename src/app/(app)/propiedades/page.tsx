import Link from "next/link";
import type { PropertyStatus } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/propiedades/property-card";
import { requireAccess } from "@/lib/auth/dal";
import { listProperties, countByStatus } from "@/lib/properties/queries";
import { statusLabels, statusValues } from "@/lib/properties/labels";
import { cn } from "@/lib/cn";

const WRITE_ROLES = ["ADMIN", "SUPERVISOR", "AGENT"];

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const user = await requireAccess("/propiedades");
  const { estado } = await searchParams;

  const activeStatus = statusValues.includes(estado as PropertyStatus)
    ? (estado as PropertyStatus)
    : undefined;

  const [properties, counts] = await Promise.all([
    listProperties(user.orgId, { status: activeStatus }),
    countByStatus(user.orgId),
  ]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const canWrite = WRITE_ROLES.includes(user.role);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader title="Propiedades" className="mb-0" />
        {canWrite ? (
          <Button href="/propiedades/nueva" size="sm" className="w-auto">
            + Nueva propiedad
          </Button>
        ) : null}
      </div>

      {/* Filtros por estado */}
      <div className="mb-5 mt-4 flex flex-wrap gap-2">
        <FilterPill href="/propiedades" active={!activeStatus} label={`Todas (${total})`} />
        {statusValues.map((s) =>
          counts[s] ? (
            <FilterPill
              key={s}
              href={`/propiedades?estado=${s}`}
              active={activeStatus === s}
              label={`${statusLabels[s]} (${counts[s]})`}
            />
          ) : null,
        )}
      </div>

      {properties.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-card border border-dashed border-cream/20 bg-maroon/20 px-8 py-12 text-center">
          <p className="text-[14px] text-cream-dim">
            {activeStatus
              ? "No hay propiedades en este estado."
              : "Todavía no cargaste ninguna propiedad."}
          </p>
          {canWrite && !activeStatus ? (
            <Link
              href="/propiedades/nueva"
              className="mt-3 font-display text-[12px] uppercase tracking-[0.14em] text-orange"
            >
              Cargar la primera →
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
