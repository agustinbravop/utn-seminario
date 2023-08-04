/*
  Warnings:

  - Added the required column `estaEliminada` to the `cancha` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estaEliminada` to the `establecimiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio` to the `reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cancha" ADD COLUMN     "estaEliminada" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "establecimiento" ADD COLUMN     "estaEliminada" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "reserva" ADD COLUMN     "precio" DOUBLE PRECISION NOT NULL;
