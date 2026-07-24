import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { DealForm } from "@/components/pipeline/deal-form";
import { requireAccess } from "@/lib/auth/dal";
import { createDeal } from "@/lib/deals/actions";
import { getClientOptions, getPropertyOptions } from "@/lib/deals/queries";

const WRITE_ROLES = ["ADMIN", "SUPERVISOR", "AGENT"];

export default async function NuevaOportunidadPage() {
  const user = await requireAccess("/pipeline");
  if (!WRITE_ROLES.includes(user.role)) redirect("/pipeline");

  const [clients, properties] = await Promise.all([
    getClientOptions(user.orgId),
    getPropertyOptions(user.orgId),
  ]);

  if (!clients.length) {
    return (
      <>
        <PageHeader title="Nueva oportunidad" meta="Pipeline" />
        <div className="rounded-card border border-dashed border-cream/20 bg-maroon/20 p-8 text-center">
          <p className="text-[14px] text-cream-dim">
            Necesitás al menos un cliente para crear una oportunidad.
          </p>
          <Link
            href="/clientes/nuevo"
            className="mt-3 inline-block font-display text-[12px] uppercase tracking-[0.14em] text-orange"
          >
            Crear un cliente →
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Nueva oportunidad" meta="Pipeline" />
      <DealForm
        action={createDeal}
        submitLabel="Crear oportunidad"
        clientOptions={clients.map((c) => ({ id: c.id, label: c.name }))}
        propertyOptions={properties.map((p) => ({ id: p.id, label: p.title }))}
      />
    </>
  );
}
