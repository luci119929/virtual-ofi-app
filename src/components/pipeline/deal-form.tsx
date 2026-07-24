"use client";

import { useActionState } from "react";
import { SelectField } from "@/components/ui/select";
import { Field } from "@/components/ui/input";
import { TextareaField } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { DealFormState } from "@/lib/deals/actions";
import { stageLabels, stageOrder } from "@/lib/deals/labels";

export type DealFormValues = {
  id?: string;
  clientId?: string;
  propertyId?: string;
  stage?: string;
  value?: string;
  currency?: string;
  lostReason?: string;
};

type Option = { id: string; label: string };

const stageOptions = stageOrder.map((s) => ({ value: s, label: stageLabels[s] }));
const currencyOptions = [
  { value: "USD", label: "USD" },
  { value: "ARS", label: "ARS" },
];

type Action = (
  state: DealFormState,
  formData: FormData,
) => Promise<DealFormState>;

export function DealForm({
  action,
  initial = {},
  submitLabel,
  clientOptions,
  propertyOptions,
}: {
  action: Action;
  initial?: DealFormValues;
  submitLabel: string;
  clientOptions: Option[];
  propertyOptions: Option[];
}) {
  const [state, formAction, pending] = useActionState<DealFormState, FormData>(
    action,
    {},
  );
  const fe = state.fieldErrors ?? {};

  const clientOpts = clientOptions.map((c) => ({ value: c.id, label: c.label }));
  const propertyOpts = [
    { value: "", label: "— Sin propiedad —" },
    ...propertyOptions.map((p) => ({ value: p.id, label: p.label })),
  ];

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      <section className="rounded-card border border-cream/12 bg-maroon/25 p-5">
        <h2 className="mb-4 font-display text-[11px] uppercase tracking-[0.16em] text-orange">
          Oportunidad
        </h2>
        <div className="flex flex-col gap-4">
          <SelectField
            label="Cliente"
            name="clientId"
            options={clientOpts}
            defaultValue={initial.clientId}
            error={fe.clientId?.[0]}
          />
          <SelectField
            label="Propiedad (opcional)"
            name="propertyId"
            options={propertyOpts}
            defaultValue={initial.propertyId ?? ""}
          />
          <SelectField
            label="Etapa"
            name="stage"
            options={stageOptions}
            defaultValue={initial.stage ?? "NUEVO"}
          />
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <Field
              label="Valor estimado"
              name="value"
              type="number"
              min="0"
              defaultValue={initial.value}
              placeholder="185000"
            />
            <SelectField
              label="Moneda"
              name="currency"
              options={currencyOptions}
              defaultValue={initial.currency ?? "USD"}
            />
          </div>
          <TextareaField
            label="Motivo (si se pierde)"
            name="lostReason"
            defaultValue={initial.lostReason}
            placeholder="Sólo aplica si la etapa es Perdido."
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
        <Button href="/pipeline" variant="ghost" className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
}
