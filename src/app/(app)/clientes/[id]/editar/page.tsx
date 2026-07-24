import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import {
  ClientForm,
  type ClientFormValues,
} from "@/components/clientes/client-form";
import { requireAccess } from "@/lib/auth/dal";
import { getClient } from "@/lib/clients/queries";
import { updateClient } from "@/lib/clients/actions";
import type { ClientRequirements } from "@/lib/clients/labels";

const WRITE_ROLES = ["ADMIN", "SUPERVISOR", "AGENT"];

const numToStr = (n?: number) => (n === undefined ? undefined : String(n));

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAccess("/clientes");
  if (!WRITE_ROLES.includes(user.role)) redirect("/clientes");

  const { id } = await params;
  const client = await getClient(user.orgId, id);
  if (!client) notFound();

  const req = (client.requirements ?? {}) as ClientRequirements;

  const initial: ClientFormValues = {
    id: client.id,
    name: client.name,
    email: client.email ?? undefined,
    phone: client.phone ?? undefined,
    source: client.source,
    operacion: req.operacion,
    tipo: req.tipo,
    zona: req.zona,
    presupuestoMin: numToStr(req.presupuestoMin),
    presupuestoMax: numToStr(req.presupuestoMax),
    ambientes: numToStr(req.ambientes),
    dormitorios: numToStr(req.dormitorios),
    notas: req.notas,
  };

  return (
    <>
      <PageHeader title="Editar cliente" meta={client.name} />
      <ClientForm
        action={updateClient}
        initial={initial}
        submitLabel="Guardar cambios"
      />
    </>
  );
}
