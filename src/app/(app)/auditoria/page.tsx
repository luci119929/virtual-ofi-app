import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { requireAccess } from "@/lib/auth/dal";

export default async function AuditoriaPage() {
  await requireAccess("/auditoria");
  return (
    <SectionPlaceholder
      title="Auditoría"
      phase="Fase 10"
      description="Registro inmutable de acciones críticas: quién, cuándo y qué valor cambió."
    />
  );
}
