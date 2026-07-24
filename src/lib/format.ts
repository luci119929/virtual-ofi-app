/** Formato de precio: "USD 185.000". Acepta number, Decimal-like o null. */
export function formatPrice(
  value: number | { toString(): string } | null | undefined,
  currency = "USD",
): string {
  if (value === null || value === undefined) return "Sin precio";
  const num = typeof value === "number" ? value : Number(value.toString());
  if (Number.isNaN(num)) return "Sin precio";
  return `${currency} ${new Intl.NumberFormat("es-AR").format(num)}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(d);
}
