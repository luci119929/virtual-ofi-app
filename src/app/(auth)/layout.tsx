import Link from "next/link";
import { Logo } from "@/components/ui/logo";

/** Marco común de las pantallas de acceso: degradado de marca + logo. */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="brand-gradient grain relative flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8">
        <Link href="/" aria-label="Inicio">
          <Logo className="text-[26px]" />
        </Link>
        {children}
      </div>
    </main>
  );
}
