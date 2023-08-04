import { Button } from "@chakra-ui/button";
import { Box, Heading, Text, VStack } from "@chakra-ui/layout";
import Carousel from "@/components/Carousel/Carousel";
import { Link } from "@/router";

const images = [
  "https://civideportes.com.co/wp-content/uploads/2020/08/asphalt-tennis-court-5354328_640.jpg",
  "https://lh3.googleusercontent.com/p/AF1QipMxtsQ0kqDdux6pRQCFKd61np6gDpx44KFx4UTq=w1080-h608-p-no-v0",
  "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/PETRTNQVQBHJRCDS3B6RF7IJK4.jpg",
  "https://media.istockphoto.com/id/183064576/es/foto/voleibol-en-un-gimnasio-de-vac%C3%ADo.jpg?s=612x612&w=0&k=20&c=TS3CIvJBhSTacaWRCMjcphi8B95yVlG1ELTwor1mYHw=",
];

export default function LandingPage() {
  return (
    <>
      
<Box marginLeft="120px">
        <Heading
          style={{
            width: "500px",
            marginTop: "35px",
            display: "flex",
            fontSize: "40px",
            alignContent: "center",
          }}
        >
          Reserva una cancha desde donde quieras
        </Heading>
        <Text  >
          Encontrá tu cancha preferida para jugar con tus amigos de entre más de
          mil establecimientos
        </Text>
        <Button marginTop="15px" type="button">Buscar</Button>
        <VStack
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          <Box display="flex" alignContent="column" width="100%">
            <Box width="65%" display="flex" justifyContent="center">
              <Carousel images={images} autoPlay={true} showButtons={true} />
            </Box>
            <Box marginTop="100px" marginLeft="20px" justifyContent="center" width="35%">
              <Heading  style={{ fontSize: "20px" }}>
                ¿Queres publicitar tu Establecimiento?
              </Heading>
              <Text maxWidth="400px" textAlign="left">
                Campo de Juego te permite administrar las reservas de tus canchas,
                aceptar pagos a través de Mercado Pago, ver reportes de ingresos y
                mucho más.
              </Text>
              <Link to="/suscripciones">
                <Button marginTop="20px" >Ver Opciones</Button>
              </Link>
            </Box>
          </Box>

        </VStack>
      </Box>
    </>
  );
}