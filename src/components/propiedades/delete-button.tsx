"use client";

import { deleteProperty } from "@/lib/properties/actions";

export function DeletePropertyButton({ id }: { id: string }) {
  return (
    <form
      action={deleteProperty.bind(null, id)}
      onSubmit={(e) => {
        if (
          !confirm(
            "¿Eliminar esta propiedad? Esta acción no se puede deshacer.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="w-full rounded-pill border border-red/60 px-4 py-2 text-[13px] font-bold uppercase tracking-[0.02em] text-red-bright transition-colors hover:bg-red/15"
      >
        Eliminar
      </button>
    </form>
  );
}
