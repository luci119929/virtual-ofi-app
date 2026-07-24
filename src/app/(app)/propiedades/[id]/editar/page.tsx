import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import {
  PropertyForm,
  type PropertyFormValues,
} from "@/components/propiedades/property-form";
import { requireAccess } from "@/lib/auth/dal";
import { getProperty } from "@/lib/properties/queries";
import { updateProperty } from "@/lib/properties/actions";
import type { PropertyFeatures } from "@/lib/properties/labels";

const WRITE_ROLES = ["ADMIN", "SUPERVISOR", "AGENT"];

const numToStr = (n?: number) => (n === undefined ? undefined : String(n));

export default async function EditarPropiedadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAccess("/propiedades");
  if (!WRITE_ROLES.includes(user.role)) redirect("/propiedades");

  const { id } = await params;
  const property = await getProperty(user.orgId, id);
  if (!property) notFound();

  const f = (property.features ?? {}) as PropertyFeatures;

  const initial: PropertyFormValues = {
    id: property.id,
    title: property.title,
    operation: property.operation,
    status: property.status,
    price:
      property.price !== null ? String(Number(property.price)) : undefined,
    currency: property.currency,
    address: property.address ?? undefined,
    city: property.city ?? undefined,
    dormitorios: numToStr(f.dormitorios),
    ambientes: numToStr(f.ambientes),
    superficie: numToStr(f.superficie),
    banos: numToStr(f.banos),
    expensas: numToStr(f.expensas),
    cochera: Boolean(f.cochera),
    mediaUrls: property.media.map((m) => m.url).join("\n"),
  };

  return (
    <>
      <PageHeader title="Editar propiedad" meta={property.title} />
      <PropertyForm
        action={updateProperty}
        initial={initial}
        submitLabel="Guardar cambios"
      />
    </>
  );
}
