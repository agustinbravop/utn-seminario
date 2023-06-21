/*
  Warnings:

  - You are about to drop the column `idEstablecimiento` on the `horarioDeAtencion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "horarioDeAtencion" DROP CONSTRAINT "horarioDeAtencion_idEstablecimiento_fkey";

-- AlterTable
ALTER TABLE "establecimiento" ADD COLUMN     "horariosDeAtencion" TEXT;

-- AlterTable
ALTER TABLE "horarioDeAtencion" DROP COLUMN "idEstablecimiento";
