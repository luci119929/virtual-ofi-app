"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerAction, type AuthState } from "@/lib/auth/actions";

const initial: AuthState = {};

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, initial);

  return (
    <form action={action} className="flex w-full flex-col gap-4">
      <Card title="Registrarse">
        <div className="flex flex-col gap-4">
          <Field
            label="Inmobiliaria"
            name="orgName"
            placeholder="Nombre de tu inmobiliaria"
            error={state.fieldErrors?.orgName?.[0]}
          />
          <Field
            label="Tu nombre"
            name="name"
            autoComplete="name"
            placeholder="Nombre y apellido"
            error={state.fieldErrors?.name?.[0]}
          />
          <Field
            label="Mail"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            error={state.fieldErrors?.email?.[0]}
          />
          <Field
            label="Crear contraseña"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            error={state.fieldErrors?.password?.[0]}
          />
          <Field
            label="Repetir contraseña"
            name="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={state.fieldErrors?.confirm?.[0]}
          />
        </div>
      </Card>

      {state.error ? (
        <p
          role="alert"
          className="rounded-pill bg-red/20 px-4 py-2 text-center text-[13px] font-medium text-cream"
        >
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Creando cuenta…" : "Crear cuenta"}
      </Button>

      <p className="text-center text-[13px] text-cream/80">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-bold underline">
          Iniciá sesión
        </Link>
      </p>
    </form>
  );
}
