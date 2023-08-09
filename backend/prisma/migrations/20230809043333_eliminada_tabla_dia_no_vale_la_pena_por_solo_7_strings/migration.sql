/*
  Warnings:

  - You are about to drop the `_diaTodisponibilidad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_diaTodisponibilidad" DROP CONSTRAINT "_diaTodisponibilidad_A_fkey";

-- DropForeignKey
ALTER TABLE "_diaTodisponibilidad" DROP CONSTRAINT "_diaTodisponibilidad_B_fkey";

-- AlterTable
ALTER TABLE "disponibilidad" ADD COLUMN     "dias" TEXT[];

-- DropTable
DROP TABLE "_diaTodisponibilidad";

-- DropTable
DROP TABLE "dia";
