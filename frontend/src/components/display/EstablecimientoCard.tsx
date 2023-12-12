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
import { PhoneIcon } from "@chakra-ui/icons";
import { Establecimiento } from "@/models/index";
import { Link } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { FALLBACK_IMAGE_SRC } from "@/utils/constants";

type EstablecimientoCardProps = {
  establecimiento: Establecimiento;
};

export default function EstablecimientoCard({
  establecimiento,
}: EstablecimientoCardProps) {
  return (
    <Link to={`/ests/${establecimiento.id}`}>
      <Card
        w="300px"
        h="370px"
        _hover={{ transform: "scale(1.01)", backgroundColor: "#f8fafd" }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Box w="300px" maxWidth="300px" h="200px" maxHeight="200px">
          <Image
            src={establecimiento?.urlImagen}
            fallbackSrc={FALLBACK_IMAGE_SRC}
            borderTopRadius="lg"
            alt={`Imagen del establecimiento ${establecimiento.nombre}`}
            objectFit="cover"
            h="100%"
            w="100%"
          />
        </Box>
        <CardBody h="300px">
          <VStack spacing="0">
            <Heading size="md" mb="10px">
              {establecimiento.nombre}
            </Heading>
            <Text mb="0">
              <Icon as={MdPlace} boxSize={5} mr="2" verticalAlign="-0.2em" />
              {establecimiento.direccion}
            </Text>
            <Text>
              <PhoneIcon boxSize={4} mr="2" verticalAlign="-0.15em" />
              {establecimiento.telefono}
            </Text>
            <Text>{establecimiento.horariosDeAtencion}</Text>
          </VStack>
        </CardBody>
      </Card>
    </Link>
  );
}
