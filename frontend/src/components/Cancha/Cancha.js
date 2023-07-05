import "./Cancha.scss";
import {
  Card,
  CardBody,
  Heading,
  Image,
  Text,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";

export default function Cancha(props) {
  const { cancha } = props;
  const navigate = useNavigate();

  return (
    <Card maxWidth="xs" width='20vw' onClick={()=>{alert('Cancha')}} style={{ cursor: 'pointer'}}>
      <Image
        className="image-size"
        src={cancha.urlImagen}
        borderRadius="lg"
        alt={`Imagen de la cancha ${cancha.name}`}
        objectFit="cover"
        maxWidth="100%"
        height="200px"
      />

      <CardBody height="300px" alignContent='left'>
        <Stack spacing="0">
          <Heading className="card-title" size="md" marginBottom="10px">
            {cancha.name}
          </Heading>
          <Text marginBottom="0">
            • Disciplinas: {cancha.disciplinas}
          </Text>
          <Text marginBottom="0">
            • Horario: {cancha.horario}
          </Text>
          <Text>
            • Precio: ${cancha.precio}
          </Text>
        </Stack>
      </CardBody>
    </Card>
  );
}
