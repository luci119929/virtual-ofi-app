"use client";

import { useActionState } from "react";
import { SelectField } from "@/components/ui/select";
import { TextareaField } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { logInteraction, type ClientFormState } from "@/lib/clients/actions";
import { channelLabels, channelValues } from "@/lib/clients/labels";

const channelOptions = channelValues.map((v) => ({
  value: v,
  label: channelLabels[v],
}));

/** Registra una interacción; al guardar, el interés se recalcula solo. */
export function InteractionForm({ clientId }: { clientId: string }) {
  const bound = logInteraction.bind(null, clientId);
  const [state, action, pending] = useActionState<ClientFormState, FormData>(
    bound,
    {},
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <SelectField
        label="Canal"
        name="channel"
        options={channelOptions}
        defaultValue="LLAMADA"
      />
      <TextareaField
        label="Nota de la interacción"
        name="content"
        placeholder="Ej: Llamé, le interesa el 2 amb de Palermo. Coordina visita."
        error={state.fieldErrors?.content?.[0]}
      />
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Registrando…" : "Registrar interacción"}
      </Button>
    </form>
  );
}
