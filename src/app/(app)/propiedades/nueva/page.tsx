import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { PropertyForm } from "@/components/propiedades/property-form";
import { requireAccess } from "@/lib/auth/dal";
import { createProperty } from "@/lib/properties/actions";

const WRITE_ROLES = ["ADMIN", "SUPERVISOR", "AGENT"];

export default async function NuevaPropiedadPage() {
  const user = await requireAccess("/propiedades");
  if (!WRITE_ROLES.includes(user.role)) redirect("/propiedades");

  return (
    <>
      <PageHeader title="Nueva propiedad" meta="Propiedades" />
      <PropertyForm action={createProperty} submitLabel="Crear propiedad" />
    </>
  );
}
