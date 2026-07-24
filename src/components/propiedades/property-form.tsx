"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { TextareaField } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { PropertyFormState } from "@/lib/properties/actions";
import {
  operationLabels,
  statusLabels,
  operationValues,
  statusValues,
} from "@/lib/properties/labels";

export type PropertyFormValues = {
  id?: string;
  title?: string;
  operation?: string;
  status?: string;
  price?: string;
  currency?: string;
  address?: string;
  city?: string;
  dormitorios?: string;
  ambientes?: string;
  superficie?: string;
  banos?: string;
  expensas?: string;
  cochera?: boolean;
  mediaUrls?: string;
};

const operationOptions = operationValues.map((v) => ({
  value: v,
  label: operationLabels[v],
}));
const statusOptions = statusValues.map((v) => ({
  value: v,
  label: statusLabels[v],
}));
const currencyOptions = [
  { value: "USD", label: "USD" },
  { value: "ARS", label: "ARS" },
];

type Action = (
  state: PropertyFormState,
  formData: FormData,
) => Promise<PropertyFormState>;

export function PropertyForm({
  action,
  initial = {},
  submitLabel,
}: {
  action: Action;
  initial?: PropertyFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<
    PropertyFormState,
    FormData
  >(action, {});
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      <section className="rounded-card border border-cream/12 bg-maroon/25 p-5">
        <h2 className="mb-4 font-display text-[11px] uppercase tracking-[0.16em] text-orange">
          Datos principales
        </h2>
        <div className="flex flex-col gap-4">
          <Field
            label="Título"
            name="title"
            defaultValue={initial.title}
            placeholder="Depto 2 amb · Palermo"
            error={fe.title?.[0]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Operación"
              name="operation"
              options={operationOptions}
              defaultValue={initial.operation ?? "VENTA"}
              error={fe.operation?.[0]}
            />
            <SelectField
              label="Estado"
              name="status"
              options={statusOptions}
              defaultValue={initial.status ?? "BORRADOR"}
              error={fe.status?.[0]}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <Field
              label="Precio"
              name="price"
              type="number"
              min="0"
              step="any"
              inputMode="numeric"
              defaultValue={initial.price}
              placeholder="185000"
              error={fe.price?.[0]}
            />
            <SelectField
              label="Moneda"
              name="currency"
              options={currencyOptions}
              defaultValue={initial.currency ?? "USD"}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Dirección"
              name="address"
              defaultValue={initial.address}
              placeholder="Av. Santa Fe 1234"
            />
            <Field
              label="Ciudad / Zona"
              name="city"
              defaultValue={initial.city}
              placeholder="CABA · Palermo"
            />
          </div>
        </div>
      </section>

      <section className="rounded-card border border-cream/12 bg-maroon/25 p-5">
        <h2 className="mb-4 font-display text-[11px] uppercase tracking-[0.16em] text-orange">
          Características
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Dormitorios" name="dormitorios" type="number" min="0" defaultValue={initial.dormitorios} />
          <Field label="Ambientes" name="ambientes" type="number" min="0" defaultValue={initial.ambientes} />
          <Field label="Superficie (m²)" name="superficie" type="number" min="0" defaultValue={initial.superficie} />
          <Field label="Baños" name="banos" type="number" min="0" defaultValue={initial.banos} />
          <Field label="Expensas" name="expensas" type="number" min="0" defaultValue={initial.expensas} />
          <label className="flex items-center gap-3 self-end rounded-pill bg-cream/10 px-4 py-2.5 text-[13px] font-bold text-cream">
            <input
              type="checkbox"
              name="cochera"
              defaultChecked={initial.cochera}
              className="h-4 w-4 accent-red-bright"
            />
            Cochera
          </label>
        </div>
      </section>

      <section className="rounded-card border border-cream/12 bg-maroon/25 p-5">
        <h2 className="mb-4 font-display text-[11px] uppercase tracking-[0.16em] text-orange">
          Multimedia
        </h2>
        <TextareaField
          label="Fotos (URLs)"
          name="mediaUrls"
          defaultValue={initial.mediaUrls}
          placeholder={"https://…/foto1.jpg\nhttps://…/foto2.jpg"}
          hint="Una URL por línea. La carga de archivos se integra más adelante."
        />
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
        <Button href="/propiedades" variant="ghost" className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
}
