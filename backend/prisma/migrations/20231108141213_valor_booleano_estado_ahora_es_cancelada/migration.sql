/*
  Warnings:

  - You are about to drop the column `estado` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `reserva` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reserva" DROP COLUMN "estado",
DROP COLUMN "nombre",
ADD COLUMN     "cancelada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jugadorNoRegistrado" TEXT;
