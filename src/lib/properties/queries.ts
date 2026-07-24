import "server-only";
import type { PropertyStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

/** Lista de propiedades de la organización, con opción de filtrar por estado. */
export async function listProperties(
  orgId: string,
  filter?: { status?: PropertyStatus },
) {
  return prisma.property.findMany({
    where: { orgId, ...(filter?.status ? { status: filter.status } : {}) },
    orderBy: { updatedAt: "desc" },
    include: {
      media: { orderBy: { order: "asc" }, take: 1 },
      agent: { select: { id: true, name: true } },
    },
  });
}

/** Conteo por estado para las pastillas de filtro. */
export async function countByStatus(orgId: string) {
  const rows = await prisma.property.groupBy({
    by: ["status"],
    where: { orgId },
    _count: { _all: true },
  });
  const map: Partial<Record<PropertyStatus, number>> = {};
  for (const r of rows) map[r.status] = r._count._all;
  return map;
}

/** Ficha completa de una propiedad (scoped por org), con media, agente e historial. */
export async function getProperty(orgId: string, id: string) {
  return prisma.property.findFirst({
    where: { id, orgId },
    include: {
      media: { orderBy: { order: "asc" } },
      agent: { select: { id: true, name: true } },
      history: {
        orderBy: { changedAt: "desc" },
        take: 60,
        include: { user: { select: { name: true } } },
      },
    },
  });
}
