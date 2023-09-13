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
import { useCanchaByID } from "@/utils/api/canchas";
import { Link, useParams } from "@/router";

import React, { useState } from "react";
import { FALLBACK_IMAGE_SRC } from "@/utils/consts/consts";
import { useEstablecimientoByID } from "@/utils/api/establecimientos";

export default function VistaJugadorCancha() {
  const { idEst, idCancha } = useParams("/est/:idEst/canchas/:idCancha");

  const { data } = useCanchaByID(Number(idEst), Number(idCancha));
  const { data: dataEstab } = useEstablecimientoByID(Number(idEst));

  if (!data) {
    return <p>Cargando...</p>;
  }

  const [disciplina, setDisciplina] = useState("");

  const disciplinas = data?.disciplinas.filter((valor, indice, self) => {
    return self.indexOf(valor) === indice;
  });

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDisciplina(event.target.value);
  };

  return (
    <div>
      <Heading textAlign="center" paddingBottom="12" mt="40px">
        {dataEstab?.nombre} - {data?.nombre}
      </Heading>

      <Box justifyContent="center">
        <Card
          justifyContent="center"
          style={{ marginTop: "10px", marginBottom: "1rem" }}
          // height="80%"
          width="100%"
          display="flex"
          flexDirection={{ base: "column", md: "row" }} // Cambio de dirección en dispositivos móviles
        >
          <CardHeader>
            <Box>
              <Image
                src={
                  !(data?.urlImagen === null)
                    ? data?.urlImagen
                    : FALLBACK_IMAGE_SRC
                }
                width="500px"
                // height="200px"
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
                <Text fontSize="sm">{data?.descripcion}</Text>
              </Box>
              <Box>
                <Heading size="xs">Disciplinas</Heading>
                <Text fontSize="sm">
                  {disciplinas.map((disciplina, index) => (
                    <React.Fragment key={index}>
                      {disciplina}
                      {index !== data.disciplinas.length - 1 && " - "}
                    </React.Fragment>
                  ))}
                </Text>
              </Box>
              <Box>
                <Heading size="xs">Habilitación</Heading>
                <Text fontSize="sm">
                  Esta cancha {data.habilitada ? "" : "no"} se encuentra
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
                  onChange={handleSelectChange}
                >
                  {disciplinas.map((d) => (
                    <option value={d}>{d}</option>
                  ))}
                </Select>
                <TableContainer paddingTop="15px" paddingBottom="20px">
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
                                    {dia === "Miércoles" ? "X" : dia.charAt(0)}
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
              {/* <Box width='100%' display='flex' justifyContent='center' pt="10px">
                <Stack direction="row" spacing={50}>
                  <Link to="canchas"><Button colorScheme='gray'>Ver canchas</Button></Link>
                  <Link to="reservar"><Button colorScheme='green'>Reservar</Button></Link>
                </Stack>
              </Box> */}
            </Stack>
          </CardBody>
        </Card>
      </Box>
    </div>
  );
}
