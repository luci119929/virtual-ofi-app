import type { DealStage } from "@prisma/client";

export const stageLabels: Record<DealStage, string> = {
  NUEVO: "Nuevo lead",
  CONTACTADO: "Contactado",
  VISITA: "Visita",
  NEGOCIACION: "Negociación",
  CERRADO: "Cerrado",
  PERDIDO: "Perdido",
};

/** Orden de las columnas del tablero. */
export const stageOrder: DealStage[] = [
  "NUEVO",
  "CONTACTADO",
  "VISITA",
  "NEGOCIACION",
  "CERRADO",
  "PERDIDO",
];

/** Acento de cada columna/etiqueta (paleta de marca). */
export const stageTone: Record<
  DealStage,
  "neutral" | "tibio" | "caliente" | "ok" | "outline"
> = {
  NUEVO: "neutral",
  CONTACTADO: "tibio",
  VISITA: "tibio",
  NEGOCIACION: "caliente",
  CERRADO: "ok",
  PERDIDO: "outline",
};

export const terminalStages: DealStage[] = ["CERRADO", "PERDIDO"];
