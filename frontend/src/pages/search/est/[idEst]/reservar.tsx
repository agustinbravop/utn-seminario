import { useParams } from "react-router";
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  BuscarDisponibilidadResult,
  useBuscarDisponibilidades,
  useEstablecimientoByID,
} from "@/utils/api";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import { TablaDisponibilidadesReservables } from "@/components/display";
import { formatFecha, getHoraActual, horaADecimal } from "@/utils/dates";
import { useBusqueda, useCurrentAdmin } from "@/hooks";
import { BusquedaFiltros } from "@/hooks/useBusqueda";
import { QuestionAlert } from "@/components/media-and-icons";
import { useSearchParams } from "react-router-dom";
import { EstablecimientoBreadcrumb } from "@/components/navigation";

function filtrarDisponibilidades(
  disps: BuscarDisponibilidadResult[],
  filtros: BusquedaFiltros
) {
  if (filtros.fecha === formatFecha(new Date())) {
    disps = disps.filter((disp) => disp.horaInicio > getHoraActual());
  }
  return disps.sort(
    (a, b) => horaADecimal(a.horaInicio) - horaADecimal(b.horaInicio)
  );
}

export default function ReservarEstablecimientoPage() {
  const { idEst } = useParams();
  const { isAdmin } = useCurrentAdmin();
  const [, setSearchParams] = useSearchParams();

  const { filtros, setFiltro } = useBusqueda();
  const { data: est } = useEstablecimientoByID(Number(idEst));
  const { data: disps } = useBuscarDisponibilidades({
    idEst: Number(idEst),
    ...filtros,
  });

  if (!est || !disps) {
    return <LoadingSpinner />;
  }

  const dispsFiltradas = filtrarDisponibilidades(disps, filtros);

  return (
    <Box mx={{ base: "2vw", lg: "12%" }}>
      {isAdmin && <EstablecimientoBreadcrumb />}
      <Heading textAlign="center">{est?.nombre}</Heading>

      <Stack my="20px" direction={["column", "row"]}>
        <FormControl w="unset" variant="floating">
          <Select
            placeholder="Todas"
            name="disciplina"
            w="fit-content"
            value={filtros.disciplina}
            onChange={(e) => setFiltro("disciplina", e.target.value)}
          >
            {est.disciplinas.map((d, idx) => (
              <option value={d} key={idx}>
                {d}
              </option>
            ))}
          </Select>
          <FormLabel>Disciplina</FormLabel>
        </FormControl>
        <FormControl w="unset" variant="floating">
          <Input
            type="date"
            name="fecha"
            w="fit-content"
            min={formatFecha(new Date())}
            value={filtros.fecha}
            onChange={(e) => {
              setFiltro("fecha", e.target.value);
              setSearchParams({ fecha: e.target.value });
            }}
          />
          <FormLabel>Fecha</FormLabel>
        </FormControl>
      </Stack>

      <Heading size="md">Horarios disponibles</Heading>
      <Text mb="1em">Seleccione un horario a reservar.</Text>

      <TablaDisponibilidadesReservables data={dispsFiltradas} />
      {dispsFiltradas.length === 0 && (
        <QuestionAlert>
          No hay horarios disponibles para esa fecha.
        </QuestionAlert>
      )}
    </Box>
  );
}
