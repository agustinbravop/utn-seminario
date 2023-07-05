import { BASE_PATH } from "../../utils/constants";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdPlace } from "react-icons/md";
import { PhoneIcon } from "@chakra-ui/icons";
import { Cancha } from "../../types/index";
import { Link, useNavigate } from "react-router-dom";

type estabProps = {
  cancha: Cancha;
  key: number;
};

export default function Court({ cancha, key }: estabProps) {

  const navigate = useNavigate()

  return (
    <Card maxWidth="xs" height="450px">
      <Image
        className="image-size"
        src={cancha.urlImagen !== null ? cancha.urlImagen : undefined}
        borderRadius="lg"
        alt={`Imagen del cancha ${cancha.nombre}`}
        objectFit="cover"
        maxWidth="100%"
        height="200px"
      />
      <CardBody height="300px">
        <VStack spacing="0">
          <Heading className="card-title" size="md" marginBottom="10px">
            {cancha.nombre}
          </Heading>
          <Text marginBottom="0">
            {cancha.descripcion}
          </Text>
        </VStack>
      </CardBody>
      <CardFooter display="flex" justify="center">
        <Button
        style={{ color: "white", backgroundColor: "#0098d3" }}
        onClick={() => navigate(`/establecimiento/${cancha.idEstablecimiento}/canchas/${cancha.id}`)}
        variant="outline"
      >
        Editar
      </Button>
      </CardFooter>
    </Card>
  );
}
