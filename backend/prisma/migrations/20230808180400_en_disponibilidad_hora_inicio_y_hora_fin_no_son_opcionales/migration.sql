/*
  Warnings:

  - Made the column `horaFin` on table `disponibilidad` required. This step will fail if there are existing NULL values in that column.
  - Made the column `horaInicio` on table `disponibilidad` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "disponibilidad" ALTER COLUMN "horaFin" SET NOT NULL,
ALTER COLUMN "horaInicio" SET NOT NULL;
