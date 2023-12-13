import {
  Box,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  Select,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import {
  BuscarDisponibilidadResult,
  useBuscarDisponibilidades,
  useCanchaByID,
} from "@/utils/api";
import { useParams } from "@/router";
import { FALLBACK_IMAGE_SRC } from "@/utils/constants";
import { useEstablecimientoByID } from "@/utils/api";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import FormReservarDisponibilidad from "./_formReservar";
import { useBusqueda } from "@/hooks";
import { formatFecha, getHoraActual, horaADecimal } from "@/utils/dates";
import { BusquedaFiltros } from "@/hooks/useBusqueda";

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

export default function VistaJugadorCancha() {
  const { idEst, idCancha } = useParams("/search/est/:idEst/canchas/:idCancha");
  const { filtros, setFiltro } = useBusqueda();

  const { data: cancha } = useCanchaByID(Number(idEst), Number(idCancha));
  const { data: est } = useEstablecimientoByID(Number(idEst));
  const { data: disps } = useBuscarDisponibilidades({
    idCancha: cancha?.id,
    ...filtros,
  });

  if (!cancha || !disps) {
    return <LoadingSpinner />;
  }

  const dispsFiltradas = filtrarDisponibilidades(disps, filtros);

  return (
    <>
      <Heading textAlign="center" my="20px">
        {est?.nombre}: {cancha?.nombre}
      </Heading>

      <Card
        justify="center"
        maxW={{ base: "600px", lg: "1250px" }}
        m="auto"
        display="flex"
        // Cambio de dirección en dispositivos móviles
        flexDirection={{ base: "column", lg: "row" }}
      >
        <CardHeader>
          <Image
            src={cancha?.urlImagen}
            fallbackSrc={FALLBACK_IMAGE_SRC}
            maxH="400px"
            maxW="600px"
            minW="350px"
            m="auto"
            objectFit="cover"
            borderRadius="10px"
          />
        </CardHeader>
        <CardBody mt="0px" flex="1">
          <Stack divider={<StackDivider />} spacing="1">
            <Box>
              <Heading size="xs" margin="0">
                Descripción
              </Heading>
              <Text fontSize="sm">{cancha?.descripcion}</Text>
            </Box>
            <Box>
              <Heading size="xs">Disciplinas</Heading>
              <Text fontSize="sm">{cancha.disciplinas.join(" - ")}</Text>
            </Box>
            <Box>
              <Heading size="xs">Habilitación</Heading>
              <Text fontSize="sm">
                Esta cancha {cancha.habilitada ? "" : "no"} se encuentra
                habilitada
              </Text>
            </Box>
            <Box>
              <Heading size="xs">Disponibilidades</Heading>
              <Text fontSize="sm">
                Estas son las disponibilidades de la cancha:
              </Text>

              <HStack my="20px">
                <FormControl w="unset" variant="floating">
                  <Select
                    placeholder="Todas"
                    w="150px"
                    fontSize="sm"
                    name="disciplina"
                    value={filtros.disciplina}
                    onChange={(e) => setFiltro("disciplina", e.target.value)}
                  >
                    {cancha.disciplinas.map((d, idx) => (
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
                    value={filtros.fecha}
                    onChange={(e) => setFiltro("fecha", e.target.value)}
                    w="fit-content"
                    min={formatFecha(new Date())}
                  />
                  <FormLabel>Fecha</FormLabel>
                </FormControl>
              </HStack>

              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Inicio</Th>
                      <Th>Fin</Th>
                      <Th>Disciplina</Th>
                      {/* <Th>Días</Th> */}
                      <Th>Precio</Th>
                      <Th>Seña</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {dispsFiltradas.map((d) => (
                      <Tr key={d.id}>
                        <Td>{d.horaInicio}</Td>
                        <Td>{d.horaFin}</Td>
                        <Td>{d.disciplina}</Td>
                        {/* <Td>
                          {ordenarDias(d.dias)
                            .map((dia) => DIAS_ABBR[dia])
                            .join(", ")}
                        </Td> */}
                        <Td>${d.precioReserva}</Td>
                        <Td>{d.precioSenia ? `$${d.precioSenia}` : "-"}</Td>
                        <Td>
                          <FormReservarDisponibilidad disp={d} />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </>
  );
}
