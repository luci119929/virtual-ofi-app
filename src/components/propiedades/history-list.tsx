import { formatDate } from "@/lib/format";

type HistoryEntry = {
  id: string;
  fieldChanged: string;
  oldValue: string | null;
  newValue: string | null;
  changedAt: Date;
  user: { name: string } | null;
};

/** Línea de tiempo del historial de cambios (requisito #4). */
export function HistoryList({ entries }: { entries: HistoryEntry[] }) {
  if (!entries.length) {
    return (
      <p className="text-[13px] text-cream-dim">Sin cambios registrados.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {entries.map((e) => (
        <li key={e.id} className="flex gap-3 text-[13px]">
          <span
            aria-hidden
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange"
          />
          <div className="min-w-0">
            <p className="text-cream">
              <span className="font-bold">{e.fieldChanged}</span>
              {e.oldValue || e.newValue ? (
                <>
                  {": "}
                  {e.oldValue ? (
                    <span className="text-cream-dim line-through">
                      {e.oldValue}
                    </span>
                  ) : null}
                  {e.oldValue && e.newValue ? " → " : ""}
                  {e.newValue ? (
                    <span className="text-orange">{e.newValue}</span>
                  ) : null}
                </>
              ) : null}
            </p>
            <p className="text-[11px] text-cream-dim">
              {formatDate(e.changedAt)}
              {e.user ? ` · ${e.user.name}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
