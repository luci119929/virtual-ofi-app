import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

/** Pantalla de bienvenida — degradado de marca + entrada a la app. */
export default function WelcomePage() {
  return (
    <main className="brand-gradient grain relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-10">
        <Logo variant="stacked" className="text-[44px]" />

        <p className="max-w-[46ch] text-[15px] text-cream/90">
          El sistema operativo comercial de tu inmobiliaria. Centralizá leads,
          propiedades y seguimientos — y dejá que la inteligencia te diga qué
          hacer ahora.
        </p>

        <div className="flex w-full flex-col gap-3">
          <Button href="/login">Iniciar sesión</Button>
          <Button href="/register" variant="ghost">
            Registrarse
          </Button>
        </div>
      </div>
    </main>
  );
}
