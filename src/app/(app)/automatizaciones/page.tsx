import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { requireAccess } from "@/lib/auth/dal";

export default async function AutomatizacionesPage() {
  await requireAccess("/automatizaciones");
  return (
    <SectionPlaceholder
      title="Automatizaciones"
      phase="Fase 8"
      description="Reglas 'SI / ENTONCES' configurables desde el panel (ej. si entra lead → asignar agente; si baja el precio → avisar interesados)."
    />
  );
}
