/*
  Warnings:

  - You are about to drop the column `fechaReserva` on the `reserva` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idDisponibilidad,fechaReservada]` on the table `reserva` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fechaReservada` to the `reserva` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "reserva_idDisponibilidad_fechaReserva_key";

-- AlterTable
ALTER TABLE "reserva" DROP COLUMN "fechaReserva",
ADD COLUMN     "fechaCreada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fechaReservada" DATE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reserva_idDisponibilidad_fechaReservada_key" ON "reserva"("idDisponibilidad", "fechaReservada");
