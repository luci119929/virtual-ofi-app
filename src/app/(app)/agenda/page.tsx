import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { requireAccess } from "@/lib/auth/dal";

export default async function AgendaPage() {
  await requireAccess("/agenda");
  return (
    <SectionPlaceholder
      title="Agenda & Visitas"
      phase="Fase 7"
      description="Sistema de reservas sin conflictos de horario, con asignación de agente/cliente y feedback obligatorio post-visita (asistencia, interés, próximos pasos)."
    />
  );
}
