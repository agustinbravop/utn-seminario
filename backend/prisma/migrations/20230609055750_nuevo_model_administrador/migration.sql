/*
  Warnings:

  - You are about to drop the `administrador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cancha` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `canchapordisciplina` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `canchapordisponibilidad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `diasdesemana` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `disciplina` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `disponibilidad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `disponibilidadpordiadesemana` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `establecimiento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `establecimientopormetodopago` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `horariosdeatencion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jugador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `metododepago` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pago` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pago_suscripcion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reserva` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `suscripcion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tarjeta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."administrador" DROP CONSTRAINT "suscripcionid";

-- DropForeignKey
ALTER TABLE "public"."administrador" DROP CONSTRAINT "tarjetaid";

-- DropForeignKey
ALTER TABLE "public"."cancha" DROP CONSTRAINT "establecimientoid";

-- DropForeignKey
ALTER TABLE "public"."canchapordisciplina" DROP CONSTRAINT "disciplinaid";

-- DropForeignKey
ALTER TABLE "public"."canchapordisciplina" DROP CONSTRAINT "idcancha";

-- DropForeignKey
ALTER TABLE "public"."canchapordisponibilidad" DROP CONSTRAINT "idcancha";

-- DropForeignKey
ALTER TABLE "public"."canchapordisponibilidad" DROP CONSTRAINT "iddisponibilidad";

-- DropForeignKey
ALTER TABLE "public"."disponibilidad" DROP CONSTRAINT "disciplina";

-- DropForeignKey
ALTER TABLE "public"."disponibilidad" DROP CONSTRAINT "idcancha";

-- DropForeignKey
ALTER TABLE "public"."disponibilidadpordiadesemana" DROP CONSTRAINT "diasdesemana";

-- DropForeignKey
ALTER TABLE "public"."disponibilidadpordiadesemana" DROP CONSTRAINT "iddisponibilidad";

-- DropForeignKey
ALTER TABLE "public"."establecimiento" DROP CONSTRAINT "administradorid";

-- DropForeignKey
ALTER TABLE "public"."establecimiento" DROP CONSTRAINT "horariosdeatencionid";

-- DropForeignKey
ALTER TABLE "public"."establecimientopormetodopago" DROP CONSTRAINT "establecimientoid";

-- DropForeignKey
ALTER TABLE "public"."establecimientopormetodopago" DROP CONSTRAINT "metododepagoid";

-- DropForeignKey
ALTER TABLE "public"."horariosdeatencion" DROP CONSTRAINT "diasdesemana";

-- DropForeignKey
ALTER TABLE "public"."pago" DROP CONSTRAINT "metodopago";

-- DropForeignKey
ALTER TABLE "public"."pago_suscripcion" DROP CONSTRAINT "adminid";

-- DropForeignKey
ALTER TABLE "public"."reserva" DROP CONSTRAINT "disciplina";

-- DropForeignKey
ALTER TABLE "public"."reserva" DROP CONSTRAINT "idcancha";

-- DropForeignKey
ALTER TABLE "public"."reserva" DROP CONSTRAINT "idjugador";

-- DropForeignKey
ALTER TABLE "public"."reserva" DROP CONSTRAINT "idpagose¤a";

-- DropForeignKey
ALTER TABLE "public"."reserva" DROP CONSTRAINT "pagoreserva";

-- DropTable
DROP TABLE "public"."administrador";

-- DropTable
DROP TABLE "public"."cancha";

-- DropTable
DROP TABLE "public"."canchapordisciplina";

-- DropTable
DROP TABLE "public"."canchapordisponibilidad";

-- DropTable
DROP TABLE "public"."diasdesemana";

-- DropTable
DROP TABLE "public"."disciplina";

-- DropTable
DROP TABLE "public"."disponibilidad";

-- DropTable
DROP TABLE "public"."disponibilidadpordiadesemana";

-- DropTable
DROP TABLE "public"."establecimiento";

-- DropTable
DROP TABLE "public"."establecimientopormetodopago";

-- DropTable
DROP TABLE "public"."horariosdeatencion";

-- DropTable
DROP TABLE "public"."jugador";

-- DropTable
DROP TABLE "public"."metododepago";

-- DropTable
DROP TABLE "public"."pago";

-- DropTable
DROP TABLE "public"."pago_suscripcion";

-- DropTable
DROP TABLE "public"."reserva";

-- DropTable
DROP TABLE "public"."suscripcion";

-- DropTable
DROP TABLE "public"."tarjeta";

-- CreateTable
CREATE TABLE "administrador" (
    "idAdministrador" SERIAL NOT NULL,
    "usuario" VARCHAR NOT NULL,
    "correo" VARCHAR NOT NULL,
    "clave" VARCHAR NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "apellido" VARCHAR NOT NULL,
    "telefono" VARCHAR NOT NULL,
    "idSuscripcion" INTEGER NOT NULL,
    "idtarjeta" INTEGER NOT NULL,

    CONSTRAINT "administrador_pkey" PRIMARY KEY ("idAdministrador")
);

-- CreateTable
CREATE TABLE "cancha" (
    "idcancha" SERIAL NOT NULL,
    "nombre" VARCHAR,
    "descripcion" VARCHAR,
    "estahabilitada" BOOLEAN,
    "urlimagen" VARCHAR,
    "idestablecimiento" INTEGER,

    CONSTRAINT "cancha_pkey" PRIMARY KEY ("idcancha")
);

-- CreateTable
CREATE TABLE "canchapordisciplina" (
    "idcancha" INTEGER NOT NULL,
    "disciplina" VARCHAR NOT NULL,

    CONSTRAINT "canchapordisciplina_pkey" PRIMARY KEY ("idcancha","disciplina")
);

-- CreateTable
CREATE TABLE "canchapordisponibilidad" (
    "idcancha" INTEGER NOT NULL,
    "iddisponibilidad" INTEGER NOT NULL,

    CONSTRAINT "canchapordisponibilidad_pkey" PRIMARY KEY ("idcancha","iddisponibilidad")
);

-- CreateTable
CREATE TABLE "diasdesemana" (
    "diasemana" VARCHAR NOT NULL,

    CONSTRAINT "diasdesemana_pkey" PRIMARY KEY ("diasemana")
);

-- CreateTable
CREATE TABLE "disciplina" (
    "nombredisciplina" VARCHAR NOT NULL,

    CONSTRAINT "disciplina_pkey" PRIMARY KEY ("nombredisciplina")
);

-- CreateTable
CREATE TABLE "disponibilidad" (
    "iddisponibilidad" SERIAL NOT NULL,
    "horainicio" TIME(6),
    "horafin" TIME(6),
    "duracionreservaminutos" INTEGER,
    "precioreserva" DECIMAL,
    "preciose¤a" DECIMAL,
    "idcancha" INTEGER,
    "disciplina" VARCHAR,

    CONSTRAINT "disponibilidad_pkey" PRIMARY KEY ("iddisponibilidad")
);

-- CreateTable
CREATE TABLE "disponibilidadpordiadesemana" (
    "iddisponibilidad" INTEGER NOT NULL,
    "diadesemana" VARCHAR NOT NULL,

    CONSTRAINT "disponibilidadpordiadesemana_pkey" PRIMARY KEY ("iddisponibilidad","diadesemana")
);

-- CreateTable
CREATE TABLE "establecimiento" (
    "idestablecimiento" SERIAL NOT NULL,
    "nombre" VARCHAR,
    "telefono" INTEGER,
    "direccion" VARCHAR,
    "urlimagen" VARCHAR,
    "email" VARCHAR,
    "idadministrador" INTEGER,
    "idhorariosdeatencion" INTEGER,

    CONSTRAINT "establecimiento_pkey" PRIMARY KEY ("idestablecimiento")
);

-- CreateTable
CREATE TABLE "establecimientopormetodopago" (
    "idestablecimiento" INTEGER NOT NULL,
    "metododepago" VARCHAR NOT NULL,

    CONSTRAINT "establecimientopormetodopago_pkey" PRIMARY KEY ("idestablecimiento","metododepago")
);

-- CreateTable
CREATE TABLE "horariosdeatencion" (
    "idhorariosatencion" SERIAL NOT NULL,
    "horaapertura" TIME(6),
    "horacierre" TIME(6),
    "diasemana" VARCHAR,

    CONSTRAINT "horariosdeatencion_pkey" PRIMARY KEY ("idhorariosatencion")
);

-- CreateTable
CREATE TABLE "jugador" (
    "idjugador" SERIAL NOT NULL,
    "nombre" VARCHAR,
    "nombreusuario" VARCHAR,
    "apellido" VARCHAR,
    "telefono" INTEGER,
    "email" VARCHAR,
    "clave" VARCHAR,

    CONSTRAINT "jugador_pkey" PRIMARY KEY ("idjugador")
);

-- CreateTable
CREATE TABLE "metododepago" (
    "metodopago" VARCHAR NOT NULL,

    CONSTRAINT "metododepago_pkey" PRIMARY KEY ("metodopago")
);

-- CreateTable
CREATE TABLE "pago" (
    "idpago" SERIAL NOT NULL,
    "monto" DECIMAL,
    "fechapago" TIMESTAMP(6),
    "metodopago" VARCHAR,

    CONSTRAINT "pago_pkey" PRIMARY KEY ("idpago")
);

-- CreateTable
CREATE TABLE "pago_suscripcion" (
    "idpago" INTEGER NOT NULL,
    "adminid" INTEGER,
    "monto" DECIMAL,
    "fechapago" TIMESTAMP(6),
    "fechavencimiento" TIMESTAMP(6),

    CONSTRAINT "pago_suscripcion_pkey" PRIMARY KEY ("idpago")
);

-- CreateTable
CREATE TABLE "reserva" (
    "idreserva" SERIAL NOT NULL,
    "fechareserva" DATE,
    "horainicio" TIME(6),
    "horafin" TIME(6),
    "estado" VARCHAR,
    "idcancha" INTEGER,
    "disciplina" VARCHAR,
    "idpagoreserva" INTEGER,
    "idpagose¤a" INTEGER,
    "idjugador" INTEGER,

    CONSTRAINT "rserva_pkey" PRIMARY KEY ("idreserva")
);

-- CreateTable
CREATE TABLE "suscripcion" (
    "idsuscripcion" SERIAL NOT NULL,
    "nombre" VARCHAR,
    "limiteestablecimiento" INTEGER,
    "costomensual" INTEGER,

    CONSTRAINT "suscripcion_pkey" PRIMARY KEY ("idsuscripcion")
);

-- CreateTable
CREATE TABLE "tarjeta" (
    "idtarjeta" SERIAL NOT NULL,
    "nombre" VARCHAR,
    "numero" INTEGER,
    "cvv" INTEGER,
    "fechavencimiento" TIMESTAMP(6),

    CONSTRAINT "tarjeta_pkey" PRIMARY KEY ("idtarjeta")
);

-- AddForeignKey
ALTER TABLE "administrador" ADD CONSTRAINT "suscripcionid" FOREIGN KEY ("idSuscripcion") REFERENCES "suscripcion"("idsuscripcion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "administrador" ADD CONSTRAINT "tarjetaid" FOREIGN KEY ("idtarjeta") REFERENCES "tarjeta"("idtarjeta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cancha" ADD CONSTRAINT "establecimientoid" FOREIGN KEY ("idestablecimiento") REFERENCES "establecimiento"("idestablecimiento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "canchapordisciplina" ADD CONSTRAINT "disciplinaid" FOREIGN KEY ("disciplina") REFERENCES "disciplina"("nombredisciplina") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "canchapordisciplina" ADD CONSTRAINT "idcancha" FOREIGN KEY ("idcancha") REFERENCES "cancha"("idcancha") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "canchapordisponibilidad" ADD CONSTRAINT "idcancha" FOREIGN KEY ("idcancha") REFERENCES "cancha"("idcancha") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "canchapordisponibilidad" ADD CONSTRAINT "iddisponibilidad" FOREIGN KEY ("iddisponibilidad") REFERENCES "disponibilidad"("iddisponibilidad") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "disponibilidad" ADD CONSTRAINT "disciplina" FOREIGN KEY ("disciplina") REFERENCES "disciplina"("nombredisciplina") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "disponibilidad" ADD CONSTRAINT "idcancha" FOREIGN KEY ("idcancha") REFERENCES "cancha"("idcancha") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "disponibilidadpordiadesemana" ADD CONSTRAINT "diasdesemana" FOREIGN KEY ("diadesemana") REFERENCES "diasdesemana"("diasemana") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "disponibilidadpordiadesemana" ADD CONSTRAINT "iddisponibilidad" FOREIGN KEY ("iddisponibilidad") REFERENCES "disponibilidad"("iddisponibilidad") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "establecimiento" ADD CONSTRAINT "administradorid" FOREIGN KEY ("idadministrador") REFERENCES "administrador"("idAdministrador") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "establecimiento" ADD CONSTRAINT "horariosdeatencionid" FOREIGN KEY ("idhorariosdeatencion") REFERENCES "horariosdeatencion"("idhorariosatencion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "establecimientopormetodopago" ADD CONSTRAINT "establecimientoid" FOREIGN KEY ("idestablecimiento") REFERENCES "establecimiento"("idestablecimiento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "establecimientopormetodopago" ADD CONSTRAINT "metododepagoid" FOREIGN KEY ("metododepago") REFERENCES "metododepago"("metodopago") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "horariosdeatencion" ADD CONSTRAINT "diasdesemana" FOREIGN KEY ("diasemana") REFERENCES "diasdesemana"("diasemana") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "metodopago" FOREIGN KEY ("metodopago") REFERENCES "metododepago"("metodopago") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pago_suscripcion" ADD CONSTRAINT "adminid" FOREIGN KEY ("adminid") REFERENCES "administrador"("idAdministrador") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "disciplina" FOREIGN KEY ("disciplina") REFERENCES "disciplina"("nombredisciplina") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "idcancha" FOREIGN KEY ("idcancha") REFERENCES "cancha"("idcancha") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "idjugador" FOREIGN KEY ("idjugador") REFERENCES "jugador"("idjugador") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "idpagose¤a" FOREIGN KEY ("idpagose¤a") REFERENCES "pago"("idpago") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "pagoreserva" FOREIGN KEY ("idpagoreserva") REFERENCES "pago"("idpago") ON DELETE NO ACTION ON UPDATE NO ACTION;
