import { useQuery } from "@tanstack/react-query";
import { Establecimiento } from "@/models";
import { useParams } from "react-router";
import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { getEstablecimientoByID } from "@/utils/api/establecimientos";
import SubMenu from "@/components/SubMenu/SubMenu";
import { Image } from "@chakra-ui/react";
import { EditIcon} from "@chakra-ui/icons";
import { Link } from "react-router-dom";

export default function CourtPage() {
  const { idEst } = useParams();

  const { data } = useQuery<Establecimiento>(["establecimientos", idEst], () =>
    getEstablecimientoByID(Number(idEst))
  );

  return (
    <>
      <SubMenu/>
      <Heading size="md" fontSize="26px" textAlign="left" marginLeft="18%" marginTop="20px" > Información </Heading>
      <HStack marginRight="auto" marginLeft="18%" marginBottom="1px" marginTop="20px" >
            <HStack marginLeft="auto" marginRight="10%" display="flex" alignContent="column" spacing={5} align="center" >
            <Link to="editar">
              <Button leftIcon={<EditIcon />}>Editar Info</Button>
            </Link>
            </HStack> 
            </HStack>
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
                            <Image src={data?.urlImagen} width="1000px"  height="400px" objectFit="cover" borderRadius="10px"/>
                        </Box>
                        
                        <Box marginTop="55px" marginLeft=" 50px" height="100%">
                            <Stack divider={<StackDivider />} spacing="1" marginTop="-2rem">
                                <Box>
                                <Heading size="xs" textTransform="uppercase">
                                    Dirección
                                </Heading>
                                <Text fontSize="sm">
                                    {data?.direccion}
                                </Text>
                                </Box>
                                <Box>
                                <Heading size="xs" textTransform="uppercase">
                                    Horario atencion
                                </Heading>
                                <Text fontSize="sm">{data?.horariosDeAtencion}</Text>
                                </Box>
                                <Box>
                                <Heading size="xs" textTransform="uppercase">
                                    Correo de contacto
                                </Heading>
                                <Text fontSize="sm">{data?.correo}</Text>
                                </Box>
                                <Box>
                                <Heading size="xs" textTransform="uppercase">
                                    Numero de teléfono
                                </Heading>
                                <Text fontSize="sm">{data?.telefono}</Text>
                                </Box>
                                <Box>
                                <Heading size="xs" textTransform="uppercase">
                                Localidad
                                </Heading>
                                <Text fontSize="sm">
                                    {data?.localidad}, {data?.provincia}
                                </Text>
                                </Box>
                            </Stack>
                        </Box>
                </Box>
            </CardBody>
            </Card>
    </Box>
    </>
  );
}
