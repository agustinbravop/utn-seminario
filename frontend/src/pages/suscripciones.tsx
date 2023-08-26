import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Icon,
  Text,
} from "@chakra-ui/react";
import { BsRocket, BsShop, BsBuildings } from "react-icons/bs";
import { useSuscripciones } from "@/utils/api/auth";
import { Link } from "react-router-dom";

const iconos = [
  <Icon as={BsShop} fill="brand.500" fontSize={90} />,
  <Icon as={BsBuildings} fill="brand.500" fontSize={90} />,
  <Icon as={BsRocket} fill="brand.500" fontSize={90} />,
];

export default function SuscripcionesPage() {
  const { data, isLoading, isError } = useSuscripciones();

  let cards;
  // TODO: mejorar con un LoadingIcon o un ErrorSign o algo
  if (isLoading) {
    cards = <p>Cargando!</p>;
  }
  if (isError) {
    cards = <p>error!</p>;
  }
  console.log(data);
  

  const suscripciones = data
    ?.sort((s1, s2) => s1.costoMensual - s2.costoMensual)
    .map((s, idx) => ({ icono: iconos[idx], ...s }));
  cards = suscripciones?.map((s) => {
    return (
      <Card bg="light" key={s.id} color="dark" width="14rem">
        <CardHeader margin="auto">{s.icono}</CardHeader>
        <CardBody textAlign="center">
          <Heading size="md">{s.nombre}</Heading>
          <Text fontSize="30px" marginBottom="0px">
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
    );
  });

  return (
    <>
      <Box marginBottom="110px" marginLeft="12%">
        <Heading size="md">Elija una suscripción</Heading>
        <Text>
          Nos ajustamos a las necesidades de cada negocio. La puede modificar en
          cualquier momento.
        </Text>
      </Box>
      <HStack justifyContent="center" gap="95px" my="50px">
        {cards}
      </HStack>
    </>
  );
}
