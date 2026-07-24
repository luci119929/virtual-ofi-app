"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { DealStage } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/dal";
import { dealFormSchema, moveStageSchema } from "./schemas";

export type DealFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const WRITE_ROLES = ["ADMIN", "SUPERVISOR", "AGENT"] as const;

function parseForm(formData: FormData) {
  return dealFormSchema.safeParse({
    clientId: formData.get("clientId"),
    propertyId: formData.get("propertyId"),
    stage: formData.get("stage"),
    value: formData.get("value"),
    currency: formData.get("currency"),
    lostReason: formData.get("lostReason"),
  });
}

export async function createDeal(
  _prev: DealFormState,
  formData: FormData,
): Promise<DealFormState> {
  const user = await requireRole(...WRITE_ROLES);
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const input = parsed.data;

  // Validar que cliente/propiedad pertenezcan a la organización
  const client = await prisma.client.findFirst({
    where: { id: input.clientId, orgId: user.orgId },
    select: { id: true },
  });
  if (!client) return { error: "El cliente seleccionado no es válido." };

  const deal = await prisma.deal.create({
    data: {
      orgId: user.orgId,
      agentId: user.id,
      clientId: input.clientId,
      propertyId: input.propertyId || null,
      stage: input.stage,
      value: input.value ?? null,
      currency: input.currency,
      lostReason: input.stage === "PERDIDO" ? input.lostReason || null : null,
      history: {
        create: {
          userId: user.id,
          fromStage: null,
          toStage: input.stage,
        },
      },
    },
  });

  revalidatePath("/pipeline");
  redirect(`/pipeline/${deal.id}`);
}

export async function updateDeal(
  _prev: DealFormState,
  formData: FormData,
): Promise<DealFormState> {
  const user = await requireRole(...WRITE_ROLES);
  const id = String(formData.get("id") ?? "");
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const input = parsed.data;

  const before = await prisma.deal.findFirst({
    where: { id, orgId: user.orgId },
    select: { stage: true },
  });
  if (!before) return { error: "La oportunidad no existe." };

  await prisma.$transaction(async (tx) => {
    await tx.deal.update({
      where: { id },
      data: {
        clientId: input.clientId,
        propertyId: input.propertyId || null,
        stage: input.stage,
        value: input.value ?? null,
        currency: input.currency,
        lostReason: input.stage === "PERDIDO" ? input.lostReason || null : null,
      },
    });
    if (before.stage !== input.stage) {
      await tx.dealStageHistory.create({
        data: {
          dealId: id,
          userId: user.id,
          fromStage: before.stage,
          toStage: input.stage,
        },
      });
    }
  });

  revalidatePath("/pipeline");
  revalidatePath(`/pipeline/${id}`);
  redirect(`/pipeline/${id}`);
}

/** Mueve una oportunidad de etapa y registra el movimiento + responsable. */
export async function moveDealStage(
  dealId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireRole(...WRITE_ROLES);
  const parsed = moveStageSchema.safeParse({ stage: formData.get("stage") });
  if (!parsed.success) return;
  const stage = parsed.data.stage as DealStage;

  const before = await prisma.deal.findFirst({
    where: { id: dealId, orgId: user.orgId },
    select: { stage: true },
  });
  if (!before || before.stage === stage) return;

  await prisma.$transaction([
    prisma.deal.update({ where: { id: dealId }, data: { stage } }),
    prisma.dealStageHistory.create({
      data: {
        dealId,
        userId: user.id,
        fromStage: before.stage,
        toStage: stage,
      },
    }),
  ]);

  revalidatePath("/pipeline");
  revalidatePath(`/pipeline/${dealId}`);
}

export async function deleteDeal(id: string): Promise<void> {
  const user = await requireRole("ADMIN", "SUPERVISOR");
  await prisma.deal.deleteMany({ where: { id, orgId: user.orgId } });
  revalidatePath("/pipeline");
  redirect("/pipeline");
}
