import {
  Box,
  Button,
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
import { useCanchaByID } from "@/utils/api/canchas";
import { useParams } from "@/router";

import React, { useState, useEffect } from "react";
import { DIAS_ABBR, FALLBACK_IMAGE_SRC } from "@/utils/consts/consts";
import { useEstablecimientoByID } from "@/utils/api/establecimientos";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { Link } from "react-router-dom";
import FormReservarDisponibilidad from "./_formReservar";

export default function VistaJugadorCancha() {
  const { idEst, idCancha } = useParams(
    "/jugador/:idJugador/est/:idEst/canchas/:idCancha"
  );

  const { data: cancha } = useCanchaByID(Number(idEst), Number(idCancha));
  const { data: est } = useEstablecimientoByID(Number(idEst));

  const [disciplina, setDisciplina] = useState(cancha?.disciplinas[0] ?? "");

  useEffect(() => {
    setDisciplina(cancha?.disciplinas[0] ?? "");
  }, [cancha]);

  if (!cancha) {
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
      <Heading textAlign="center" paddingBottom="12" mt="40px">
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
          <CardBody marginTop="0px" flex="1">
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
                  defaultValue={disciplina}
                  onChange={handleDisciplinaChange}
                >
                  {disciplinas.map((d, idx) => (
                    <option value={d} key={idx}>
                      {d}
                    </option>
                  ))}
                </Select>
                <TableContainer paddingTop="15px" paddingBottom="20px">
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>horario</Th>
                        <Th>precio</Th>
                        <Th>dias</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {cancha.disponibilidades.map(
                        (d) =>
                          d.disciplina === disciplina && (
                            <Tr key={d.id}>
                              <Td>
                                {d.horaInicio}- {d.horaFin}
                              </Td>
                              <Td> ${d.precioReserva} </Td>
                              <Td>
                                {d.dias
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
              <Box
                width="100%"
                display="flex"
                justifyContent="center"
                pt="10px"
              >
                <Stack direction="row" spacing={50}>
                  <Link to="canchas">
                    <Button colorScheme="gray">Ver canchas</Button>
                  </Link>
                  <Link to="reservar">
                    <Button colorScheme="green">Reservar</Button>
                  </Link>
                </Stack>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    </div>
  );
}
