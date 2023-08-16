import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Cancha } from "@/models/index";
import { Link } from "react-router-dom";
import { defImage } from "@/utils/const/const";
import { InfoIcon } from "@chakra-ui/icons";

type estabProps = {
  cancha: Cancha;
};

export default function Court({ cancha }: estabProps) {
  return (
    <Card maxWidth="xs" height="450px" width="300px">
      <Image
        src={!(cancha?.urlImagen === null) ? cancha?.urlImagen : defImage}
        alt={`Imagen del cancha ${cancha.nombre}`}
        objectFit="cover"
        borderTopRadius="lg"
        maxWidth="100%"
        height="200px"
      />
      <CardBody height="300px">
        <VStack spacing="0">
          <Heading size="md" marginBottom="10px">
            {cancha.nombre}
          </Heading>
          <Text marginBottom="5">{cancha.descripcion}</Text>
          <Text marginBottom="0">
            {cancha.habilitada ? "Esta habilitada" : "No esta habilitada"}
          </Text>
        </VStack>
      </CardBody>
      <CardFooter display="flex" justify="center">
        <Link to={`${cancha.id}`}>
          <Button leftIcon={<InfoIcon />}>Información</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
