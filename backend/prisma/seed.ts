import { PrismaClient } from "@prisma/client";
import { Dia } from "../src/models/disponibilidad";

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

async function upsertDia(dia: string) {
  return await prisma.dia.upsert({
    where: { dia },
    update: { dia },
    create: { dia },
  });
}

async function main() {
  // Se cargan las suscripciones.
  const startup = await upsertSuscripcion("Startup", 1, 3999.0);
  const premium = await upsertSuscripcion("Premium", 3, 5999.0);
  const enterprise = await upsertSuscripcion("Enterprise", 10, 8999.0);

  console.info({ startup, premium, enterprise });

  // Se cargan los días de la semana.
  const lun = await upsertDia(Dia.Lunes);
  const mar = await upsertDia(Dia.Martes);
  const mie = await upsertDia(Dia.Miercoles);
  const jue = await upsertDia(Dia.Jueves);
  const vie = await upsertDia(Dia.Viernes);
  const sab = await upsertDia(Dia.Sabado);
  const dom = await upsertDia(Dia.Domingo);

  console.info({ lun, mar, mie, jue, vie, sab, dom });
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
