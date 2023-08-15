/*
  Warnings:

  - A unique constraint covering the columns `[nombre,idProvincia]` on the table `localidad` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provincia` to the `establecimiento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateIndex
CREATE UNIQUE INDEX "localidad_nombre_idProvincia_key" ON "localidad"("nombre", "idProvincia");
