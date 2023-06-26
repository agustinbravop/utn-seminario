import useFetch from "../../hooks/useFetch";
import TopMenu from "../../components/TopMenu";
import Canchas from "../../components/Canchas";
import { urlApiCanchas } from "../../utils/constants";
import { useNavigate, useParams } from "react-router";
import "./CanchasPage.scss";
import { Box, Button, Heading, Card, CardBody, Text } from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";

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
        <Card width='50%' >
          <CardBody>
            <Text><b>Ubicación:</b> {canchas.result && canchas.result.record[0] && canchas.result.record[0].ubicación}</Text>
            <Text><b>Correo de contacto:</b> {canchas.result && canchas.result.record[0] && canchas.result.record[0].correo}</Text>
            <Text><b>Número de télefono:</b> {canchas.result && canchas.result.record[0] && canchas.result.record[0].telefono}</Text>
          </CardBody>
        </Card>

        <Box display="flex" justifyContent='right' width='50vw' marginTop='3' marginBottom='3'>
          <Button
          style={{color: 'white', backgroundColor: "#0098d3"}}
            onClick={() => navigate("#")}
            variant='outline'
          >
            Perfil
          </Button>
        </Box>

      </Box>


      <Canchas {...canchas} />
      <br />
    </div>
  );
}
