import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Card title="Iniciar sesión">
        <form className="flex flex-col gap-4">
          <Field
            label="Mail"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
          />
          <Field
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </form>
      </Card>

      {/* La autenticación real se conecta en la Fase 2 (RBAC). */}
      <Button href="/panel">Entrar</Button>

      <p className="text-center text-[13px] text-cream/80">
        ¿No tenés cuenta?{" "}
        <a href="/register" className="font-bold underline">
          Registrate
        </a>
      </p>
    </div>
  );
}
