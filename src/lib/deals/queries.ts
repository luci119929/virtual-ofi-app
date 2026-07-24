import "server-only";
import { prisma } from "@/lib/db";

/** Todas las oportunidades de la organización (para armar el tablero). */
export async function listDeals(orgId: string) {
  return prisma.deal.findMany({
    where: { orgId },
    orderBy: { updatedAt: "desc" },
    include: {
      client: { select: { id: true, name: true, interestLevel: true } },
      property: { select: { id: true, title: true } },
      agent: { select: { id: true, name: true } },
    },
  });
}

export async function getDeal(orgId: string, id: string) {
  return prisma.deal.findFirst({
    where: { id, orgId },
    include: {
      client: { select: { id: true, name: true, interestLevel: true, phone: true } },
      property: { select: { id: true, title: true } },
      agent: { select: { id: true, name: true } },
      history: {
        orderBy: { movedAt: "desc" },
        include: { movedBy: { select: { name: true } } },
      },
    },
  });
}

/** Opciones para los selects del formulario (clientes y propiedades de la org). */
export async function getClientOptions(orgId: string) {
  return prisma.client.findMany({
    where: { orgId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getPropertyOptions(orgId: string) {
  return prisma.property.findMany({
    where: { orgId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}
