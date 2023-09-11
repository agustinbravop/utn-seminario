/*
  Warnings:

  - You are about to drop the column `horaFin` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `horaInicio` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `idCancha` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `idDisciplina` on the `reserva` table. All the data in the column will be lost.
  - Added the required column `idDisponibilidad` to the `reserva` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reserva" DROP CONSTRAINT "reserva_idCancha_fkey";

-- DropForeignKey
ALTER TABLE "reserva" DROP CONSTRAINT "reserva_idDisciplina_fkey";

-- AlterTable
ALTER TABLE "reserva" DROP COLUMN "horaFin",
DROP COLUMN "horaInicio",
DROP COLUMN "idCancha",
DROP COLUMN "idDisciplina",
ADD COLUMN     "idDisponibilidad" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_idDisponibilidad_fkey" FOREIGN KEY ("idDisponibilidad") REFERENCES "disponibilidad"("idDisponibilidad") ON DELETE NO ACTION ON UPDATE NO ACTION;
