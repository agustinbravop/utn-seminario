/*
  Warnings:

  - You are about to alter the column `precio` on the `reserva` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal`.

*/
-- AlterTable
ALTER TABLE "reserva" ALTER COLUMN "precio" SET DATA TYPE DECIMAL;
