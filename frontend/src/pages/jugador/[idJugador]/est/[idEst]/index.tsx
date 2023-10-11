import { useEstablecimientoByID } from "@/utils/api";
import { FALLBACK_IMAGE_SRC } from "@/utils/constants";
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
import { useLocation } from "react-router";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";

export default function EstablecimientoJugadorPage() {
  const { idEst } = useParams();
  const { data } = useEstablecimientoByID(Number(idEst));
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const date = searchParams.get("date");

  if (!data) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Heading textAlign="center" mt="35px">
        {data?.nombre}
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
                src={data.urlImagen}
                fallbackSrc={FALLBACK_IMAGE_SRC}
                width="500px"
                // height="200px"
                objectFit="cover"
                borderRadius="10px"
              />
            </Box>
          </CardHeader>
          <CardBody mt="0px" flex="1">
            <Stack divider={<StackDivider />} spacing="1">
              <Box>
                <Heading size="xs" margin="0">
                  Dirección
                </Heading>
                <Text fontSize="sm">{data.direccion}</Text>
              </Box>
              <Box>
                <Heading size="xs">Horario de atención</Heading>
                <Text fontSize="sm">{data.horariosDeAtencion}</Text>
              </Box>
              <Box>
                <Heading size="xs">Correo de contacto</Heading>
                <Text fontSize="sm">{data.correo}</Text>
              </Box>
              <Box>
                <Heading size="xs">Teléfono</Heading>
                <Text fontSize="sm">{data.telefono}</Text>
              </Box>
              <Box>
                <Heading size="xs">Localidad</Heading>
                <Text fontSize="sm">
                  {data.localidad}, {data.provincia}
                </Text>
              </Box>
              <Box
                width="100%"
                display="flex"
                justifyContent="center"
                pt="10px"
              >
                <Stack direction="row" spacing={5}>
                  <Link to={`canchas?date=${date}`}>
                    <Button colorScheme="gray">Ver canchas</Button>
                  </Link>
                  <Link to={`reservar?date=${date}`}>
                    <Button colorScheme="brand">Reservar</Button>
                  </Link>
                </Stack>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    </>
  );
}
