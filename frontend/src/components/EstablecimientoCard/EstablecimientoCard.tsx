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
import { Establecimiento } from "../../models/index";
import { Link } from "react-router-dom";
import { Box } from "@chakra-ui/react";

type EstablecimientoCardProps = {
  establecimiento: Establecimiento;
};

export default function EstablecimientoCard({
  establecimiento,
}: EstablecimientoCardProps) {
  return (
    <Card width="300px" height="450px" >
      <Box width="300px" maxWidth="300px" height="200px" maxHeight="200px" >
        <Image
          src={
            establecimiento.urlImagen !== null
              ? establecimiento.urlImagen
              : undefined
          }
          borderTopRadius="lg"
          alt={`Imagen del establecimiento ${establecimiento.nombre}`}
          objectFit="cover"
          height="100%"
          width="100%"
        />
      </Box>
      <CardBody height="300px">
        <VStack spacing="0">
          <Heading size="md" marginBottom="10px">
            {establecimiento.nombre}
          </Heading>
          <Text marginBottom="0">
            <Icon as={MdPlace} boxSize={5} color="gray" />{" "}
            {establecimiento.direccion}
          </Text>
          <Text>
            <PhoneIcon boxSize={3.5} color="gray" /> {establecimiento.telefono}
          </Text>
          <Text>
            {establecimiento.horariosDeAtencion}
          </Text>
        </VStack>
      </CardBody>
      <CardFooter display="flex" justify="center">
        <Link to={`/establecimiento/${establecimiento.id}/canchas`}>
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
            Canchas
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
