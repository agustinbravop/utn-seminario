import { Button } from "@chakra-ui/button";
import { Link } from "react-router-dom";
import { Box, Heading, Text, VStack } from "@chakra-ui/layout";
import Carousel from "@components/Carousel/Carousel";

const images = [
  "https://civideportes.com.co/wp-content/uploads/2020/08/asphalt-tennis-court-5354328_640.jpg",
  "https://lh3.googleusercontent.com/p/AF1QipMxtsQ0kqDdux6pRQCFKd61np6gDpx44KFx4UTq=w1080-h608-p-no-v0",
  "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/PETRTNQVQBHJRCDS3B6RF7IJK4.jpg",
  "https://www.sportcourts.gt/wp-content/uploads/2016/10/unnamed-file.jpg",
];

function HomePage() {
  return (
    <>
      <Heading maxWidth="600px" size="3xl">
        Reserva una cancha desde donde quieras
      </Heading>
      <Text maxWidth="600px" my="40px" fontSize="xl">
        Encontrá tu cancha preferida para jugar con tus amigos de entre más de
        mil establecimientos.
      </Text>
      <Button type="button" colorScheme="brand">
        Buscar
      </Button>

      <Box
        my="50px"
        mx="auto"
        width="65%"
        display="flex"
        justifyContent="center"
      >
        <Carousel images={images} autoPlay={true} showButtons={true} />
      </Box>

      <VStack justifyContent="center" spacing={4}>
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
    </>
  );
}

export default HomePage;
