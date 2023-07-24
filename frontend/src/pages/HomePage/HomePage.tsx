import { Button } from "@chakra-ui/button";
import TopMenu from "../../components/TopMenu/TopMenu";
import { Link } from "react-router-dom";
import { Box, Heading, Text, VStack } from "@chakra-ui/layout";

function HomePage() {
  return (
    <div>
      <TopMenu />

      <Box m="100px">
        <Heading maxWidth="500px" size="3xl">
          Reserva una cancha desde donde quieras
        </Heading>
        <Text maxWidth="600px" my="40px" fontSize="xl">
          Encontrá tu cancha preferida para jugar con tus amigos de entre más de
          mil establecimientos.
        </Text>
        <Button type="button" colorScheme="brand">
          Buscar
        </Button>

        <VStack marginTop="100px" gap="20px">
          <Heading size="md">¿Quisieras publicitar tu establecimiento?</Heading>
          <Text maxWidth="400px" textAlign="center">
            Campo de Juego te permite administrar las reservas de tus canchas,
            aceptar pagos a través de Mercado Pago, ver reportes de ingresos y
            mucho más.
          </Text>
          <Link to="/suscripciones">
            <Button>Ver Opciones</Button>
          </Link>
        </VStack>
      </Box>
    </div>
  );
}

export default HomePage;
