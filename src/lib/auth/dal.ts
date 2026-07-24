import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "./session";
import { canAccess, type Section } from "./rbac";

/**
 * Data Access Layer — punto único para autenticación.
 * `cache` memoiza el resultado durante un mismo render.
 */

export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session) return null;
  return session;
});

/** Usuario autenticado (fresco desde la BD) o null. */
export const getCurrentUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      orgId: true,
      active: true,
      organization: { select: { id: true, name: true } },
    },
  });

  if (!user || !user.active) return null;
  return user;
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/** Exige sesión válida; si no, redirige a /login. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Exige que el usuario tenga acceso a la sección; si no, redirige. */
export async function requireAccess(section: Section): Promise<CurrentUser> {
  const user = await requireUser();
  if (!canAccess(section, user.role)) redirect("/panel");
  return user;
}

/** Exige uno de los roles indicados; si no, redirige a /panel. */
export async function requireRole(...roles: Role[]): Promise<CurrentUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/panel");
  return user;
}
