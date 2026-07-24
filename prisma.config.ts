import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7: la URL de conexión para migraciones/CLI vive acá (ya no en el schema).
// El cliente en runtime usa el driver adapter (ver src/lib/db.ts).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
