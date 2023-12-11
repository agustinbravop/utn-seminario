import { Button } from "@chakra-ui/button";
import { Box, Heading, Text, Stack, VStack } from "@chakra-ui/layout";
import Carousel from "@/components/media-and-icons/Carousel";
import { Link } from "@/router";
import { Container } from "@chakra-ui/react";

const images = [
  "https://civideportes.com.co/wp-content/uploads/2020/08/asphalt-tennis-court-5354328_640.jpg",
  "https://lh3.googleusercontent.com/p/AF1QipMxtsQ0kqDdux6pRQCFKd61np6gDpx44KFx4UTq=w1080-h608-p-no-v0",
  "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/PETRTNQVQBHJRCDS3B6RF7IJK4.jpg",
  "https://media.istockphoto.com/id/183064576/es/foto/voleibol-en-un-gimnasio-de-vac%C3%ADo.jpg?s=612x612&w=0&k=20&c=TS3CIvJBhSTacaWRCMjcphi8B95yVlG1ELTwor1mYHw=",
];

export default function LandingPage() {
  return (
    <Box mx="1.5vw">
      <Container m="0" maxW="900px">
        <Heading my="35px" fontSize="2.75em">
          Reservá una cancha desde dónde quieras
        </Heading>
        <Text fontSize="1.1em">
          Encontrá tu cancha preferida de entre más de mil establecimientos para
          jugar con tus amigos. Estás a un solo click de distancia.
        </Text>
        <Link to="/auth/login">
          <Button mt="15px" type="button" colorScheme="brand">
            Buscar
          </Button>
        </Link>
      </Container>
      <Stack
        display="flex"
        justify="center"
        mt="40px"
        alignItems="center"
        gap="50px"
        flexDirection={{ base: "column", md: "row" }}
      >
        <Carousel images={images} autoPlay showButtons />
        <VStack textAlign="center" alignItems="center">
          <Heading fontSize="20px">
            ¿Querés publicitar tu establecimiento?
          </Heading>
          <Text maxWidth="400px">
            Play Finder te permite administrar las reservas de tus canchas,
            registrar pagos, ver reportes de ingresos y mucho más.
          </Text>
          <Link to="/suscripciones">
            <Button mt="20px">Ver Opciones</Button>
          </Link>
        </VStack>
      </Stack>
    </Box>
  );
}
