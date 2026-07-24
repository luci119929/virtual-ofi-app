import {
  IconPanel,
  IconBuilding,
  IconUsers,
  IconPipeline,
  IconCalendar,
  IconBolt,
  IconChart,
  IconSparkles,
} from "@/components/icons";

export type NavItem = {
  href: string;
  label: string;
  Icon: (props: { className?: string }) => React.ReactNode;
};

/** Navegación principal de la app (orden = jerarquía de uso diario). */
export const navItems: NavItem[] = [
  { href: "/panel", label: "Panel", Icon: IconPanel },
  { href: "/propiedades", label: "Propiedades", Icon: IconBuilding },
  { href: "/clientes", label: "Clientes", Icon: IconUsers },
  { href: "/pipeline", label: "Pipeline", Icon: IconPipeline },
  { href: "/agenda", label: "Agenda", Icon: IconCalendar },
  { href: "/automatizaciones", label: "Automatizaciones", Icon: IconBolt },
  { href: "/reportes", label: "Reportes", Icon: IconChart },
  { href: "/asistente", label: "Asistente IA", Icon: IconSparkles },
];

/** Accesos que se muestran en la barra inferior del móvil (los 4 clave + IA). */
export const mobileNavItems: NavItem[] = [
  navItems[0],
  navItems[1],
  navItems[2],
  navItems[3],
  navItems[7],
];
