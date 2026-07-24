import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { requireAccess } from "@/lib/auth/dal";

export default async function ReportesPage() {
  await requireAccess("/reportes");
  return (
    <SectionPlaceholder
      title="Reportes & Analítica"
      phase="Fase 10"
      description="KPIs de leads, conversiones por agente/canal, tiempos de cierre y propiedades más demandadas, con filtros avanzados."
    />
  );
}
