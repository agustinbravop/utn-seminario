import TopMenu from "../../components/TopMenu/TopMenu";
import Canchas from "../../components/Canchas";
import { useNavigate, useParams } from "react-router";
import { Box, Button, Heading, Card, CardBody, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getCanchasByEstablecimientoID } from "../../utils/api/canchas";

export default function CanchasPage() {
  const { idEst } = useParams();
  const navigate = useNavigate();
  const { data: canchas } = useQuery(["canchas"], () =>
    getCanchasByEstablecimientoID(idEst)
  );

  return (
    <div>
      <TopMenu />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Heading size="xl" margin="50px">
          {canchas.result &&
            canchas.result.record[0] &&
            canchas.result.record[0].nombre}
        </Heading>
        <Card width="50vw">
          <CardBody>
            <Text>
              <b>Ubicación:</b>{" "}
              {canchas.result &&
                canchas.result.record[0] &&
                canchas.result.record[0].ubicacion}
            </Text>
            <Text>
              <b>Correo de contacto:</b>{" "}
              {canchas.result &&
                canchas.result.record[0] &&
                canchas.result.record[0].correo}
            </Text>
            <Text>
              <b>Número de télefono:</b>{" "}
              {canchas.result &&
                canchas.result.record[0] &&
                canchas.result.record[0].telefono}
            </Text>
          </CardBody>
        </Card>

        <Box
          display="flex"
          justifyContent="right"
          width="50vw"
          marginTop="3"
          marginBottom="3"
        >
          <Button
            style={{ color: "white", backgroundColor: "#0098d3" }}
            onClick={() => alert("Editar") /*navigate("#")*/}
            variant="outline"
          >
            Editar
          </Button>
        </Box>

        <Box
          display="flex"
          justifyContent="left"
          width="60vw"
          marginTop="3"
          marginBottom="3"
        >
          <Button
            style={{ color: "white", backgroundColor: "#0098d3" }}
            onClick={() => alert("Agregar Cancha") /*navigate("#")*/}
            variant="outline"
          >
            Agregar cancha +
          </Button>
        </Box>
        <Canchas {...canchas} />
      </Box>

      <br />
    </div>
  );
}
