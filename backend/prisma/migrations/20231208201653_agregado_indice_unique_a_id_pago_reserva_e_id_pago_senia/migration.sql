/*
  Warnings:

  - A unique constraint covering the columns `[idPagoReserva]` on the table `reserva` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idPagoSenia]` on the table `reserva` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reserva_idPagoReserva_key" ON "reserva"("idPagoReserva");

-- CreateIndex
CREATE UNIQUE INDEX "reserva_idPagoSenia_key" ON "reserva"("idPagoSenia");
