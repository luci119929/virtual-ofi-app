import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { requireAccess } from "@/lib/auth/dal";

export default async function PropiedadesPage() {
  await requireAccess("/propiedades");
  return (
    <SectionPlaceholder
      title="Propiedades"
      phase="Fase 3"
      description="Catálogo de propiedades con fichas completas (ubicación, precio, multimedia, características), control de estados e historial de cambios."
    />
  );
}
