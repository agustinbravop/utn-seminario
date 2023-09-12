/*
  Warnings:

  - A unique constraint covering the columns `[idDisponibilidad,fechaReserva]` on the table `reserva` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reserva_idDisponibilidad_fechaReserva_key" ON "reserva"("idDisponibilidad", "fechaReserva");
