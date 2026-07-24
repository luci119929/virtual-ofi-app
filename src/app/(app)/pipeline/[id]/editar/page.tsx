import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import {
  DealForm,
  type DealFormValues,
} from "@/components/pipeline/deal-form";
import { requireAccess } from "@/lib/auth/dal";
import {
  getDeal,
  getClientOptions,
  getPropertyOptions,
} from "@/lib/deals/queries";
import { updateDeal } from "@/lib/deals/actions";

const WRITE_ROLES = ["ADMIN", "SUPERVISOR", "AGENT"];

export default async function EditarOportunidadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAccess("/pipeline");
  if (!WRITE_ROLES.includes(user.role)) redirect("/pipeline");

  const { id } = await params;
  const [deal, clients, properties] = await Promise.all([
    getDeal(user.orgId, id),
    getClientOptions(user.orgId),
    getPropertyOptions(user.orgId),
  ]);
  if (!deal) notFound();

  const initial: DealFormValues = {
    id: deal.id,
    clientId: deal.client.id,
    propertyId: deal.property?.id ?? "",
    stage: deal.stage,
    value: deal.value !== null ? String(Number(deal.value)) : undefined,
    currency: deal.currency,
    lostReason: deal.lostReason ?? undefined,
  };

  return (
    <>
      <PageHeader title="Editar oportunidad" meta={deal.client.name} />
      <DealForm
        action={updateDeal}
        initial={initial}
        submitLabel="Guardar cambios"
        clientOptions={clients.map((c) => ({ id: c.id, label: c.name }))}
        propertyOptions={properties.map((p) => ({ id: p.id, label: p.title }))}
      />
    </>
  );
}
