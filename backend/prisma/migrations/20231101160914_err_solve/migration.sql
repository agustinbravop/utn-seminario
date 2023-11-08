/*
  Warnings:

  - Made the column `idJugador` on table `reserva` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "reserva" ALTER COLUMN "idJugador" SET NOT NULL;
