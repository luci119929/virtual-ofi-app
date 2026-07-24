"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { navItems } from "./nav-config";
import { IconShield } from "@/components/icons";
import { cn } from "@/lib/cn";

/** Navegación lateral fija — sólo visible en escritorio (md+). */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[220px] flex-col gap-1 border-r border-cream/10 bg-gradient-to-b from-maroon to-ink px-3.5 py-5 md:flex">
      <Link href="/panel" className="mb-4 px-2">
        <Logo className="text-[17px]" />
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ href, label, Icon }) => {
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
                  : "text-cream-dim hover:bg-cream/8 hover:text-cream",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/auditoria"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-cream-dim hover:bg-cream/8 hover:text-cream"
      >
        <IconShield className="h-[18px] w-[18px] shrink-0" />
        Auditoría
      </Link>
    </aside>
  );
}
