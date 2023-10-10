import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Image,
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

import React, { useState, useEffect } from "react";
import { DIAS_ABBR, FALLBACK_IMAGE_SRC } from "@/utils/consts/consts";
import { useEstablecimientoByID } from "@/utils/api";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import FormReservarDisponibilidad from "./_formReservar";
import { ordenarDias } from "@/utils/dias";

export default function VistaJugadorCancha() {
  const { idEst, idCancha } = useParams(
    "/jugador/:idJugador/est/:idEst/canchas/:idCancha"
  );

  const { data: cancha } = useCanchaByID(Number(idEst), Number(idCancha));
  const { data: est } = useEstablecimientoByID(Number(idEst));
  const { data: disponibilidades } = useBuscarDisponibilidades({
    idCancha: cancha?.id,
  });

  const [disciplina, setDisciplina] = useState(cancha?.disciplinas[0] ?? "");

  useEffect(() => {
    // Se setea una disciplina por defecto.
    setDisciplina(cancha?.disciplinas[0] ?? "");
  }, [cancha, setDisciplina]);

  if (!cancha || !disponibilidades) {
    return <LoadingSpinner />;
  }

  const disciplinas = cancha?.disciplinas;

  const handleDisciplinaChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisciplina(event.target.value);
  };

  return (
    <div>
      <Heading textAlign="center" mt="40px">
        {est?.nombre} - {cancha?.nombre}
      </Heading>

      <Box justifyContent="center">
        <Card
          justifyContent="center"
          style={{ marginTop: "10px", marginBottom: "1rem" }}
          width="100%"
          display="flex"
          flexDirection={{ base: "column", md: "row" }} // Cambio de dirección en dispositivos móviles
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
                  Estas son las disponibilidades de la cancha.
                </Text>
                <Select
                  placeholder="Disciplina"
                  width="150px"
                  mt="10px"
                  fontSize="sm"
                  value={disciplina}
                  onChange={handleDisciplinaChange}
                >
                  {disciplinas.map((d, idx) => (
                    <option value={d} key={idx}>
                      {d}
                    </option>
                  ))}
                </Select>
                <TableContainer pt="15px" pb="20px">
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>horario</Th>
                        <Th>precio</Th>
                        <Th>seña</Th>
                        <Th>dias</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {disponibilidades.map(
                        (d) =>
                          d.disciplina === disciplina && (
                            <Tr key={d.id}>
                              <Td>
                                {d.horaInicio}-{d.horaFin}hs
                              </Td>
                              <Td>${d.precioReserva} </Td>
                              <Td>
                                {d.precioSenia
                                  ? `$${d.precioSenia}`
                                  : "Sin seña"}
                              </Td>
                              <Td>
                                {ordenarDias(d.dias)
                                  .map((dia) => DIAS_ABBR[dia])
                                  .join(" - ")}
                              </Td>
                              <Td>
                                <FormReservarDisponibilidad disp={d} />
                              </Td>
                            </Tr>
                          )
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    </div>
  );
}
