"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/dal";
import { clientFormSchema, interactionSchema, type ClientFormInput } from "./schemas";
import { classify } from "./scoring";
import type { ClientRequirements } from "./labels";

export type ClientFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const WRITE_ROLES = ["ADMIN", "SUPERVISOR", "AGENT"] as const;

function requirementsFromInput(input: ClientFormInput): ClientRequirements {
  const r: ClientRequirements = {};
  if (input.operacion) r.operacion = input.operacion;
  if (input.tipo) r.tipo = input.tipo;
  if (input.zona) r.zona = input.zona;
  if (input.presupuestoMin !== undefined) r.presupuestoMin = input.presupuestoMin;
  if (input.presupuestoMax !== undefined) r.presupuestoMax = input.presupuestoMax;
  if (input.ambientes !== undefined) r.ambientes = input.ambientes;
  if (input.dormitorios !== undefined) r.dormitorios = input.dormitorios;
  if (input.notas) r.notas = input.notas;
  return r;
}

/** Recalcula score + nivel de interés a partir del comportamiento observado. */
export async function recalcClient(clientId: string): Promise<void> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: {
      createdAt: true,
      requirements: true,
      communications: { select: { createdAt: true } },
      visits: { select: { status: true, feedback: true } },
    },
  });
  if (!client) return;

  const { score, level } = classify({
    communications: client.communications,
    visits: client.visits,
    requirements: client.requirements as Record<string, unknown> | null,
    createdAt: client.createdAt,
  });

  await prisma.client.update({
    where: { id: clientId },
    data: { score, interestLevel: level },
  });
}

function parseForm(formData: FormData) {
  return clientFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    source: formData.get("source"),
    operacion: formData.get("operacion"),
    tipo: formData.get("tipo"),
    zona: formData.get("zona"),
    presupuestoMin: formData.get("presupuestoMin"),
    presupuestoMax: formData.get("presupuestoMax"),
    ambientes: formData.get("ambientes"),
    dormitorios: formData.get("dormitorios"),
    notas: formData.get("notas"),
  });
}

export async function createClient(
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const user = await requireRole(...WRITE_ROLES);
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const input = parsed.data;
  const requirements = requirementsFromInput(input);

  const created = await prisma.client.create({
    data: {
      orgId: user.orgId,
      agentId: user.id,
      name: input.name,
      email: input.email || null,
      phone: input.phone || null,
      source: input.source,
      requirements: requirements as Prisma.InputJsonValue,
    },
  });

  await recalcClient(created.id);
  revalidatePath("/clientes");
  redirect(`/clientes/${created.id}`);
}

export async function updateClient(
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const user = await requireRole(...WRITE_ROLES);
  const id = String(formData.get("id") ?? "");
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const input = parsed.data;

  const existing = await prisma.client.findFirst({
    where: { id, orgId: user.orgId },
    select: { id: true },
  });
  if (!existing) return { error: "El cliente no existe." };

  await prisma.client.update({
    where: { id },
    data: {
      name: input.name,
      email: input.email || null,
      phone: input.phone || null,
      source: input.source,
      requirements: requirementsFromInput(input) as Prisma.InputJsonValue,
    },
  });

  await recalcClient(id);
  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}`);
  redirect(`/clientes/${id}`);
}

/** Registra una comunicación (nota/llamada/etc.) y reclasifica el interés. */
export async function logInteraction(
  clientId: string,
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const user = await requireRole(...WRITE_ROLES);
  const parsed = interactionSchema.safeParse({
    channel: formData.get("channel"),
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const client = await prisma.client.findFirst({
    where: { id: clientId, orgId: user.orgId },
    select: { id: true },
  });
  if (!client) return { error: "El cliente no existe." };

  await prisma.communication.create({
    data: {
      orgId: user.orgId,
      clientId,
      userId: user.id,
      channel: parsed.data.channel,
      content: parsed.data.content,
    },
  });

  await recalcClient(clientId);
  revalidatePath(`/clientes/${clientId}`);
  revalidatePath("/clientes");
  return {};
}

export async function deleteClient(id: string): Promise<void> {
  const user = await requireRole("ADMIN", "SUPERVISOR");
  await prisma.client.deleteMany({ where: { id, orgId: user.orgId } });
  revalidatePath("/clientes");
  redirect("/clientes");
}
