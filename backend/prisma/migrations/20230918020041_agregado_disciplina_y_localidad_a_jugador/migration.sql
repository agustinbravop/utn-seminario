-- AlterTable
ALTER TABLE "jugador" ADD COLUMN     "disciplina" VARCHAR,
ADD COLUMN     "idLocalidad" INTEGER;

-- AddForeignKey
ALTER TABLE "jugador" ADD CONSTRAINT "jugador_idLocalidad_fkey" FOREIGN KEY ("idLocalidad") REFERENCES "localidad"("idLocalidad") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jugador" ADD CONSTRAINT "jugador_disciplina_fkey" FOREIGN KEY ("disciplina") REFERENCES "disciplina"("disciplina") ON DELETE SET NULL ON UPDATE CASCADE;
