"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "./password";
import { createSession, deleteSession } from "./session";
import { loginSchema, registerSchema } from "./schemas";

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/** Alta de una nueva inmobiliaria + su primer usuario (ADMIN). */
export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    orgName: formData.get("orgName"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { orgName, name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe una cuenta con ese mail." };
  }

  const passwordHash = await hashPassword(password);

  // El primer usuario de la organización es el Administrador.
  const user = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({ data: { name: orgName } });
    return tx.user.create({
      data: {
        orgId: org.id,
        name,
        email,
        passwordHash,
        role: "ADMIN",
      },
    });
  });

  await createSession({ userId: user.id, orgId: user.orgId, role: user.role });
  redirect("/panel");
}

/** Inicio de sesión con mail + contraseña. */
export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;
  const genericError = "Mail o contraseña incorrectos.";

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active) {
    return { error: genericError };
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return { error: genericError };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await createSession({ userId: user.id, orgId: user.orgId, role: user.role });
  redirect("/panel");
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
