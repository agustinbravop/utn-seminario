import { PrismaClient } from "@prisma/client";
import { Dia } from "../src/models/disponibilidad";
import { MetodoDePago } from "../src/models/pago";

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

async function upsertDisciplina(disciplina: string) {
  return await prisma.disciplina.upsert({
    where: { disciplina },
    update: { disciplina },
    create: { disciplina },
  });
}

async function upsertMetodoDePago(metodoDePago: string) {
  return await prisma.metodoDePago.upsert({
    where: { metodoDePago },
    update: { metodoDePago },
    create: { metodoDePago },
  });
}

async function main() {
  // Se cargan las suscripciones.
  const startup = await upsertSuscripcion("Startup", 1, 3999.0);
  const premium = await upsertSuscripcion("Premium", 3, 5999.0);
  const enterprise = await upsertSuscripcion("Enterprise", 10, 8999.0);

  console.info([startup, premium, enterprise]);

  // Se cargan los días de la semana.
  const lun = await upsertDia(Dia.Lunes);
  const mar = await upsertDia(Dia.Martes);
  const mie = await upsertDia(Dia.Miercoles);
  const jue = await upsertDia(Dia.Jueves);
  const vie = await upsertDia(Dia.Viernes);
  const sab = await upsertDia(Dia.Sabado);
  const dom = await upsertDia(Dia.Domingo);

  console.info([lun, mar, mie, jue, vie, sab, dom]);

  // Se cargan las disciplinas por defecto.
  const futbol = await upsertDisciplina("Fútbol");
  const basquet = await upsertDisciplina("Básquet");
  const tenis = await upsertDisciplina("Tenis");
  const padel = await upsertDisciplina("Pádel");
  const hockey = await upsertDisciplina("Hockey");
  const pingPong = await upsertDisciplina("Ping Pong");

  console.info([futbol, basquet, tenis, padel, hockey, pingPong]);

  // Se cargan todos los métodos de pago soportados.
  const efectivo = await upsertMetodoDePago(MetodoDePago.Efectivo);

  console.info([efectivo]);
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
