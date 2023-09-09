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
import { FALLBACK_IMAGE_SRC } from "@/utils/consts/consts";

type EstablecimientoCardProps = {
  establecimiento: Establecimiento;
};

export default function EstablecimientoJugador({
  establecimiento,
}: EstablecimientoCardProps) {
  return (
    <Link to={`est/${establecimiento.id}`} /* ESTO SE PUEDE INTEGRAR A EstablecimientoCard CONDICIONANDO EL to={} DEL LINK? */>
      <Card
        width="200px"
        height="280px"
        _hover={{ transform: "scale(1.01)", backgroundColor: "#f8fafd" }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Box width="220px" height="200px">
          <Image
            src={
              !(establecimiento?.urlImagen === null)
                ? establecimiento?.urlImagen
                : FALLBACK_IMAGE_SRC
            }
            borderTopRadius="lg"
            alt={`Imagen del establecimiento ${establecimiento.nombre}`}
            objectFit="cover"
            height="60%"
            width="80%"
            mt='5px'
            ml='0.8rem'
          />
        </Box>
        <CardBody height="100%">
          <VStack spacing="0" textAlign='start'>
            <Heading fontSize='15px' marginBottom="10px">
              {establecimiento.nombre}
            </Heading>
            <Text marginBottom="0" fontSize='sm'>
              <Icon as={MdPlace} boxSize={4} mr="2" />{" "}
              {establecimiento.direccion}
            </Text>
            <Text fontSize='sm' mr='3rem'>
              <PhoneIcon boxSize={4} mr="2" /> {establecimiento.telefono}
            </Text>
            <Text fontSize='sm'>{establecimiento.horariosDeAtencion}</Text>
          </VStack>
        </CardBody>
      </Card>
    </Link>
  );
}
