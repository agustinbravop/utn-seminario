/*
  Warnings:

  - The primary key for the `cancha` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `estahabilitada` on the `cancha` table. All the data in the column will be lost.
  - You are about to drop the column `idcancha` on the `cancha` table. All the data in the column will be lost.
  - You are about to drop the column `urlimagen` on the `cancha` table. All the data in the column will be lost.
  - The primary key for the `disciplina` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nombredisciplina` on the `disciplina` table. All the data in the column will be lost.
  - The primary key for the `disponibilidad` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `duracionreservaminutos` on the `disponibilidad` table. All the data in the column will be lost.
  - You are about to drop the column `horafin` on the `disponibilidad` table. All the data in the column will be lost.
  - You are about to drop the column `horainicio` on the `disponibilidad` table. All the data in the column will be lost.
  - You are about to drop the column `idcancha` on the `disponibilidad` table. All the data in the column will be lost.
  - You are about to drop the column `iddisponibilidad` on the `disponibilidad` table. All the data in the column will be lost.
  - You are about to drop the column `precioreserva` on the `disponibilidad` table. All the data in the column will be lost.
  - You are about to drop the column `preciose¤a` on the `disponibilidad` table. All the data in the column will be lost.
  - The primary key for the `establecimiento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `establecimiento` table. All the data in the column will be lost.
  - You are about to drop the column `idadministrador` on the `establecimiento` table. All the data in the column will be lost.
  - You are about to drop the column `idestablecimiento` on the `establecimiento` table. All the data in the column will be lost.
  - You are about to drop the column `idhorariosdeatencion` on the `establecimiento` table. All the data in the column will be lost.
  - You are about to drop the column `urlimagen` on the `establecimiento` table. All the data in the column will be lost.
  - The primary key for the `jugador` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idjugador` on the `jugador` table. All the data in the column will be lost.
  - The primary key for the `pago` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fechapago` on the `pago` table. All the data in the column will be lost.
  - You are about to drop the column `idpago` on the `pago` table. All the data in the column will be lost.
  - You are about to drop the column `metodopago` on the `pago` table. All the data in the column will be lost.
  - The primary key for the `reserva` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `disciplina` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `fechareserva` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `horafin` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `horainicio` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `idcancha` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `idjugador` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `idpagoreserva` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `idpagose¤a` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `idreserva` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the `canchapordisciplina` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `canchapordisponibilidad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `diasdesemana` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `disponibilidadpordiadesemana` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `establecimientopormetodopago` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `horariosdeatencion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `metododepago` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pago_suscripcion` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[correo]` on the table `establecimiento` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `estaHabilitada` to the `cancha` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urlImagen` to the `cancha` table without a default value. This is not possible if the table is not empty.
  - Made the column `nombre` on table `cancha` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idEstablecimiento` on table `cancha` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `disciplina` to the `disciplina` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minutosDuracionReserva` to the `disponibilidad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precioReserva` to the `disponibilidad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precioSenia` to the `disponibilidad` table without a default value. This is not possible if the table is not empty.
  - Made the column `disciplina` on table `disponibilidad` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `correo` to the `establecimiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idAdministrador` to the `establecimiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localidad` to the `establecimiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provincia` to the `establecimiento` table without a default value. This is not possible if the table is not empty.
  - Made the column `nombre` on table `establecimiento` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefono` on table `establecimiento` required. This step will fail if there are existing NULL values in that column.
  - Made the column `direccion` on table `establecimiento` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `fechaPago` to the `pago` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metodoDePago` to the `pago` table without a default value. This is not possible if the table is not empty.
  - Made the column `monto` on table `pago` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `fechaReserva` to the `reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaFin` to the `reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaInicio` to the `reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idCancha` to the `reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idDisciplina` to the `reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idPagoReserva` to the `reserva` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cancha" DROP CONSTRAINT "cancha_idEstablecimiento_fkey";

-- DropForeignKey
ALTER TABLE "canchapordisciplina" DROP CONSTRAINT "disciplinaid";

-- DropForeignKey
ALTER TABLE "canchapordisciplina" DROP CONSTRAINT "idcancha";

-- DropForeignKey
ALTER TABLE "canchapordisponibilidad" DROP CONSTRAINT "idcancha";

-- DropForeignKey
ALTER TABLE "canchapordisponibilidad" DROP CONSTRAINT "iddisponibilidad";

-- DropForeignKey
ALTER TABLE "disponibilidad" DROP CONSTRAINT "disciplina";

-- DropForeignKey
ALTER TABLE "disponibilidad" DROP CONSTRAINT "idcancha";

-- DropForeignKey
ALTER TABLE "disponibilidadpordiadesemana" DROP CONSTRAINT "diasdesemana";

-- DropForeignKey
ALTER TABLE "disponibilidadpordiadesemana" DROP CONSTRAINT "iddisponibilidad";

-- DropForeignKey
ALTER TABLE "establecimiento" DROP CONSTRAINT "administradorid";

-- DropForeignKey
ALTER TABLE "establecimiento" DROP CONSTRAINT "horariosdeatencionid";

-- DropForeignKey
ALTER TABLE "establecimientopormetodopago" DROP CONSTRAINT "establecimientoid";

-- DropForeignKey
ALTER TABLE "establecimientopormetodopago" DROP CONSTRAINT "metododepagoid";

-- DropForeignKey
ALTER TABLE "horariosdeatencion" DROP CONSTRAINT "diasdesemana";

-- DropForeignKey
ALTER TABLE "pago" DROP CONSTRAINT "metodopago";

-- DropForeignKey
ALTER TABLE "pago_suscripcion" DROP CONSTRAINT "adminid";

-- DropForeignKey
ALTER TABLE "reserva" DROP CONSTRAINT "disciplina";

-- DropForeignKey
ALTER TABLE "reserva" DROP CONSTRAINT "idcancha";

-- DropForeignKey
ALTER TABLE "reserva" DROP CONSTRAINT "idjugador";

-- DropForeignKey
ALTER TABLE "reserva" DROP CONSTRAINT "idpagose¤a";

-- DropForeignKey
ALTER TABLE "reserva" DROP CONSTRAINT "pagoreserva";

-- AlterTable
ALTER TABLE "cancha" DROP CONSTRAINT "cancha_pkey",
DROP COLUMN "estahabilitada",
DROP COLUMN "idcancha",
DROP COLUMN "urlimagen",
ADD COLUMN     "estaHabilitada" BOOLEAN NOT NULL,
ADD COLUMN     "idCancha" SERIAL NOT NULL,
ADD COLUMN     "urlImagen" VARCHAR NOT NULL,
ALTER COLUMN "nombre" SET NOT NULL,
ALTER COLUMN "idEstablecimiento" SET NOT NULL,
ADD CONSTRAINT "cancha_pkey" PRIMARY KEY ("idCancha");

-- AlterTable
ALTER TABLE "disciplina" DROP CONSTRAINT "disciplina_pkey",
DROP COLUMN "nombredisciplina",
ADD COLUMN     "disciplina" VARCHAR NOT NULL,
ADD CONSTRAINT "disciplina_pkey" PRIMARY KEY ("disciplina");

-- AlterTable
ALTER TABLE "disponibilidad" DROP CONSTRAINT "disponibilidad_pkey",
DROP COLUMN "duracionreservaminutos",
DROP COLUMN "horafin",
DROP COLUMN "horainicio",
DROP COLUMN "idcancha",
DROP COLUMN "iddisponibilidad",
DROP COLUMN "precioreserva",
DROP COLUMN "preciose¤a",
ADD COLUMN     "horaFin" TIME(6),
ADD COLUMN     "horaInicio" TIME(6),
ADD COLUMN     "idDisponibilidad" SERIAL NOT NULL,
ADD COLUMN     "minutosDuracionReserva" INTEGER NOT NULL,
ADD COLUMN     "precioReserva" DECIMAL NOT NULL,
ADD COLUMN     "precioSenia" DECIMAL NOT NULL,
ALTER COLUMN "disciplina" SET NOT NULL,
ADD CONSTRAINT "disponibilidad_pkey" PRIMARY KEY ("idDisponibilidad");

-- AlterTable
ALTER TABLE "establecimiento" DROP CONSTRAINT "establecimiento_pkey",
DROP COLUMN "email",
DROP COLUMN "idadministrador",
DROP COLUMN "idestablecimiento",
DROP COLUMN "idhorariosdeatencion",
DROP COLUMN "urlimagen",
ADD COLUMN     "correo" VARCHAR NOT NULL,
ADD COLUMN     "idAdministrador" INTEGER NOT NULL,
ADD COLUMN     "idEstablecimiento" SERIAL NOT NULL,
ADD COLUMN     "localidad" VARCHAR NOT NULL,
ADD COLUMN     "provincia" VARCHAR NOT NULL,
ADD COLUMN     "urlImagen" VARCHAR,
ALTER COLUMN "nombre" SET NOT NULL,
ALTER COLUMN "telefono" SET NOT NULL,
ALTER COLUMN "telefono" SET DATA TYPE TEXT,
ALTER COLUMN "direccion" SET NOT NULL,
ADD CONSTRAINT "establecimiento_pkey" PRIMARY KEY ("idEstablecimiento");

-- AlterTable
ALTER TABLE "jugador" DROP CONSTRAINT "jugador_pkey",
DROP COLUMN "idjugador",
ADD COLUMN     "idJugador" SERIAL NOT NULL,
ALTER COLUMN "telefono" SET DATA TYPE VARCHAR,
ADD CONSTRAINT "jugador_pkey" PRIMARY KEY ("idJugador");

-- AlterTable
ALTER TABLE "pago" DROP CONSTRAINT "pago_pkey",
DROP COLUMN "fechapago",
DROP COLUMN "idpago",
DROP COLUMN "metodopago",
ADD COLUMN     "fechaPago" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "idPago" SERIAL NOT NULL,
ADD COLUMN     "metodoDePago" VARCHAR NOT NULL,
ALTER COLUMN "monto" SET NOT NULL,
ADD CONSTRAINT "pago_pkey" PRIMARY KEY ("idPago");

-- AlterTable
ALTER TABLE "reserva" DROP CONSTRAINT "rserva_pkey",
DROP COLUMN "disciplina",
DROP COLUMN "estado",
DROP COLUMN "fechareserva",
DROP COLUMN "horafin",
DROP COLUMN "horainicio",
DROP COLUMN "idcancha",
DROP COLUMN "idjugador",
DROP COLUMN "idpagoreserva",
DROP COLUMN "idpagose¤a",
DROP COLUMN "idreserva",
ADD COLUMN     "disciplinaDisciplina" VARCHAR,
ADD COLUMN     "fechaReserva" DATE NOT NULL,
ADD COLUMN     "horaFin" TIME(6) NOT NULL,
ADD COLUMN     "horaInicio" TIME(6) NOT NULL,
ADD COLUMN     "idCancha" INTEGER NOT NULL,
ADD COLUMN     "idDisciplina" VARCHAR NOT NULL,
ADD COLUMN     "idJugador" INTEGER,
ADD COLUMN     "idPagoReserva" INTEGER NOT NULL,
ADD COLUMN     "idPagoSenia" INTEGER,
ADD COLUMN     "idReserva" SERIAL NOT NULL,
ADD COLUMN     "pagoId" INTEGER,
ADD CONSTRAINT "reserva_pkey" PRIMARY KEY ("idReserva");

-- AlterTable
ALTER TABLE "suscripcion" ALTER COLUMN "costoMensual" SET DATA TYPE DECIMAL(65,30);

-- DropTable
DROP TABLE "canchapordisciplina";

-- DropTable
DROP TABLE "canchapordisponibilidad";

-- DropTable
DROP TABLE "diasdesemana";

-- DropTable
DROP TABLE "disponibilidadpordiadesemana";

-- DropTable
DROP TABLE "establecimientopormetodopago";

-- DropTable
DROP TABLE "horariosdeatencion";

-- DropTable
DROP TABLE "metododepago";

-- DropTable
DROP TABLE "pago_suscripcion";

-- CreateTable
CREATE TABLE "diaDeSemana" (
    "diaDeSemana" VARCHAR NOT NULL,

    CONSTRAINT "diaDeSemana_pkey" PRIMARY KEY ("diaDeSemana")
);

-- CreateTable
CREATE TABLE "metodoDePago" (
    "metodoDePago" VARCHAR NOT NULL,

    CONSTRAINT "metodoDePago_pkey" PRIMARY KEY ("metodoDePago")
);

-- CreateTable
CREATE TABLE "horariosDeAtencion" (
    "idHorariosDeAtencion" SERIAL NOT NULL,
    "horaApertura" TIME(6) NOT NULL,
    "horaCierre" TIME(6) NOT NULL,
    "idEstablecimiento" INTEGER NOT NULL,
    "diaDeSemana" VARCHAR NOT NULL,

    CONSTRAINT "horariosDeAtencion_pkey" PRIMARY KEY ("idHorariosDeAtencion")
);

-- CreateTable
CREATE TABLE "pagoSuscripcion" (
    "idPagoSuscripcion" SERIAL NOT NULL,
    "monto" DECIMAL NOT NULL,
    "fechaPago" TIMESTAMP(6) NOT NULL,
    "fechaVencimiento" TIMESTAMP(6) NOT NULL,
    "idAdministrador" INTEGER NOT NULL,

    CONSTRAINT "pagoSuscripcion_pkey" PRIMARY KEY ("idPagoSuscripcion")
);

-- CreateTable
CREATE TABLE "_canchaTodisciplina" (
    "A" INTEGER NOT NULL,
    "B" VARCHAR NOT NULL
);

-- CreateTable
CREATE TABLE "_canchaTodisponibilidad" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_diaDeSemanaTodisponibilidad" (
    "A" VARCHAR NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_establecimientoTometodoDePago" (
    "A" INTEGER NOT NULL,
    "B" VARCHAR NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_canchaTodisciplina_AB_unique" ON "_canchaTodisciplina"("A", "B");

-- CreateIndex
CREATE INDEX "_canchaTodisciplina_B_index" ON "_canchaTodisciplina"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_canchaTodisponibilidad_AB_unique" ON "_canchaTodisponibilidad"("A", "B");

-- CreateIndex
CREATE INDEX "_canchaTodisponibilidad_B_index" ON "_canchaTodisponibilidad"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_diaDeSemanaTodisponibilidad_AB_unique" ON "_diaDeSemanaTodisponibilidad"("A", "B");

-- CreateIndex
CREATE INDEX "_diaDeSemanaTodisponibilidad_B_index" ON "_diaDeSemanaTodisponibilidad"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_establecimientoTometodoDePago_AB_unique" ON "_establecimientoTometodoDePago"("A", "B");

-- CreateIndex
CREATE INDEX "_establecimientoTometodoDePago_B_index" ON "_establecimientoTometodoDePago"("B");

-- CreateIndex
CREATE UNIQUE INDEX "establecimiento_correo_key" ON "establecimiento"("correo");

-- AddForeignKey
ALTER TABLE "cancha" ADD CONSTRAINT "cancha_idEstablecimiento_fkey" FOREIGN KEY ("idEstablecimiento") REFERENCES "establecimiento"("idEstablecimiento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "disponibilidad" ADD CONSTRAINT "disponibilidad_disciplina_fkey" FOREIGN KEY ("disciplina") REFERENCES "disciplina"("disciplina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establecimiento" ADD CONSTRAINT "establecimiento_idAdministrador_fkey" FOREIGN KEY ("idAdministrador") REFERENCES "administrador"("idAdministrador") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "horariosDeAtencion" ADD CONSTRAINT "horariosDeAtencion_idEstablecimiento_fkey" FOREIGN KEY ("idEstablecimiento") REFERENCES "establecimiento"("idEstablecimiento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "horariosDeAtencion" ADD CONSTRAINT "horariosDeAtencion_diaDeSemana_fkey" FOREIGN KEY ("diaDeSemana") REFERENCES "diaDeSemana"("diaDeSemana") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_metodoDePago_fkey" FOREIGN KEY ("metodoDePago") REFERENCES "metodoDePago"("metodoDePago") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagoSuscripcion" ADD CONSTRAINT "pagoSuscripcion_idAdministrador_fkey" FOREIGN KEY ("idAdministrador") REFERENCES "administrador"("idAdministrador") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_idCancha_fkey" FOREIGN KEY ("idCancha") REFERENCES "cancha"("idCancha") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_idPagoReserva_fkey" FOREIGN KEY ("idPagoReserva") REFERENCES "pago"("idPago") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_idPagoSenia_fkey" FOREIGN KEY ("idPagoSenia") REFERENCES "pago"("idPago") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_idJugador_fkey" FOREIGN KEY ("idJugador") REFERENCES "jugador"("idJugador") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_idDisciplina_fkey" FOREIGN KEY ("idDisciplina") REFERENCES "disciplina"("disciplina") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "pago"("idPago") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_canchaTodisciplina" ADD CONSTRAINT "_canchaTodisciplina_A_fkey" FOREIGN KEY ("A") REFERENCES "cancha"("idCancha") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_canchaTodisciplina" ADD CONSTRAINT "_canchaTodisciplina_B_fkey" FOREIGN KEY ("B") REFERENCES "disciplina"("disciplina") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_canchaTodisponibilidad" ADD CONSTRAINT "_canchaTodisponibilidad_A_fkey" FOREIGN KEY ("A") REFERENCES "cancha"("idCancha") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_canchaTodisponibilidad" ADD CONSTRAINT "_canchaTodisponibilidad_B_fkey" FOREIGN KEY ("B") REFERENCES "disponibilidad"("idDisponibilidad") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_diaDeSemanaTodisponibilidad" ADD CONSTRAINT "_diaDeSemanaTodisponibilidad_A_fkey" FOREIGN KEY ("A") REFERENCES "diaDeSemana"("diaDeSemana") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_diaDeSemanaTodisponibilidad" ADD CONSTRAINT "_diaDeSemanaTodisponibilidad_B_fkey" FOREIGN KEY ("B") REFERENCES "disponibilidad"("idDisponibilidad") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_establecimientoTometodoDePago" ADD CONSTRAINT "_establecimientoTometodoDePago_A_fkey" FOREIGN KEY ("A") REFERENCES "establecimiento"("idEstablecimiento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_establecimientoTometodoDePago" ADD CONSTRAINT "_establecimientoTometodoDePago_B_fkey" FOREIGN KEY ("B") REFERENCES "metodoDePago"("metodoDePago") ON DELETE CASCADE ON UPDATE CASCADE;
