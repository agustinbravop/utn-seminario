/*
  Warnings:

  - A unique constraint covering the columns `[idEstablecimiento,nombre]` on the table `establecimiento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usuario]` on the table `jugador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[correo]` on the table `jugador` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "establecimiento_idEstablecimiento_nombre_key" ON "establecimiento"("idEstablecimiento", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "jugador_usuario_key" ON "jugador"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "jugador_correo_key" ON "jugador"("correo");
