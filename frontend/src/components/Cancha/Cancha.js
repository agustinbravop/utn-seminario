import { BASE_PATH } from "../../utils/constants";
import "./Cancha.scss";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Icon,
  Image,
  Text,
  VStack,
  Stack,
} from "@chakra-ui/react";
import { MdPlace } from "react-icons/md";
import { PhoneIcon } from "@chakra-ui/icons";

export default function Cancha(props) {
  const { cancha } = props;

  return (
    <Card maxWidth="xs" width='20vw'>
      <Image
        className="image-size"
        src={`${BASE_PATH}/${cancha.image}`}
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
