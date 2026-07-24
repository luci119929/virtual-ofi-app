import { PageHeader } from "@/components/layout/page-header";
import { Tile } from "@/components/ui/tile";
import { Chip } from "@/components/ui/chip";
import { requireAccess } from "@/lib/auth/dal";
import { roleLabels } from "@/lib/auth/rbac";

/**
 * Panel de control — responde "¿qué hacer ahora?".
 * Los datos son de muestra hasta conectar el backend (Fase 4+).
 */
export default async function PanelPage() {
  const user = await requireAccess("/panel");
  const firstName = user.name.split(" ")[0];

  return (
    <>
      <PageHeader
        title="Panel de control"
        meta={`${roleLabels[user.role]} · ${user.organization.name}`}
      />
      <p className="-mt-2 mb-5 text-[14px] text-cream-dim">
        Hola {firstName} 👋 Esto es lo que necesita tu atención hoy.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile tone="orange" value="12" label="Mensajes pendientes" />
        <Tile tone="red" value="5" label="Tareas de hoy" />
        <Tile tone="red" value="8" label="Nuevos clientes" />
        <Tile tone="soft" value="2.4h" label="Tiempo de respuesta" />
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-card border border-cream/12 bg-maroon/30 p-5">
          <h2 className="mb-3 font-display text-[11px] uppercase tracking-[0.16em] text-orange">
            Oportunidades en riesgo
          </h2>
          <ul className="flex flex-col gap-3">
            <RiskItem
              name="Martina Rossi"
              detail="Lead caliente sin contacto hace 3 días"
              tone="caliente"
              action="Llamar"
            />
            <RiskItem
              name="Pablo Ruiz"
              detail="PH Caballito · sin respuesta hace 2 días"
              tone="caliente"
              action="WhatsApp"
            />
            <RiskItem
              name="Diego Fernández"
              detail="Visita sin feedback cargado"
              tone="tibio"
              action="Cargar feedback"
            />
          </ul>
        </div>

        <div className="rounded-card border border-cream/12 bg-maroon/30 p-5">
          <h2 className="mb-3 font-display text-[11px] uppercase tracking-[0.16em] text-orange">
            Seguimientos de hoy
          </h2>
          <ul className="flex flex-col gap-3 text-[14px]">
            <TaskItem time="10:00" text="Visita — Martina R. · Palermo" />
            <TaskItem time="12:30" text="Llamar a Diego F. · Nordelta" />
            <TaskItem time="16:00" text="Enviar propuesta a Laura G." />
          </ul>
        </div>
      </section>
    </>
  );
}

function RiskItem({
  name,
  detail,
  tone,
  action,
}: {
  name: string;
  detail: string;
  tone: "caliente" | "tibio";
  action: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-cream/10 bg-ink/30 px-3.5 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-[14px] font-bold">{name}</span>
          <Chip tone={tone}>{tone}</Chip>
        </div>
        <p className="mt-1 truncate text-[12px] text-cream-dim">{detail}</p>
      </div>
      <span className="shrink-0 font-display text-[11px] uppercase tracking-[0.1em] text-orange">
        {action}
      </span>
    </li>
  );
}

function TaskItem({ time, text }: { time: string; text: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-cream/10 bg-ink/30 px-3.5 py-3">
      <span className="font-display text-[13px] font-bold text-orange">
        {time}
      </span>
      <span>{text}</span>
    </li>
  );
}
