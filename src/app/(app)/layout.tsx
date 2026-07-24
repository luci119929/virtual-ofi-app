import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { requireUser } from "@/lib/auth/dal";

/** Shell de la aplicación: sidebar en escritorio, bottom-nav en móvil. */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  const account = {
    name: user.name,
    role: user.role,
    orgName: user.organization.name,
  };

  return (
    <div className="app-gradient grain relative min-h-screen">
      <Sidebar account={account} />
      <main className="relative z-10 pb-24 md:pb-8 md:pl-[220px]">
        <div className="mx-auto w-full max-w-5xl px-5 py-6">{children}</div>
      </main>
      <BottomNav role={user.role} />
    </div>
  );
}
