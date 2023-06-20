import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function upsertSuscripcion(
  nombre: string,
  limiteEstablecimientos: number,
  costoMensual: number
) {
  return await prisma.suscripcion.upsert({
    where: { nombre },
    update: {},
    create: {
      nombre,
      limiteEstablecimientos,
      costoMensual,
    },
  });
}

async function main() {
  const startup = await upsertSuscripcion("Startup", 1, 3999.0);
  const premium = await upsertSuscripcion("Premium", 3, 5999.0);
  const enterprise = await upsertSuscripcion("Enterprise", 10, 8999.0);

  console.log({ startup, premium, enterprise });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
