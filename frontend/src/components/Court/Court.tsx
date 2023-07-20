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
import { Cancha } from "../../models/index";
import { Link } from "react-router-dom";

type estabProps = {
  cancha: Cancha;
};

export default function Court({ cancha }: estabProps) {
  return (
    <Card maxWidth="xs" height="450px" width="300px">
      <Image
        src={cancha.urlImagen !== null ? cancha.urlImagen : undefined}
        borderRadius="lg"
        alt={`Imagen del cancha ${cancha.nombre}`}
        objectFit="cover"
        maxWidth="100%"
        height="200px"
      />
      <CardBody height="300px">
        <VStack spacing="0">
          <Heading size="md" marginBottom="10px">
            {cancha.nombre}
          </Heading>
          <Text marginBottom="0">{cancha.descripcion}</Text>
        </VStack>
      </CardBody>
      <CardFooter display="flex" justify="center">
        <Link to={`${cancha.id}`}>
          <Button
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-eye-fill"
                viewBox="0 0 16 16"
              >
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
              </svg>
            }
          >
            Editar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
