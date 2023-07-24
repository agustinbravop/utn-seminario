import { Button } from "@chakra-ui/button";
import TopMenu from "../../components/TopMenu/TopMenu";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Text, VStack } from "@chakra-ui/layout";
import { useCurrentAdmin } from "../../hooks/useCurrentAdmin";
import { useEffect } from "react";
import Carousel from "../../components/Carousel/Carousel";

function HomePage() {
  const navigate = useNavigate();
  const images = ["https://civideportes.com.co/wp-content/uploads/2020/08/asphalt-tennis-court-5354328_640.jpg", 
    "https://lh3.googleusercontent.com/p/AF1QipMxtsQ0kqDdux6pRQCFKd61np6gDpx44KFx4UTq=w1080-h608-p-no-v0",
     "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/PETRTNQVQBHJRCDS3B6RF7IJK4.jpg",
    "https://www.sportcourts.gt/wp-content/uploads/2016/10/unnamed-file.jpg"];
    const { logout } = useCurrentAdmin();

    useEffect(() => {
    logout()
  }, [])

  return (
    <div>
      <TopMenu />

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
        <Button type="button">Buscar</Button>
        <VStack
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "55px",
          }}
        >
          <Box  display="flex" alignContent="column"  width="100%">
            <Box width="65%" display="flex" justifyContent="center">
              <Carousel images={images} autoPlay={true} showButtons={true} />
            </Box>
            <Box marginTop="100px" marginLeft="30px" justifyContent="center"  width="35%">
              <Heading style={{ fontSize: "20px" }}>
                ¿Queres publicitar tu Establecimiento?
              </Heading>
              <p>
                Play Finder te permite administrar las reservas de <br /> tus
                canchas, aceptar pagos a través de Mercado Pago,
                <br /> ver reportes de ingresos y mucho más.{" "}
              </p>
              <Button onClick={() => navigate("/suscripciones")}>
                Ver Opciones
              </Button>
            </Box>
          </Box>

        </VStack>
      </Box>
    </div>
  );
}

export default HomePage;
