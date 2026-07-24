import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { requireAccess } from "@/lib/auth/dal";

export default async function PipelinePage() {
  await requireAccess("/pipeline");
  return (
    <SectionPlaceholder
      title="Pipeline comercial"
      phase="Fase 5"
      description="Tablero Kanban desde 'Nuevo lead' hasta 'Operación cerrada' o 'Perdido', registrando cada movimiento y su responsable."
    />
  );
}
