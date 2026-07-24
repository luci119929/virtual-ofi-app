"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction, type AuthState } from "@/lib/auth/actions";

const initial: AuthState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="flex w-full flex-col gap-4">
      <Card title="Iniciar sesión">
        <div className="flex flex-col gap-4">
          <Field
            label="Mail"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            error={state.fieldErrors?.email?.[0]}
          />
          <Field
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={state.fieldErrors?.password?.[0]}
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
        {pending ? "Entrando…" : "Entrar"}
      </Button>

      <p className="text-center text-[13px] text-cream/80">
        ¿No tenés cuenta?{" "}
        <Link href="/register" className="font-bold underline">
          Registrate
        </Link>
      </p>
    </form>
  );
}
