/*
  Warnings:

  - You are about to drop the column `minutosDuracionReserva` on the `disponibilidad` table. All the data in the column will be lost.
  - You are about to drop the `_diaDeSemanaTodisponibilidad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `diaDeSemana` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `horarioDeAtencion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `minutosReserva` to the `disponibilidad` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_diaDeSemanaTodisponibilidad" DROP CONSTRAINT "_diaDeSemanaTodisponibilidad_A_fkey";

-- DropForeignKey
ALTER TABLE "_diaDeSemanaTodisponibilidad" DROP CONSTRAINT "_diaDeSemanaTodisponibilidad_B_fkey";

-- DropForeignKey
ALTER TABLE "horarioDeAtencion" DROP CONSTRAINT "horarioDeAtencion_diaDeSemana_fkey";

-- AlterTable
ALTER TABLE "disponibilidad" DROP COLUMN "minutosDuracionReserva",
ADD COLUMN     "minutosReserva" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_diaDeSemanaTodisponibilidad";

-- DropTable
DROP TABLE "diaDeSemana";

-- DropTable
DROP TABLE "horarioDeAtencion";

-- CreateTable
CREATE TABLE "dia" (
    "dia" VARCHAR NOT NULL,

    CONSTRAINT "dia_pkey" PRIMARY KEY ("dia")
);

-- CreateTable
CREATE TABLE "_diaTodisponibilidad" (
    "A" VARCHAR NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_diaTodisponibilidad_AB_unique" ON "_diaTodisponibilidad"("A", "B");

-- CreateIndex
CREATE INDEX "_diaTodisponibilidad_B_index" ON "_diaTodisponibilidad"("B");

-- AddForeignKey
ALTER TABLE "_diaTodisponibilidad" ADD CONSTRAINT "_diaTodisponibilidad_A_fkey" FOREIGN KEY ("A") REFERENCES "dia"("dia") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_diaTodisponibilidad" ADD CONSTRAINT "_diaTodisponibilidad_B_fkey" FOREIGN KEY ("B") REFERENCES "disponibilidad"("idDisponibilidad") ON DELETE CASCADE ON UPDATE CASCADE;
