import { useEstablecimientoByID } from "@/utils/api/establecimientos";
import { FALLBACK_IMAGE_SRC } from "@/utils/consts/consts";
import {
  Card,
  CardBody,
  Stack,
  StackDivider,
  Text,
  Heading,
  Box,
  Image,
  CardHeader,
  Button,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function DetailEstablecimiento() {
  const { idEst } = useParams();
  const { data } = useEstablecimientoByID(Number(idEst));

  return (
    <Box justifyContent="center">
      <Card
        justifyContent="center"
        style={{ marginTop: "10px", marginBottom: "1rem" }}
        // height="80%"
        width="100%"
        display="flex"
        flexDirection={{ base: "column", md: "row" }} // Cambio de dirección en dispositivos móviles
      >
        <CardHeader width="100%" >
          <Box width="100%" >
            <Image
              src={
                !(data?.urlImagen === null)
                  ? data?.urlImagen
                  : FALLBACK_IMAGE_SRC
              }
              width="100%"
              height="200px"
              objectFit="cover"
              borderRadius="10px"
            />
          </Box>
        </CardHeader>
        <CardBody marginTop="0px" flex="1">
          <Stack divider={<StackDivider />} spacing="1">
            <Box>
              <Heading size="xs"  margin="0">
                Dirección
              </Heading>
              <Text fontSize="sm">{data?.direccion}</Text>
            </Box>
            <Box>
              <Heading size="xs" >
                Horario atencion
              </Heading>
              <Text fontSize="sm">{data?.horariosDeAtencion}</Text>
            </Box>
            <Box>
              <Heading size="xs" >
                Correo de contacto 
              </Heading>
              <Text fontSize="sm">{data?.correo}</Text>
            </Box>
            <Box>
              <Heading size="xs" >
                Numero de teléfono
              </Heading>
              <Text fontSize="sm">{data?.telefono}</Text>
            </Box>
            <Box>
              <Heading size="xs" >
                Localidad
              </Heading>
              <Text fontSize="sm">
                {data?.localidad}, {data?.provincia}
              </Text>
            </Box>
            <Box width='100%' display='flex' justifyContent='center' pt="10px">
              <Stack direction="row" spacing={50}>
                <Link to="canchas"><Button colorScheme='gray'>Ver canchas</Button></Link>
                <Link to="reservar"><Button colorScheme='green'>Reservar</Button></Link>
              </Stack>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
}
