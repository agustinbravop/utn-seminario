/*
  Warnings:

  - You are about to drop the `_canchaTodisciplina` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_canchaTodisciplina" DROP CONSTRAINT "_canchaTodisciplina_A_fkey";

-- DropForeignKey
ALTER TABLE "_canchaTodisciplina" DROP CONSTRAINT "_canchaTodisciplina_B_fkey";

-- DropTable
DROP TABLE "_canchaTodisciplina";
