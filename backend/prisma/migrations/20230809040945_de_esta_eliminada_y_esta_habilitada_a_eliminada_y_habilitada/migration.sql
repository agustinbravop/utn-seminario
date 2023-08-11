/*
  Warnings:

  - You are about to drop the column `estaEliminada` on the `cancha` table. All the data in the column will be lost.
  - You are about to drop the column `estaHabilitada` on the `cancha` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cancha" DROP COLUMN "estaEliminada",
DROP COLUMN "estaHabilitada",
ADD COLUMN     "eliminada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "habilitada" BOOLEAN NOT NULL DEFAULT true;
