/*
  Warnings:

  - You are about to drop the column `limitEstablecimiento` on the `suscripcion` table. All the data in the column will be lost.
  - Added the required column `limiteEstablecimientos` to the `suscripcion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "suscripcion" DROP COLUMN "limitEstablecimiento",
ADD COLUMN     "limiteEstablecimientos" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tarjeta" ALTER COLUMN "vencimiento" SET DATA TYPE TEXT;
