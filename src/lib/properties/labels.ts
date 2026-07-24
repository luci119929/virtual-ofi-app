import type { OperationType, PropertyStatus } from "@prisma/client";

export const operationLabels: Record<OperationType, string> = {
  VENTA: "Venta",
  ALQUILER: "Alquiler",
  TEMPORAL: "Temporario",
};

export const statusLabels: Record<PropertyStatus, string> = {
  BORRADOR: "Borrador",
  ACTIVA: "Activa",
  RESERVADA: "Reservada",
  VENDIDA: "Vendida",
  ALQUILADA: "Alquilada",
  INACTIVA: "Inactiva",
};

/** Tono del Chip por estado (usa la paleta de marca). */
export const statusTone: Record<
  PropertyStatus,
  "ok" | "tibio" | "caliente" | "neutral" | "outline"
> = {
  BORRADOR: "outline",
  ACTIVA: "ok",
  RESERVADA: "tibio",
  VENDIDA: "caliente",
  ALQUILADA: "caliente",
  INACTIVA: "neutral",
};

export const operationValues: OperationType[] = ["VENTA", "ALQUILER", "TEMPORAL"];
export const statusValues: PropertyStatus[] = [
  "BORRADOR",
  "ACTIVA",
  "RESERVADA",
  "VENDIDA",
  "ALQUILADA",
  "INACTIVA",
];

/** Características flexibles almacenadas en Property.features (JSON). */
export type PropertyFeatures = {
  dormitorios?: number;
  ambientes?: number;
  superficie?: number; // m²
  banos?: number;
  cochera?: boolean;
  expensas?: number;
};

export const featureLabels: Record<keyof PropertyFeatures, string> = {
  dormitorios: "Dormitorios",
  ambientes: "Ambientes",
  superficie: "Superficie (m²)",
  banos: "Baños",
  cochera: "Cochera",
  expensas: "Expensas",
};
