/*
  Warnings:

  - You are about to drop the column `estaEliminada` on the `establecimiento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "establecimiento" DROP COLUMN "estaEliminada",
ADD COLUMN     "eliminado" BOOLEAN NOT NULL DEFAULT false;
