import {
  Box,
  Card,
  CardBody,
  CardHeader,
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
import { useBuscarDisponibilidades, useCanchaByID } from "@/utils/api";
import { useParams } from "@/router";
import { DIAS_ABBR, FALLBACK_IMAGE_SRC } from "@/utils/constants";
import { useEstablecimientoByID } from "@/utils/api";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import FormReservarDisponibilidad from "./_formReservar";
import { ordenarDias } from "@/utils/dias";
import { useBusqueda } from "@/hooks";

export default function VistaJugadorCancha() {
  const { idEst, idCancha } = useParams("/search/est/:idEst/canchas/:idCancha");
  const { filtros, setFiltro } = useBusqueda();

  const { data: cancha } = useCanchaByID(Number(idEst), Number(idCancha));
  const { data: est } = useEstablecimientoByID(Number(idEst));
  const { data: disponibilidades } = useBuscarDisponibilidades({
    idCancha: cancha?.id,
    ...filtros,
  });

  if (!cancha || !disponibilidades) {
    return <LoadingSpinner />;
  }

  const disciplinas = cancha?.disciplinas;

  return (
    <div>
      <Heading textAlign="center" mt="40px">
        {est?.nombre} - {cancha?.nombre}
      </Heading>

      <Card
        justifyContent="center"
        style={{ marginTop: "10px", marginBottom: "1rem" }}
        width="100%"
        display="flex"
        // Cambio de dirección en dispositivos móviles
        flexDirection={{ base: "column", md: "row" }}
      >
        <CardHeader>
          <Box>
            <Image
              src={cancha?.urlImagen}
              fallbackSrc={FALLBACK_IMAGE_SRC}
              width="500px"
              objectFit="cover"
              borderRadius="10px"
            />
          </Box>
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
              <Text fontSize="sm">{disciplinas.join(" - ")}</Text>
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
              <TableContainer pt="15px" pb="20px">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Horario</Th>
                      <Th>Disciplina</Th>
                      <Th>Días</Th>
                      <Th>Seña</Th>
                      <Th>Precio</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {disponibilidades.map((d) => (
                      <Tr key={d.id}>
                        <Td>
                          {d.horaInicio}-{d.horaFin}hs
                        </Td>
                        <Td>{d.disciplina}</Td>
                        <Td>
                          {ordenarDias(d.dias)
                            .map((dia) => DIAS_ABBR[dia])
                            .join(", ")}
                        </Td>
                        <Td>${d.precioReserva}</Td>
                        <Td>
                          {d.precioSenia ? `$${d.precioSenia}` : "Sin seña"}
                        </Td>
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
    </div>
  );
}
