import "dotenv/config";
import { PrismaClient, type Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_ORG_ID = "seed-org-demo";
const DEMO_PASSWORD = "virtualofi123";

const demoUsers: { email: string; name: string; role: Role }[] = [
  { email: "admin@demo.com", name: "Ana Administradora", role: "ADMIN" },
  { email: "supervisor@demo.com", name: "Sergio Supervisor", role: "SUPERVISOR" },
  { email: "agente@demo.com", name: "Agustina Agente", role: "AGENT" },
  { email: "propietario@demo.com", name: "Pedro Propietario", role: "OWNER" },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const org = await prisma.organization.upsert({
    where: { id: DEMO_ORG_ID },
    update: {},
    create: { id: DEMO_ORG_ID, name: "Inmobiliaria Demo" },
  });

  for (const u of demoUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, orgId: org.id },
      create: {
        orgId: org.id,
        email: u.email,
        name: u.name,
        role: u.role,
        passwordHash,
      },
    });
  }

  console.log("✔ Seed listo. Organización:", org.name);
  console.log("  Usuarios demo (contraseña:", DEMO_PASSWORD + "):");
  demoUsers.forEach((u) => console.log(`  · ${u.role.padEnd(10)} ${u.email}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
