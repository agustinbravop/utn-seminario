import { useQuery } from "@tanstack/react-query";
import {  Establecimiento } from "../../models";
import { useNavigate, useParams } from "react-router";
import { Box, Button, Card, CardBody, HStack, Heading, Icon, Input, InputGroup, InputRightElement, Stack, StackDivider, Text } from "@chakra-ui/react";
import { getEstablecimientoByID } from "../../utils/api/establecimientos";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { GrAddCircle } from "react-icons/gr";
import Alerta from "../../components/Alerta/Alerta";
import { useState } from "react";
import EstabPage from "../EstabPage/EstabPage";
import { Image } from "@chakra-ui/react";

export default function CourtPage() {
  const navigate = useNavigate();
  const { idEst } = useParams();


  const { data: establecimientoData, isLoading: establecimientoLoading, isError: establecimientoError } = useQuery<Establecimiento>(
    ["establecimiento", idEst],
    () => getEstablecimientoByID(Number(idEst))
  );


  return (
    <div>
      <EstabPage/>
      <Box
      display="flex"
      justifyContent="center" 
      alignItems="center" 
      height="70%" 
    >
        <Card
        boxSize="43rem"
        justifyContent="center"
        display="flex"
        style={{ marginTop:"100px", marginBottom: "1rem" }}
        height="70%"
        >
            <CardBody height="100%" marginTop="30px">
            <Stack divider={<StackDivider />} spacing="1" marginTop="-2rem">
                <Box>
                    <Image src={establecimientoData?.urlImagen} width="400px" borderRadius="10px"/>
                </Box>
                <Box>
                <Heading size="xs" textTransform="uppercase">
                    Direccion
                </Heading>
                <Text fontSize="sm">
                    {establecimientoData?.direccion}
                </Text>
                </Box>
                <Box>
                <Heading size="xs" textTransform="uppercase">
                    Horario atencion
                </Heading>
                <Text fontSize="sm">{establecimientoData?.horariosDeAtencion}</Text>
                </Box>
                <Box>
                <Heading size="xs" textTransform="uppercase">
                    Correo de contacto
                </Heading>
                <Text fontSize="sm">{establecimientoData?.correo}</Text>
                </Box>
                <Box>
                <Heading size="xs" textTransform="uppercase">
                    Numero de teléfono
                </Heading>
                <Text fontSize="sm">{establecimientoData?.telefono}</Text>
                </Box>
                <Box>
                <Heading size="xs" textTransform="uppercase">
                   Localidad
                </Heading>
                <Text fontSize="sm">
                    {establecimientoData?.localidad}, {establecimientoData?.provincia}
                </Text>
                </Box>
            </Stack>
            </CardBody>
            </Card>
    </Box>
      
    </div>
  );
}

