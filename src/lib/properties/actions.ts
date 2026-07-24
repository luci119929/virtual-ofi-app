"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Prisma, PropertyStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/dal";
import { propertyFormSchema, parseMediaUrls, type PropertyFormInput } from "./schemas";
import {
  statusLabels,
  operationLabels,
  featureLabels,
  type PropertyFeatures,
} from "./labels";
import { formatPrice } from "@/lib/format";

export type PropertyFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const WRITE_ROLES = ["ADMIN", "SUPERVISOR", "AGENT"] as const;

function featuresFromInput(input: PropertyFormInput): PropertyFeatures {
  const f: PropertyFeatures = { cochera: input.cochera };
  if (input.dormitorios !== undefined) f.dormitorios = input.dormitorios;
  if (input.ambientes !== undefined) f.ambientes = input.ambientes;
  if (input.superficie !== undefined) f.superficie = input.superficie;
  if (input.banos !== undefined) f.banos = input.banos;
  if (input.expensas !== undefined) f.expensas = input.expensas;
  return f;
}

type Change = { fieldChanged: string; oldValue: string | null; newValue: string | null };

function pushChange(
  list: Change[],
  field: string,
  oldV: string | number | boolean | null | undefined,
  newV: string | number | boolean | null | undefined,
) {
  const norm = (v: typeof oldV) =>
    v === null || v === undefined || v === "" ? null : String(v);
  const o = norm(oldV);
  const n = norm(newV);
  if (o !== n) list.push({ fieldChanged: field, oldValue: o, newValue: n });
}

function parseForm(formData: FormData) {
  return propertyFormSchema.safeParse({
    title: formData.get("title"),
    operation: formData.get("operation"),
    status: formData.get("status"),
    price: formData.get("price"),
    currency: formData.get("currency"),
    address: formData.get("address"),
    city: formData.get("city"),
    dormitorios: formData.get("dormitorios"),
    ambientes: formData.get("ambientes"),
    superficie: formData.get("superficie"),
    banos: formData.get("banos"),
    expensas: formData.get("expensas"),
    cochera: formData.get("cochera"),
    mediaUrls: formData.get("mediaUrls"),
  });
}

/** Crea una propiedad. El creador queda como agente asignado. */
export async function createProperty(
  _prev: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const user = await requireRole(...WRITE_ROLES);
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const input = parsed.data;
  const features = featuresFromInput(input);
  const urls = parseMediaUrls(input.mediaUrls);

  const property = await prisma.property.create({
    data: {
      orgId: user.orgId,
      agentId: user.id,
      title: input.title,
      operation: input.operation,
      status: input.status,
      price: input.price ?? null,
      currency: input.currency,
      address: input.address || null,
      city: input.city || null,
      features: features as Prisma.InputJsonValue,
      media: {
        create: urls.map((url, i) => ({ url, order: i })),
      },
      history: {
        create: {
          userId: user.id,
          fieldChanged: "Propiedad",
          oldValue: null,
          newValue: "Creada",
        },
      },
    },
  });

  revalidatePath("/propiedades");
  redirect(`/propiedades/${property.id}`);
}

/** Actualiza una propiedad y registra el diff en el historial. */
export async function updateProperty(
  _prev: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const user = await requireRole(...WRITE_ROLES);
  const id = String(formData.get("id") ?? "");
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const input = parsed.data;

  const before = await prisma.property.findFirst({
    where: { id, orgId: user.orgId },
  });
  if (!before) return { error: "La propiedad no existe." };

  const beforeFeatures = (before.features ?? {}) as PropertyFeatures;
  const afterFeatures = featuresFromInput(input);
  const urls = parseMediaUrls(input.mediaUrls);

  // Calcular cambios para el historial
  const changes: Change[] = [];
  pushChange(changes, "Título", before.title, input.title);
  pushChange(
    changes,
    "Operación",
    operationLabels[before.operation],
    operationLabels[input.operation],
  );
  pushChange(
    changes,
    "Estado",
    statusLabels[before.status],
    statusLabels[input.status],
  );
  pushChange(
    changes,
    "Precio",
    before.price ? formatPrice(before.price, before.currency) : null,
    input.price !== undefined ? formatPrice(input.price, input.currency) : null,
  );
  pushChange(changes, "Dirección", before.address, input.address || null);
  pushChange(changes, "Ciudad", before.city, input.city || null);
  (Object.keys(featureLabels) as (keyof PropertyFeatures)[]).forEach((k) => {
    pushChange(changes, featureLabels[k], beforeFeatures[k], afterFeatures[k]);
  });

  await prisma.$transaction(async (tx) => {
    await tx.property.update({
      where: { id },
      data: {
        title: input.title,
        operation: input.operation,
        status: input.status,
        price: input.price ?? null,
        currency: input.currency,
        address: input.address || null,
        city: input.city || null,
        features: afterFeatures as Prisma.InputJsonValue,
      },
    });
    // Reemplazar multimedia
    await tx.propertyMedia.deleteMany({ where: { propertyId: id } });
    if (urls.length) {
      await tx.propertyMedia.createMany({
        data: urls.map((url, i) => ({ propertyId: id, url, order: i })),
      });
    }
    // Registrar historial
    if (changes.length) {
      await tx.propertyHistory.createMany({
        data: changes.map((c) => ({
          propertyId: id,
          userId: user.id,
          fieldChanged: c.fieldChanged,
          oldValue: c.oldValue,
          newValue: c.newValue,
        })),
      });
    }
  });

  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${id}`);
  redirect(`/propiedades/${id}`);
}

/** Cambio rápido de estado desde la ficha. */
export async function changeStatus(
  id: string,
  formData: FormData,
): Promise<void> {
  const user = await requireRole(...WRITE_ROLES);
  const status = String(formData.get("status") ?? "") as PropertyStatus;

  const before = await prisma.property.findFirst({
    where: { id, orgId: user.orgId },
    select: { status: true },
  });
  if (!before || before.status === status) return;

  await prisma.$transaction([
    prisma.property.update({ where: { id }, data: { status } }),
    prisma.propertyHistory.create({
      data: {
        propertyId: id,
        userId: user.id,
        fieldChanged: "Estado",
        oldValue: statusLabels[before.status],
        newValue: statusLabels[status],
      },
    }),
  ]);

  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${id}`);
}

/** Elimina una propiedad (sólo ADMIN / SUPERVISOR). */
export async function deleteProperty(id: string): Promise<void> {
  const user = await requireRole("ADMIN", "SUPERVISOR");
  await prisma.property.deleteMany({ where: { id, orgId: user.orgId } });
  revalidatePath("/propiedades");
  redirect("/propiedades");
}
