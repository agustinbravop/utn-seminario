/*
  Warnings:

  - Changed the type of `horaFin` on the `disponibilidad` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `horaInicio` on the `disponibilidad` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "disponibilidad" DROP COLUMN "horaFin",
ADD COLUMN     "horaFin" CHAR(5) NOT NULL,
DROP COLUMN "horaInicio",
ADD COLUMN     "horaInicio" CHAR(5) NOT NULL;
