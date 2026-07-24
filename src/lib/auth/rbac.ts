import type { Role } from "@prisma/client";

/** Etiquetas legibles de cada rol. */
export const roleLabels: Record<Role, string> = {
  ADMIN: "Administrador",
  SUPERVISOR: "Supervisor",
  AGENT: "Agente",
  OWNER: "Propietario",
};

/**
 * Permisos por sección (clave = ruta base). Define qué roles pueden
 * ver/entrar a cada módulo. La UI y las páginas server lo usan para el RBAC.
 */
export const sectionAccess = {
  "/panel": ["ADMIN", "SUPERVISOR", "AGENT", "OWNER"],
  "/propiedades": ["ADMIN", "SUPERVISOR", "AGENT", "OWNER"],
  "/clientes": ["ADMIN", "SUPERVISOR", "AGENT"],
  "/pipeline": ["ADMIN", "SUPERVISOR", "AGENT"],
  "/agenda": ["ADMIN", "SUPERVISOR", "AGENT"],
  "/automatizaciones": ["ADMIN", "SUPERVISOR"],
  "/reportes": ["ADMIN", "SUPERVISOR"],
  "/asistente": ["ADMIN", "SUPERVISOR", "AGENT"],
  "/auditoria": ["ADMIN"],
} satisfies Record<string, Role[]>;

export type Section = keyof typeof sectionAccess;

export function canAccess(section: Section, role: Role): boolean {
  return (sectionAccess[section] as readonly Role[]).includes(role);
}
