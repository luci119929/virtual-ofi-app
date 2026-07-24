import { z } from "zod";

/** number opcional que tolera "" (campos de formulario vacíos). */
const optionalNumber = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number({ message: "Número inválido" }).nonnegative().optional(),
);

const optionalText = z.preprocess(
  (v) => (typeof v === "string" ? v.trim() : v),
  z.string().max(500).optional(),
);

export const propertyFormSchema = z.object({
  title: z.string().trim().min(3, "El título es muy corto."),
  operation: z.enum(["VENTA", "ALQUILER", "TEMPORAL"]),
  status: z.enum([
    "BORRADOR",
    "ACTIVA",
    "RESERVADA",
    "VENDIDA",
    "ALQUILADA",
    "INACTIVA",
  ]),
  price: optionalNumber,
  currency: z.enum(["USD", "ARS"]).default("USD"),
  address: optionalText,
  city: optionalText,
  // Características
  dormitorios: optionalNumber,
  ambientes: optionalNumber,
  superficie: optionalNumber,
  banos: optionalNumber,
  expensas: optionalNumber,
  cochera: z.preprocess(
    (v) => v === "on" || v === "true" || v === true,
    z.boolean(),
  ),
  // Multimedia: una URL por línea
  mediaUrls: z.preprocess(
    (v) => (typeof v === "string" ? v : ""),
    z.string(),
  ),
});

export type PropertyFormInput = z.infer<typeof propertyFormSchema>;

/** Parte las URLs (una por línea), limpia vacíos. */
export function parseMediaUrls(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((u) => u.trim())
    .filter((u) => u.length > 0);
}
