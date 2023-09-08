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
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function DetailEstablecimiento() {
  const { idEst } = useParams();
  

  const { data } = useEstablecimientoByID(Number(idEst));

  return (
    <Box justifyContent="center">
      <Card
        boxSize="10rem"
        justifyContent="center"
        style={{ marginTop: "10px", marginBottom: "1rem" }}
        height="80%"
        width="100%"
      >
        <CardHeader>
          <Box>
            <Image
              src={!(data?.urlImagen === null) ? data?.urlImagen : FALLBACK_IMAGE_SRC}
              width="500px"
              height="200px"
              objectFit="cover"
              borderRadius="10px"
            />
          </Box>
        </CardHeader>
        <CardBody height="100%" marginTop="0px">
          <Box display="grid" height="100%" width="100%">
            <Box marginTop="35px" ml='10px' height="100%">
              <Stack divider={<StackDivider />} spacing="1" marginTop="-2rem">
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Dirección
                  </Heading>
                  <Text fontSize="sm">{data?.direccion}</Text>
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
                <Box height="100%">
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
  );
}
