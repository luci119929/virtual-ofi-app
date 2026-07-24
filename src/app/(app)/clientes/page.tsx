import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { requireAccess } from "@/lib/auth/dal";

export default async function ClientesPage() {
  await requireAccess("/clientes");
  return (
    <SectionPlaceholder
      title="Clientes / Leads"
      phase="Fase 4"
      description="Ingreso multicanal (WhatsApp, redes, manual), fichas completas y clasificación automática del nivel de interés (frío, tibio, caliente) según comportamiento."
    />
  );
}
