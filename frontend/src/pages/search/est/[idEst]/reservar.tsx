import { useParams } from "react-router";
import { HStack, Heading, Input, Select, Text } from "@chakra-ui/react";
import {
  BuscarDisponibilidadResult,
  useBuscarDisponibilidades,
  useEstablecimientoByID,
} from "@/utils/api";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import { useMemo } from "react";
import { TablaDisponibilidadesReservables } from "@/components/display";
import { horaADecimal } from "@/utils/dates";
import { useBusqueda } from "@/hooks";
import { BusquedaFiltros } from "@/hooks/useBusqueda";

function filtrarDisponibilidades(
  disps: BuscarDisponibilidadResult[],
  filtros: BusquedaFiltros
) {
  let filtradas = disps;
  if (filtros.disciplina) {
    filtradas = disps.filter((d) => d.disciplina === filtros.disciplina);
  }
  return filtradas.sort(
    (a, b) => horaADecimal(a.horaInicio) - horaADecimal(b.horaInicio)
  );
}

export default function ReservarEstablecimientoPage() {
  const { idEst } = useParams();

  const { filtros, setFiltro } = useBusqueda();
  const { data: est } = useEstablecimientoByID(Number(idEst));
  const { data: disps } = useBuscarDisponibilidades({
    idEst: Number(idEst),
    ...filtros,
  });
  const disciplinas = useMemo(
    () => [...new Set(disps?.map((c) => c.disciplina))],
    [disps]
  );

  if (!est || !disps) {
    return <LoadingSpinner />;
  }

  const disponibilidadesFiltradas = filtrarDisponibilidades(disps, filtros);

  return (
    <>
      <Heading textAlign="center" mt="40px">
        {est?.nombre}
      </Heading>

      <HStack>
        <Select
          placeholder="Disciplina"
          width="150px"
          my="20px"
          fontSize="sm"
          name="disciplina"
          value={filtros.disciplina}
          onChange={(e) => setFiltro("disciplina", e.target.value)}
        >
          {disciplinas.map((d, idx) => (
            <option value={d} key={idx}>
              {d}
            </option>
          ))}
        </Select>
        <Input
          type="date"
          name="fecha"
          value={filtros.fecha}
          onChange={(e) => setFiltro("fecha", e.target.value)}
          width="fit-content"
        />
      </HStack>

      <Heading size="md">Horarios disponibles</Heading>
      <Text mb="1em">Seleccione un horario a reservar.</Text>
      <TablaDisponibilidadesReservables data={disponibilidadesFiltradas} />
    </>
  );
}
