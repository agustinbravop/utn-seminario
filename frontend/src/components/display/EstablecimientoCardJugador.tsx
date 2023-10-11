import {
  Card,
  CardBody,
  Heading,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdPlace } from "react-icons/md";
import { Establecimiento } from "@/models/index";
import { Link } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { FALLBACK_IMAGE_SRC } from "@/utils/constants";

type EstablecimientoCardProps = {
  establecimiento: Establecimiento;
  date: string;
};

export default function EstablecimientoCardJugador({
  establecimiento,
  date,
}: EstablecimientoCardProps) {
  return (
    <Link to={`est/${establecimiento.id}?date=${date}`}>
      <Card
        width="360px"
        height="240px"
        _hover={{ transform: "scale(1.01)", backgroundColor: "#f8fafd" }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Box width="360px" height="125px">
          <Image
            src={
              !(establecimiento?.urlImagen === null)
                ? establecimiento?.urlImagen
                : FALLBACK_IMAGE_SRC
            }
            borderRadius="lg"
            alt={`Imagen del establecimiento ${establecimiento.nombre}`}
            objectFit="cover"
            height="100%"
            width="93%"
            mt="5px"
            ml="0.8rem"
          />
        </Box>
        <CardBody height="100%">
          <VStack spacing="0" textAlign="start">
            <Heading fontSize="15px" mb="10px">
              {establecimiento.nombre}
            </Heading>
            <Text mb="2" fontSize="sm">
              <Icon as={MdPlace} boxSize={4} mr="2" />{" "}
              {establecimiento.direccion}
            </Text>
            <Text mb="0" fontSize="sm">
              Desde <strong> $1800 </strong>
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Link>
  );
}
