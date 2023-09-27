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
import { useCanchaByID } from "@/utils/api";
import { useParams } from "@/router";

import React, { useState } from "react";
import { FALLBACK_IMAGE_SRC } from "@/utils/consts/consts";

export default function VistaJugadorCancha() {
  const { idEst, idCancha } = useParams("/ests/:idEst/canchas/:idCancha");

  const { data } = useCanchaByID(Number(idEst), Number(idCancha));
  const [disciplina, setDisciplina] = useState("");

  if (!data) {
    return <p>Cargando...</p>;
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDisciplina(event.target.value);
  };

  return (
    <div>
      <Box justifyContent="center" width="25rem">
        <Card
          boxSize="1rem"
          justifyContent="center"
          display="flex"
          style={{ marginTop: "10px", marginBottom: "1rem" }}
          height="75%"
          width="90%"
        >
          <CardHeader>
            <Box justifyContent="center" display="flex">
              <Image
                src={
                  !(data?.urlImagen === null)
                    ? data?.urlImagen
                    : FALLBACK_IMAGE_SRC
                }
                width="300px"
                height="200px"
                objectFit="cover"
                borderRadius="10px"
              />
            </Box>
          </CardHeader>
          <CardBody height="100%" mt="-10px">
            <Box
              display="flex"
              justifyContent="left"
              height="100%"
              width="100%"
            >
              <Box mt="55px" height="100%">
                <Stack divider={<StackDivider />} spacing="1" mt="-2rem">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Descripción
                    </Heading>
                    <Text fontSize="sm">{data.descripcion}</Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Disciplinas
                    </Heading>
                    <Text fontSize="sm">
                      {data.disciplinas.map((disciplina, index) => (
                        <React.Fragment key={index}>
                          {disciplina}
                          {index !== data.disciplinas.length - 1 && " - "}
                        </React.Fragment>
                      ))}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Habilitación
                    </Heading>
                    <Text fontSize="sm">
                      Esta cancha {data.habilitada ? "" : "no"} se encuentra
                      habilitada
                    </Text>
                  </Box>

                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Disponibilidades
                    </Heading>
                    <Text fontSize="sm">
                      Estas son las disponibilidades de la cancha.
                    </Text>

                    <Select
                      placeholder="Disciplina"
                      width="150px"
                      mt="10px"
                      fontSize="sm"
                      onChange={handleSelectChange}
                    >
                      {data.disciplinas.map((d) => (
                        <option value={d}>{d}</option>
                      ))}
                    </Select>
                    <TableContainer paddingTop="15px" pb="20px">
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>horario</Th>
                            <Th>precio</Th>
                            <Th> dias </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {data.disponibilidades.map(
                            (d) =>
                              d.disciplina === disciplina && (
                                <Tr key={d.id}>
                                  <Td>
                                    {d.horaInicio}- {d.horaFin}
                                  </Td>
                                  <Td> ${d.precioReserva} </Td>
                                  <Td>
                                    {d.dias.map((dia, index) => (
                                      <React.Fragment key={index}>
                                        {dia}
                                        {index !== d.dias.length - 1 && " - "}
                                      </React.Fragment>
                                    ))}
                                  </Td>
                                </Tr>
                              )
                          )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </div>
  );
}
