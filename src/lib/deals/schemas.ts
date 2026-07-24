import { z } from "zod";

const optionalNumber = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number({ message: "Número inválido" }).nonnegative().optional(),
);

export const dealFormSchema = z.object({
  clientId: z.string().min(1, "Elegí un cliente."),
  propertyId: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().optional(),
  ),
  stage: z.enum([
    "NUEVO",
    "CONTACTADO",
    "VISITA",
    "NEGOCIACION",
    "CERRADO",
    "PERDIDO",
  ]),
  value: optionalNumber,
  currency: z.enum(["USD", "ARS"]).default("USD"),
  lostReason: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() : v),
    z.string().max(300).optional(),
  ),
});

export type DealFormInput = z.infer<typeof dealFormSchema>;

export const moveStageSchema = z.object({
  stage: z.enum([
    "NUEVO",
    "CONTACTADO",
    "VISITA",
    "NEGOCIACION",
    "CERRADO",
    "PERDIDO",
  ]),
});
