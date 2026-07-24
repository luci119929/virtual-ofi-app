import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Ingresá un mail válido."),
  password: z.string().min(1, "Ingresá tu contraseña."),
});

export const registerSchema = z
  .object({
    orgName: z
      .string()
      .trim()
      .min(2, "El nombre de la inmobiliaria es muy corto."),
    name: z.string().trim().min(2, "Ingresá tu nombre."),
    email: z.string().trim().toLowerCase().email("Ingresá un mail válido."),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Las contraseñas no coinciden.",
    path: ["confirm"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
