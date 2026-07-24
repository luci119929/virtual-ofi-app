import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { requireAccess } from "@/lib/auth/dal";

export default async function AsistentePage() {
  await requireAccess("/asistente");
  return (
    <SectionPlaceholder
      title="Asistente IA"
      phase="Fase 9"
      description="Capa de inteligencia sobre datos reales: resume historiales, sugiere próximos pasos, redacta mensajes y analiza estancamientos. No inventa datos."
    />
  );
}
