"use client";

import type { PropertyStatus } from "@prisma/client";
import { changeStatus } from "@/lib/properties/actions";
import { statusLabels, statusValues } from "@/lib/properties/labels";

/** Cambia el estado de la propiedad enviando el form al hacer una selección. */
export function StatusControl({
  propertyId,
  current,
}: {
  propertyId: string;
  current: PropertyStatus;
}) {
  return (
    <form action={changeStatus.bind(null, propertyId)}>
      <label className="mb-1.5 block font-display text-[11px] uppercase tracking-[0.14em] text-cream-dim">
        Cambiar estado
      </label>
      <select
        name="status"
        defaultValue={current}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="h-9 w-full rounded-pill border-0 bg-cream px-4 text-[13px] font-bold text-maroon"
      >
        {statusValues.map((s) => (
          <option key={s} value={s}>
            {statusLabels[s]}
          </option>
        ))}
      </select>
    </form>
  );
}
