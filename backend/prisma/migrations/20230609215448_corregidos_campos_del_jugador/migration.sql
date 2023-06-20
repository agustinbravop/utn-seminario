/*
  Warnings:

  - You are about to drop the column `email` on the `jugador` table. All the data in the column will be lost.
  - You are about to drop the column `nombreusuario` on the `jugador` table. All the data in the column will be lost.
  - Added the required column `correo` to the `jugador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario` to the `jugador` table without a default value. This is not possible if the table is not empty.
  - Made the column `nombre` on table `jugador` required. This step will fail if there are existing NULL values in that column.
  - Made the column `apellido` on table `jugador` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefono` on table `jugador` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clave` on table `jugador` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "jugador" DROP COLUMN "email",
DROP COLUMN "nombreusuario",
ADD COLUMN     "correo" VARCHAR NOT NULL,
ADD COLUMN     "usuario" VARCHAR NOT NULL,
ALTER COLUMN "nombre" SET NOT NULL,
ALTER COLUMN "apellido" SET NOT NULL,
ALTER COLUMN "telefono" SET NOT NULL,
ALTER COLUMN "clave" SET NOT NULL;
