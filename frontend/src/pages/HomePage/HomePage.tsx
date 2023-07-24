import { Button } from "@chakra-ui/button";
import TopMenu from "../../components/TopMenu/TopMenu";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Text, VStack } from "@chakra-ui/layout";
import { useCurrentAdmin } from "../../hooks/useCurrentAdmin";
import { useEffect } from "react";

function HomePage() {
  const navigate = useNavigate();
  const { logout } = useCurrentAdmin();
  
  useEffect(() => {
    logout()
  }, [])
  

  return (
    <div>
      <TopMenu />

      <Box m="100px">
        <Heading
          style={{
            width: "500px",
            marginTop: "20px",
            display: "flex",
            fontSize: "40px",
            alignContent: "center",
          }}
        >
          Reserva una cancha desde donde quieras
        </Heading>
        <Text>
          Encontrá tu cancha preferida para jugar con tus amigos de entre más de
          mil establecimientos
        </Text>
        <Button type="button">Buscar</Button>
        <VStack
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "100px",
          }}
        >
          <Heading style={{ fontSize: "20px" }}>
            ¿Queres publicitar tu Establecimiento?
          </Heading>
          <p>
            Campo de Juego te permite administrar las reservas de <br /> tus
            canchas, aceptar pagos a través de Mercado Pago,
            <br /> ver reportes de ingresos y mucho más.{" "}
          </p>
          <Button onClick={() => navigate("/suscripciones")}>
            Ver Opciones
          </Button>
        </VStack>
      </Box>
    </div>
  );
}

export default HomePage;
