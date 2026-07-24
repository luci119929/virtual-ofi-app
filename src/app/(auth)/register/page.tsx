import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Card title="Registrarse">
        <form className="flex flex-col gap-4">
          <Field
            label="Mail"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
          />
          <Field
            label="Crear contraseña"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <Field
            label="Repetir contraseña"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </form>
      </Card>

      {/* El alta real se conecta en la Fase 2 (RBAC). */}
      <Button href="/panel">Crear cuenta</Button>

      <p className="text-center text-[13px] text-cream/80">
        ¿Ya tenés cuenta?{" "}
        <a href="/login" className="font-bold underline">
          Iniciá sesión
        </a>
      </p>
    </div>
  );
}
