import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useSuscripciones } from "@/utils/api";
import { Link } from "react-router-dom";
import { ICONOS_SUSCRIPCIONES } from "@/utils/constants";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import { Alerta } from "@/components/feedback";

export default function SuscripcionesPage() {
  return (
    <>
      <Box ml="12%">
        <Heading size="md">Elija una suscripción</Heading>
        <Text>
          Nos ajustamos a las necesidades de cada negocio. La puede modificar en
          cualquier momento.
        </Text>
      </Box>

      <SuscripcionesCardList />
    </>
  );
}

function SuscripcionesCardList() {
  const { data, isLoading, isError } = useSuscripciones();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return (
      <Alerta status="error" mensaje="Error al buscar las suscripciones" />
    );
  }
  return (
    <Stack justifyContent="center" direction={["column", "row"]}>
      {data
        .sort((s1, s2) => s1.costoMensual - s2.costoMensual)
        .map((s, idx) => ({ icono: ICONOS_SUSCRIPCIONES[idx], ...s }))
        .map((s) => (
          <Card
            bg="light"
            key={s.id}
            color="dark"
            width={["100%", "14rem"]}
            margin={["auto", "1em"]}
            direction={["row", "column"]}
          >
            <CardHeader margin="auto">{s.icono}</CardHeader>
            <CardBody textAlign="center">
              <Heading size="md">{s.nombre}</Heading>
              <Text fontSize="30px" mb="0px">
                ${s.costoMensual}
              </Text>
              <Text>por mes</Text>
              <Text my="10px">
                {s.limiteEstablecimientos} establecimiento
                {s.limiteEstablecimientos === 1 ? "" : "s"}
              </Text>
              <Link to={`/subscribe?idSuscripcion=${s.id}`}>
                <Button
                  mt="10px"
                  type="button"
                  variant="outline"
                  colorScheme="brand"
                >
                  Continuar
                </Button>
              </Link>
            </CardBody>
          </Card>
        ))}
    </Stack>
  );
}
