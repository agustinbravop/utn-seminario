/*
  Warnings:

  - You are about to drop the `_canchaTodisponibilidad` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cancha` to the `disponibilidad` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_canchaTodisponibilidad" DROP CONSTRAINT "_canchaTodisponibilidad_A_fkey";

-- DropForeignKey
ALTER TABLE "_canchaTodisponibilidad" DROP CONSTRAINT "_canchaTodisponibilidad_B_fkey";

-- AlterTable
ALTER TABLE "disponibilidad" ADD COLUMN     "cancha" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_canchaTodisponibilidad";

-- AddForeignKey
ALTER TABLE "disponibilidad" ADD CONSTRAINT "disponibilidad_cancha_fkey" FOREIGN KEY ("cancha") REFERENCES "cancha"("idCancha") ON DELETE RESTRICT ON UPDATE CASCADE;
