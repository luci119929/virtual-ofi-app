import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";

// Rutas de la app que exigen sesión (chequeo optimista por cookie).
const PROTECTED_PREFIXES = [
  "/panel",
  "/propiedades",
  "/clientes",
  "/pipeline",
  "/agenda",
  "/automatizaciones",
  "/reportes",
  "/asistente",
  "/auditoria",
];

const AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Sin sesión en ruta protegida → login
  if (isProtected && !hasSession) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // Con sesión visitando login/register → panel
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/panel", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Corre en todo salvo estáticos/_next/api/archivos con extensión.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
