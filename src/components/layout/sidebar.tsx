"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import { Logo } from "@/components/ui/logo";
import { navItems } from "./nav-config";
import { IconShield } from "@/components/icons";
import { canAccess, roleLabels, type Section } from "@/lib/auth/rbac";
import { logoutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/cn";

type Account = { name: string; role: Role; orgName: string };

/** Navegación lateral fija — sólo visible en escritorio (md+). */
export function Sidebar({ account }: { account: Account }) {
  const pathname = usePathname();
  const items = navItems.filter((i) =>
    canAccess(i.href as Section, account.role),
  );
  const showAudit = canAccess("/auditoria", account.role);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[220px] flex-col gap-1 border-r border-cream/10 bg-gradient-to-b from-maroon to-ink px-3.5 py-5 md:flex">
      <Link href="/panel" className="mb-4 px-2">
        <Logo className="text-[17px]" />
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors",
                active
                  ? "bg-cream/15 font-bold text-cream"
                  : "text-cream-dim hover:bg-cream/10 hover:text-cream",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {label}
            </Link>
          );
        })}

        {showAudit ? (
          <Link
            href="/auditoria"
            aria-current={
              pathname.startsWith("/auditoria") ? "page" : undefined
            }
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors",
              pathname.startsWith("/auditoria")
                ? "bg-cream/15 font-bold text-cream"
                : "text-cream-dim hover:bg-cream/10 hover:text-cream",
            )}
          >
            <IconShield className="h-[18px] w-[18px] shrink-0" />
            Auditoría
          </Link>
        ) : null}
      </nav>

      <div className="mt-2 border-t border-cream/10 pt-3">
        <div className="px-2">
          <p className="truncate text-[13px] font-bold text-cream">
            {account.name}
          </p>
          <p className="truncate text-[11px] text-cream-dim">
            {roleLabels[account.role]} · {account.orgName}
          </p>
        </div>
        <form action={logoutAction} className="mt-2">
          <button
            type="submit"
            className="w-full rounded-xl px-3 py-2 text-left text-[12px] text-cream-dim transition-colors hover:bg-cream/10 hover:text-cream"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
