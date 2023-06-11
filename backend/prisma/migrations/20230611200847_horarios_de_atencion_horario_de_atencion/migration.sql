/*
  Warnings:

  - You are about to drop the `horariosDeAtencion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "horariosDeAtencion" DROP CONSTRAINT "horariosDeAtencion_diaDeSemana_fkey";

-- DropForeignKey
ALTER TABLE "horariosDeAtencion" DROP CONSTRAINT "horariosDeAtencion_idEstablecimiento_fkey";

-- DropTable
DROP TABLE "horariosDeAtencion";

-- CreateTable
CREATE TABLE "horarioDeAtencion" (
    "idHorariosDeAtencion" SERIAL NOT NULL,
    "horaApertura" TIME(6) NOT NULL,
    "horaCierre" TIME(6) NOT NULL,
    "idEstablecimiento" INTEGER NOT NULL,
    "diaDeSemana" VARCHAR NOT NULL,

    CONSTRAINT "horarioDeAtencion_pkey" PRIMARY KEY ("idHorariosDeAtencion")
);

-- AddForeignKey
ALTER TABLE "horarioDeAtencion" ADD CONSTRAINT "horarioDeAtencion_idEstablecimiento_fkey" FOREIGN KEY ("idEstablecimiento") REFERENCES "establecimiento"("idEstablecimiento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "horarioDeAtencion" ADD CONSTRAINT "horarioDeAtencion_diaDeSemana_fkey" FOREIGN KEY ("diaDeSemana") REFERENCES "diaDeSemana"("diaDeSemana") ON DELETE NO ACTION ON UPDATE NO ACTION;
