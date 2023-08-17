/*
  Warnings:

  - You are about to drop the column `dias` on the `disponibilidad` table. All the data in the column will be lost.
  - You are about to drop the column `minutosReserva` on the `disponibilidad` table. All the data in the column will be lost.
  - You are about to drop the column `localidad` on the `establecimiento` table. All the data in the column will be lost.
  - You are about to drop the column `disciplinaDisciplina` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `pagoId` on the `reserva` table. All the data in the column will be lost.
  - Added the required column `idLocalidad` to the `establecimiento` table without a default value. This is not possible if the table is not empty.
  - Made the column `idJugador` on table `reserva` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "reserva" DROP CONSTRAINT "reserva_pagoId_fkey";

-- AlterTable
ALTER TABLE "disponibilidad" DROP COLUMN "dias",
DROP COLUMN "minutosReserva";

-- AlterTable
ALTER TABLE "establecimiento" DROP COLUMN "localidad",
ADD COLUMN     "idLocalidad" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "reserva" DROP COLUMN "disciplinaDisciplina",
DROP COLUMN "pagoId",
ALTER COLUMN "idJugador" SET NOT NULL;

-- CreateTable
CREATE TABLE "dia" (
    "dia" TEXT NOT NULL,

    CONSTRAINT "dia_pkey" PRIMARY KEY ("dia")
);

-- CreateTable
CREATE TABLE "localidad" (
    "idLocalidad" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigoPostal" TEXT NOT NULL,
    "idProvincia" TEXT NOT NULL,

    CONSTRAINT "localidad_pkey" PRIMARY KEY ("idLocalidad")
);

-- CreateTable
CREATE TABLE "provincia" (
    "provincia" TEXT NOT NULL,

    CONSTRAINT "provincia_pkey" PRIMARY KEY ("provincia")
);

-- CreateTable
CREATE TABLE "_diaTodisponibilidad" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_diaTodisponibilidad_AB_unique" ON "_diaTodisponibilidad"("A", "B");

-- CreateIndex
CREATE INDEX "_diaTodisponibilidad_B_index" ON "_diaTodisponibilidad"("B");

-- AddForeignKey
ALTER TABLE "establecimiento" ADD CONSTRAINT "establecimiento_idLocalidad_fkey" FOREIGN KEY ("idLocalidad") REFERENCES "localidad"("idLocalidad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localidad" ADD CONSTRAINT "localidad_idProvincia_fkey" FOREIGN KEY ("idProvincia") REFERENCES "provincia"("provincia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_diaTodisponibilidad" ADD CONSTRAINT "_diaTodisponibilidad_A_fkey" FOREIGN KEY ("A") REFERENCES "dia"("dia") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_diaTodisponibilidad" ADD CONSTRAINT "_diaTodisponibilidad_B_fkey" FOREIGN KEY ("B") REFERENCES "disponibilidad"("idDisponibilidad") ON DELETE CASCADE ON UPDATE CASCADE;
