import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";

/** Shell de la aplicación: sidebar en escritorio, bottom-nav en móvil. */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-gradient grain relative min-h-screen">
      <Sidebar />
      <main className="relative z-10 pb-24 md:pb-8 md:pl-[220px]">
        <div className="mx-auto w-full max-w-5xl px-5 py-6">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
