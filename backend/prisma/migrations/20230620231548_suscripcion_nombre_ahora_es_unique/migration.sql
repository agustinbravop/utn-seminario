/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `suscripcion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "suscripcion_nombre_key" ON "suscripcion"("nombre");
