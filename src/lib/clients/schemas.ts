import { z } from "zod";

const optionalNumber = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number({ message: "Número inválido" }).nonnegative().optional(),
);

const optionalText = z.preprocess(
  (v) => (typeof v === "string" ? v.trim() : v),
  z.string().max(1000).optional(),
);

export const clientFormSchema = z.object({
  name: z.string().trim().min(2, "Ingresá el nombre del cliente."),
  email: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() : v),
    z.union([z.literal(""), z.string().email("Mail inválido.")]).optional(),
  ),
  phone: optionalText,
  source: z.enum([
    "WHATSAPP",
    "INSTAGRAM",
    "FACEBOOK",
    "WEB",
    "PORTAL",
    "MANUAL",
    "REFERIDO",
  ]),
  // Necesidades
  operacion: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.enum(["VENTA", "ALQUILER", "TEMPORAL"]).optional(),
  ),
  tipo: optionalText,
  zona: optionalText,
  presupuestoMin: optionalNumber,
  presupuestoMax: optionalNumber,
  ambientes: optionalNumber,
  dormitorios: optionalNumber,
  notas: optionalText,
});

export type ClientFormInput = z.infer<typeof clientFormSchema>;

export const interactionSchema = z.object({
  channel: z.enum(["LLAMADA", "WHATSAPP", "EMAIL", "REUNION", "NOTA"]),
  content: z.string().trim().min(1, "Escribí una nota."),
});
