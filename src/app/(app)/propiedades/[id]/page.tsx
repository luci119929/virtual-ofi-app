import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/propiedades/status-badge";
import { StatusControl } from "@/components/propiedades/status-control";
import { HistoryList } from "@/components/propiedades/history-list";
import { DeletePropertyButton } from "@/components/propiedades/delete-button";
import { requireAccess } from "@/lib/auth/dal";
import { getProperty } from "@/lib/properties/queries";
import { formatPrice } from "@/lib/format";
import {
  operationLabels,
  featureLabels,
  type PropertyFeatures,
} from "@/lib/properties/labels";

const WRITE_ROLES = ["ADMIN", "SUPERVISOR", "AGENT"];
const DELETE_ROLES = ["ADMIN", "SUPERVISOR"];

export default async function PropiedadDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAccess("/propiedades");
  const { id } = await params;
  const property = await getProperty(user.orgId, id);
  if (!property) notFound();

  const f = (property.features ?? {}) as PropertyFeatures;
  const canWrite = WRITE_ROLES.includes(user.role);
  const canDelete = DELETE_ROLES.includes(user.role);

  const specs: { label: string; value: string }[] = [];
  if (f.dormitorios !== undefined)
    specs.push({ label: featureLabels.dormitorios, value: String(f.dormitorios) });
  if (f.ambientes !== undefined)
    specs.push({ label: featureLabels.ambientes, value: String(f.ambientes) });
  if (f.superficie !== undefined)
    specs.push({ label: featureLabels.superficie, value: `${f.superficie} m²` });
  if (f.banos !== undefined)
    specs.push({ label: featureLabels.banos, value: String(f.banos) });
  if (f.expensas !== undefined)
    specs.push({ label: featureLabels.expensas, value: formatPrice(f.expensas, property.currency) });
  specs.push({ label: featureLabels.cochera, value: f.cochera ? "Sí" : "No" });

  return (
    <>
      <div className="mb-4">
        <Link
          href="/propiedades"
          className="font-display text-[11px] uppercase tracking-[0.14em] text-cream-dim hover:text-cream"
        >
          ← Propiedades
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title={property.title}
          meta={`${operationLabels[property.operation]}${property.city ? ` · ${property.city}` : ""}`}
          className="mb-0"
        />
        <StatusBadge status={property.status} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Columna principal */}
        <div className="flex flex-col gap-5">
          {/* Galería */}
          <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-card">
            {property.media.length ? (
              property.media.slice(0, 4).map((m, i) => (
                <div
                  key={m.id}
                  className={`relative h-40 ${property.media.length === 1 ? "col-span-2" : i === 0 ? "col-span-2" : ""}`}
                >
                  <Image
                    src={m.url}
                    alt={`${property.title} ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))
            ) : (
              <div className="col-span-2 h-44 rounded-card bg-gradient-to-br from-orange to-red" />
            )}
          </div>

          <div className="rounded-card border border-cream/12 bg-maroon/25 p-5">
            <p className="font-display text-[22px] font-extrabold text-orange">
              {formatPrice(property.price as number | null, property.currency)}
            </p>
            {property.address ? (
              <p className="mt-1 text-[14px] text-cream-dim">
                {property.address}
                {property.city ? `, ${property.city}` : ""}
              </p>
            ) : null}
          </div>

          {/* Características */}
          <div className="rounded-card border border-cream/12 bg-maroon/25 p-5">
            <h2 className="mb-4 font-display text-[11px] uppercase tracking-[0.16em] text-orange">
              Características
            </h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
              {specs.map((s) => (
                <div key={s.label}>
                  <dt className="text-[11px] uppercase tracking-[0.04em] text-cream-dim">
                    {s.label}
                  </dt>
                  <dd className="text-[15px] font-bold text-cream">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Historial */}
          <div className="rounded-card border border-cream/12 bg-maroon/25 p-5">
            <h2 className="mb-4 font-display text-[11px] uppercase tracking-[0.16em] text-orange">
              Historial de cambios
            </h2>
            <HistoryList entries={property.history} />
          </div>
        </div>

        {/* Columna lateral */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-card border border-cream/12 bg-maroon/25 p-5">
            <p className="text-[11px] uppercase tracking-[0.04em] text-cream-dim">
              Agente asignado
            </p>
            <p className="text-[15px] font-bold text-cream">
              {property.agent?.name ?? "Sin asignar"}
            </p>
          </div>

          {canWrite ? (
            <div className="flex flex-col gap-3 rounded-card border border-cream/12 bg-maroon/25 p-5">
              <StatusControl propertyId={property.id} current={property.status} />
              <Button href={`/propiedades/${property.id}/editar`} size="sm">
                Editar
              </Button>
              {canDelete ? <DeletePropertyButton id={property.id} /> : null}
            </div>
          ) : null}
        </aside>
      </div>
    </>
  );
}
