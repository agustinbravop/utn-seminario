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
  HStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";

export default function EstablecimientoJugadorPage() {
  const { idEst } = useParams();
  const { data } = useEstablecimientoByID(Number(idEst));
  const { search } = useLocation();
  const fecha = new URLSearchParams(search).get("fecha");

  if (!data) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Heading textAlign="center" my="1em">
        {data.nombre}
      </Heading>
      <Card
        maxWidth="1000px"
        m="auto"
        display="flex"
        // Cambio de dirección en dispositivos móviles
        flexDirection={{ base: "column", md: "row" }}
      >
        <CardHeader>
          <Image
            src={data.urlImagen}
            fallbackSrc={FALLBACK_IMAGE_SRC}
            w="500px"
            objectFit="cover"
            borderRadius="8px"
            m="auto"
          />
        </CardHeader>
        <CardBody>
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
            <HStack justify="center" direction="row" spacing={5}>
              <Link to={`canchas?fecha=${fecha}`}>
                <Button colorScheme="gray">Ver canchas</Button>
              </Link>
              <Link to={`reservar?fecha=${fecha}`}>
                <Button colorScheme="brand">Reservar</Button>
              </Link>
            </HStack>
          </Stack>
        </CardBody>
      </Card>
    </>
  );
}
