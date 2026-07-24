"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import { mobileNavItems } from "./nav-config";
import { canAccess, type Section } from "@/lib/auth/rbac";
import { cn } from "@/lib/cn";

/** Barra de navegación inferior — sólo visible en móvil (< md). */
export function BottomNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = mobileNavItems.filter((i) =>
    canAccess(i.href as Section, role),
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-cream/10 bg-ink/95 px-2 py-2 backdrop-blur md:hidden">
      {items.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            aria-label={label}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] uppercase tracking-wide transition-colors",
              active ? "text-red-bright" : "text-cream/55",
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
