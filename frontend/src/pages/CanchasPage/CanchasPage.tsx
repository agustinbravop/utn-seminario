import TopMenu from "../../components/TopMenu/TopMenu";
import Canchas from "../../components/Canchas/Canchas";
import { useNavigate, useParams } from "react-router";
import { Box, Button, Heading, Card, CardBody, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getCanchasByEstablecimientoID } from "../../utils/api/canchas";
import { getEstablecimientoByID } from "../../utils/api/establecimientos";

interface CanchaListProps {
  idEst: number;
}

function CanchaList({ idEst }: CanchaListProps) {
  const { data: canchas } = useQuery(["canchas"], () =>
    getCanchasByEstablecimientoID(Number(idEst))
  );

  return <Canchas canchas={canchas || []} />;
}

export default function CanchasPage() {
  const { idEst } = useParams();
  console.log(idEst);

  const { data: est } = useQuery(["establecimientos", idEst], () =>
    getEstablecimientoByID(Number(idEst))
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
          {est?.nombre}
        </Heading>
        <Card width="50vw">
          <CardBody>
            <Text>
              <b>Ubicación: </b>
              {est?.direccion}
            </Text>
            <Text>
              <b>Correo de contacto: </b>
              {est?.correo}
            </Text>
            <Text>
              <b>Número de télefono: </b>
              {est?.telefono}
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
            color="white"
            backgroundColor="#0098d3"
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
            color="white"
            backgroundColor="#0098d3"
            onClick={() => alert("Agregar Cancha") /*navigate("#")*/}
            variant="outline"
          >
            Agregar cancha +
          </Button>
        </Box>
        <CanchaList idEst={Number(idEst)} />
      </Box>

      <br />
    </div>
  );
}
