import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ClientForm } from "@/components/clientes/client-form";
import { requireAccess } from "@/lib/auth/dal";
import { createClient } from "@/lib/clients/actions";

const WRITE_ROLES = ["ADMIN", "SUPERVISOR", "AGENT"];

export default async function NuevoClientePage() {
  const user = await requireAccess("/clientes");
  if (!WRITE_ROLES.includes(user.role)) redirect("/clientes");

  return (
    <>
      <PageHeader title="Nuevo cliente" meta="Clientes" />
      <ClientForm action={createClient} submitLabel="Crear cliente" />
    </>
  );
}
