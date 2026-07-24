"use client";

import { deleteDeal } from "@/lib/deals/actions";

export function DeleteDealButton({ id }: { id: string }) {
  return (
    <form
      action={deleteDeal.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("¿Eliminar esta oportunidad? Esta acción no se puede deshacer."))
          e.preventDefault();
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
