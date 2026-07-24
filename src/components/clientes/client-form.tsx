"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { TextareaField } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ClientFormState } from "@/lib/clients/actions";
import { sourceLabels, sourceValues } from "@/lib/clients/labels";

export type ClientFormValues = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  operacion?: string;
  tipo?: string;
  zona?: string;
  presupuestoMin?: string;
  presupuestoMax?: string;
  ambientes?: string;
  dormitorios?: string;
  notas?: string;
};

const sourceOptions = sourceValues.map((v) => ({
  value: v,
  label: sourceLabels[v],
}));
const operacionOptions = [
  { value: "", label: "—" },
  { value: "VENTA", label: "Venta" },
  { value: "ALQUILER", label: "Alquiler" },
  { value: "TEMPORAL", label: "Temporario" },
];

type Action = (
  state: ClientFormState,
  formData: FormData,
) => Promise<ClientFormState>;

export function ClientForm({
  action,
  initial = {},
  submitLabel,
}: {
  action: Action;
  initial?: ClientFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<
    ClientFormState,
    FormData
  >(action, {});
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      <section className="rounded-card border border-cream/12 bg-maroon/25 p-5">
        <h2 className="mb-4 font-display text-[11px] uppercase tracking-[0.16em] text-orange">
          Contacto
        </h2>
        <div className="flex flex-col gap-4">
          <Field
            label="Nombre"
            name="name"
            defaultValue={initial.name}
            placeholder="Nombre y apellido"
            error={fe.name?.[0]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Teléfono"
              name="phone"
              defaultValue={initial.phone}
              placeholder="+54 9 11 …"
            />
            <Field
              label="Mail"
              name="email"
              type="email"
              defaultValue={initial.email}
              placeholder="cliente@correo.com"
              error={fe.email?.[0]}
            />
          </div>
          <SelectField
            label="Canal de ingreso"
            name="source"
            options={sourceOptions}
            defaultValue={initial.source ?? "MANUAL"}
          />
        </div>
      </section>

      <section className="rounded-card border border-cream/12 bg-maroon/25 p-5">
        <h2 className="mb-4 font-display text-[11px] uppercase tracking-[0.16em] text-orange">
          ¿Qué busca?
        </h2>
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <SelectField
              label="Operación"
              name="operacion"
              options={operacionOptions}
              defaultValue={initial.operacion ?? ""}
            />
            <Field
              label="Tipo"
              name="tipo"
              defaultValue={initial.tipo}
              placeholder="Depto, casa, PH…"
            />
            <Field
              label="Zona"
              name="zona"
              defaultValue={initial.zona}
              placeholder="Palermo, Zona norte…"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="Presup. mín" name="presupuestoMin" type="number" min="0" defaultValue={initial.presupuestoMin} />
            <Field label="Presup. máx" name="presupuestoMax" type="number" min="0" defaultValue={initial.presupuestoMax} />
            <Field label="Ambientes" name="ambientes" type="number" min="0" defaultValue={initial.ambientes} />
            <Field label="Dormitorios" name="dormitorios" type="number" min="0" defaultValue={initial.dormitorios} />
          </div>
          <TextareaField
            label="Notas"
            name="notas"
            defaultValue={initial.notas}
            placeholder="Detalles, preferencias, contexto…"
          />
        </div>
      </section>

      {state.error ? (
        <p
          role="alert"
          className="rounded-pill bg-red/20 px-4 py-2 text-center text-[13px] font-medium text-cream"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? "Guardando…" : submitLabel}
        </Button>
        <Button href="/clientes" variant="ghost" className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
}
