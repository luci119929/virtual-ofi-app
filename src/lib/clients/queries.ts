import "server-only";
import type { InterestLevel } from "@prisma/client";
import { prisma } from "@/lib/db";

/** Lista de clientes de la organización, con filtro opcional por interés. */
export async function listClients(
  orgId: string,
  filter?: { interest?: InterestLevel },
) {
  return prisma.client.findMany({
    where: {
      orgId,
      ...(filter?.interest ? { interestLevel: filter.interest } : {}),
    },
    orderBy: [{ score: "desc" }, { updatedAt: "desc" }],
    include: {
      agent: { select: { id: true, name: true } },
      _count: { select: { communications: true, visits: true } },
    },
  });
}

export async function countByInterest(orgId: string) {
  const rows = await prisma.client.groupBy({
    by: ["interestLevel"],
    where: { orgId },
    _count: { _all: true },
  });
  const map: Partial<Record<InterestLevel, number>> = {};
  for (const r of rows) map[r.interestLevel] = r._count._all;
  return map;
}

/** Ficha completa de un cliente (scoped por org). */
export async function getClient(orgId: string, id: string) {
  return prisma.client.findFirst({
    where: { id, orgId },
    include: {
      agent: { select: { id: true, name: true } },
      communications: {
        orderBy: { createdAt: "desc" },
        take: 60,
        include: { user: { select: { name: true } } },
      },
      visits: {
        orderBy: { scheduledAt: "desc" },
        take: 10,
        include: { property: { select: { title: true } } },
      },
    },
  });
}
