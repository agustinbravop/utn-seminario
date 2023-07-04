/*
  Warnings:

  - Made the column `descripcion` on table `cancha` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cancha" ALTER COLUMN "descripcion" SET NOT NULL;
