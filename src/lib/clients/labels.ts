import type {
  LeadSource,
  InterestLevel,
  CommunicationChannel,
} from "@prisma/client";

export const sourceLabels: Record<LeadSource, string> = {
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  WEB: "Web",
  PORTAL: "Portal",
  MANUAL: "Manual",
  REFERIDO: "Referido",
};

export const sourceValues: LeadSource[] = [
  "WHATSAPP",
  "INSTAGRAM",
  "FACEBOOK",
  "WEB",
  "PORTAL",
  "MANUAL",
  "REFERIDO",
];

export const interestLabels: Record<InterestLevel, string> = {
  FRIO: "Frío",
  TIBIO: "Tibio",
  CALIENTE: "Caliente",
};

export const interestTone: Record<
  InterestLevel,
  "frio" | "tibio" | "caliente"
> = {
  FRIO: "frio",
  TIBIO: "tibio",
  CALIENTE: "caliente",
};

export const interestValues: InterestLevel[] = ["FRIO", "TIBIO", "CALIENTE"];

export const channelLabels: Record<CommunicationChannel, string> = {
  LLAMADA: "Llamada",
  EMAIL: "Email",
  WHATSAPP: "WhatsApp",
  NOTA: "Nota",
  REUNION: "Reunión",
};

export const channelValues: CommunicationChannel[] = [
  "LLAMADA",
  "WHATSAPP",
  "EMAIL",
  "REUNION",
  "NOTA",
];

export const reqOperationLabels: Record<
  "VENTA" | "ALQUILER" | "TEMPORAL",
  string
> = {
  VENTA: "Venta",
  ALQUILER: "Alquiler",
  TEMPORAL: "Temporario",
};

/** Necesidades del cliente almacenadas en Client.requirements (JSON). */
export type ClientRequirements = {
  operacion?: "VENTA" | "ALQUILER" | "TEMPORAL";
  tipo?: string; // depto, casa, PH, local…
  zona?: string;
  presupuestoMin?: number;
  presupuestoMax?: number;
  ambientes?: number;
  dormitorios?: number;
  notas?: string;
};
