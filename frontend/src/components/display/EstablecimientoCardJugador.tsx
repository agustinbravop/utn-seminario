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
import { FALLBACK_IMAGE_SRC } from "@/utils/constants";
import { useBuscarDisponibilidades } from "@/utils/api";

type EstablecimientoCardProps = {
  establecimiento: Establecimiento;
  fecha: string;
};

export default function EstablecimientoCardJugador({
  establecimiento,
  fecha,
}: EstablecimientoCardProps) {
  const { data: disps } = useBuscarDisponibilidades({
    idEst: establecimiento.id,
  });

  return (
    <Link to={`est/${establecimiento.id}?fecha=${fecha}`}>
      <Card
        maxW="350px"
        w={["auto", "350px"]}
        h="250px"
        _hover={{ transform: "scale(1.01)", backgroundColor: "#f8fafd" }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <CardBody p="5px">
          <Image
            src={establecimiento?.urlImagen}
            fallbackSrc={FALLBACK_IMAGE_SRC}
            borderRadius="lg"
            alt={`${establecimiento.nombre}`}
            objectFit="cover"
            w="100%"
            h="135px"
            mb="1em"
          />
          <VStack spacing="0" textAlign="start">
            <Heading fontSize="15px" mb="10px">
              {establecimiento.nombre}
            </Heading>
            <Text mb="2" fontSize="sm">
              <Icon
                as={MdPlace}
                boxSize={4}
                mr="0.2em"
                verticalAlign="-0.2em"
              />
              {establecimiento.direccion}
            </Text>
            <Text mb="0" fontSize="sm">
              {"Desde "}
              <strong>
                $
                {disps.reduce(
                  (acum, disp) =>
                    disp.precioReserva < acum ? disp.precioReserva : acum,
                  Number.MAX_VALUE
                )}
              </strong>
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Link>
  );
}
