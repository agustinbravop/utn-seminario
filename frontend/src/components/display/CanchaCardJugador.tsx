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
import { Cancha } from "@/models/index";
import { Link } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { FALLBACK_IMAGE_SRC } from "@/utils/constants";

type CanchaCardProps = {
  cancha: Cancha;
  fecha: string;
};

export default function CanchaCardJugador({ cancha, fecha }: CanchaCardProps) {
  return (
    <Link to={`${cancha.id}?fecha=${fecha}`}>
      <Card
        w="360px"
        h="220px"
        _hover={{ transform: "scale(1.01)", backgroundColor: "#f8fafd" }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Box w="360px" h="125px">
          <Image
            src={cancha?.urlImagen}
            fallbackSrc={FALLBACK_IMAGE_SRC}
            alt={`Imagen del establecimiento ${cancha.nombre}`}
            borderRadius="lg"
            objectFit="cover"
            h="100%"
            w="93%"
            mt="5px"
            ml="0.8rem"
          />
        </Box>
        <CardBody h="100%">
          <VStack spacing="0" textAlign="start">
            <Heading fontSize="15px" mb="10px">
              {cancha.nombre}
            </Heading>
            <Text mb="2" fontSize="sm">
              <Icon as={MdPlace} boxSize={4} mr="2" /> {cancha.descripcion}
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Link>
  );
}
