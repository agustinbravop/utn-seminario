import useFetch from "../../hooks/useFetch";
import TopMenu from "../../components/TopMenu";
import Canchas from "../../components/Canchas";
import { urlApiCanchas } from "../../utils/constants";
import { useNavigate, useParams } from "react-router";
import { Box, Button, Heading, Card, CardBody, Text } from "@chakra-ui/react";

export default function CanchasPage() {
  const navigate = useNavigate();
  const canchas = useFetch(urlApiCanchas, null);

  return (
    <div>
      <TopMenu />

      <Box display="flex" alignItems="center" justifyContent='center' flexDirection="column">
        <Heading size="xl" margin="50px">
          Club Huracán
        </Heading>
        <Card width='50vw' >
          <CardBody>
            <Text><b>Ubicación:</b> {canchas.result && canchas.result.record[0] && canchas.result.record[0].ubicación}</Text>
            <Text><b>Correo de contacto:</b> {canchas.result && canchas.result.record[0] && canchas.result.record[0].correo}</Text>
            <Text><b>Número de télefono:</b> {canchas.result && canchas.result.record[0] && canchas.result.record[0].telefono}</Text>
          </CardBody>
        </Card>

        <Box display="flex" justifyContent='right' width='50vw' marginTop='3' marginBottom='3'>
          <Button
            style={{ color: 'white', backgroundColor: "#0098d3" }}
            onClick={() => alert('Editar') /*navigate("#")*/}
            variant='outline'
          >
            Editar
          </Button>
        </Box>

        <Box display="flex" justifyContent='left' width='60vw' marginTop='3' marginBottom='3'>
          <Button
            style={{ color: 'white', backgroundColor: "#0098d3" }}
            onClick={() => alert('Agregar Cancha') /*navigate("#")*/}
            variant='outline'
          >
            Agregar cancha +
          </Button>
        </Box>
      </Box>


      <Canchas {...canchas} />
      <br />
    </div>
  );
}
