# Virtual Ofi

Sistema operativo comercial inteligente para inmobiliarias y agentes. No es un CRM
ni un listado de propiedades: centraliza toda la operación (leads, propiedades,
seguimientos), automatiza tareas repetitivas y usa IA sobre datos reales para
responder **"¿qué hacer ahora?"** y **"¿qué oportunidad se pierde?"**.

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilos | Tailwind CSS v4 (design tokens de marca) |
| Base de datos | PostgreSQL + Prisma 7 (driver adapter `pg`) |
| Auth / RBAC | Fase 2 |
| IA | Claude (Anthropic) — Fase 9 |

Arquitectura full-stack en una sola base de código (web responsive + API),
organizada de forma modular por dominios. Multi-tenant: toda entidad de negocio
pertenece a una `Organization`.

## Identidad visual

Mundo cálido y oscuro. Ver `src/app/globals.css`.

- **Colores:** crema `#F6F0CB`, granate `#7E2A22`, tinta `#1A0D0B`, naranja `#EF9B3C`, rojo `#E0391D`.
- **Tipografía:** *Architype Aubette* (logo/títulos) + *Helvetica Now* (textos).
  Son fuentes con licencia — dejá los `.woff2` en `public/fonts/` (ver README ahí)
  y descomentá los `@font-face`. Mientras tanto se usan fallbacks del sistema.

## Puesta en marcha

```bash
pnpm install
cp .env.example .env      # completá DATABASE_URL
pnpm db:generate          # genera el cliente Prisma
pnpm db:push              # crea las tablas (requiere PostgreSQL)
pnpm dev                  # http://localhost:3000
```

## Scripts

| Comando | Qué hace |
|---------|----------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Genera el cliente Prisma |
| `pnpm db:push` | Sincroniza el schema con la BD (sin migración) |
| `pnpm db:migrate` | Crea/aplica migraciones |
| `pnpm db:studio` | Explorador visual de datos |

## Estructura

```
src/
  app/
    (auth)/            login, register
    (app)/             shell con sidebar (escritorio) / bottom-nav (móvil)
      panel/           dashboard "¿qué hacer ahora?"
      propiedades/ clientes/ pipeline/ agenda/
      automatizaciones/ reportes/ asistente/ auditoria/
    page.tsx           bienvenida
  components/
    ui/                Logo, Button, Card, Field, Chip, Tile
    layout/            Sidebar, BottomNav, PageHeader, nav-config
    icons.tsx
  lib/                 db (Prisma), cn
prisma/
  schema.prisma        entidades del PRD (multi-tenant)
```

## Hoja de ruta

- **Fase 1 — Setup + BD + Design System + shell** ✅ (esta entrega)
- Fase 2 — Autenticación + RBAC (4 roles)
- Fase 3 — Propiedades (CRUD, estados, historial)
- Fase 4 — Clientes/Leads (ingreso multicanal, scoring)
- Fase 5 — Pipeline Kanban
- Fase 6 — Matching inteligente
- Fase 7 — Seguimiento, tareas y agenda
- Fase 8 — Automatizaciones (SI/ENTONCES)
- Fase 9 — Capa de IA
- Fase 10 — Reportes, analítica y auditoría
- Fase 11 — App móvil (React Native)
- Fase 12 — Comunicaciones + integración WhatsApp
