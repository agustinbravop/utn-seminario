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
      <Heading size="md" fontSize="26px" textAlign="left" marginLeft="18%" marginTop="20px" > Información </Heading>
      <Box
      display="flex"
      marginLeft="18%" 
      height="70%" 
    >
        <Card
        boxSize="43rem"
        justifyContent="center"
        display="flex"
        style={{ marginTop:"10px", marginBottom: "1rem" }}
        height="75%"
        width="73%"
        >
            <CardBody height="100%" marginTop="0px">
                <Box display="grid" gridTemplateColumns="1fr 1fr" height="100%">
                        <Box >
                            <Image src={establecimientoData?.urlImagen} width="1000px"  height="400px" objectFit="cover" borderRadius="10px"/>
                        </Box>
                        
                        <Box marginTop="55px" marginLeft=" 50px" height="100%">
                            <Stack divider={<StackDivider />} spacing="1" marginTop="-2rem">
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
                        </Box>
                </Box>
            </CardBody>
            </Card>
    </Box>
      
    </div>
  );
}

