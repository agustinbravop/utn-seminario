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
  HStack,
} from "@chakra-ui/react";
import { MdPlace } from "react-icons/md";
import { InfoIcon, PhoneIcon } from "@chakra-ui/icons";
import { Establecimiento } from "@/models/index";
import { Link } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { defImage } from "@/utils/const/const";

type EstablecimientoCardProps = {
  establecimiento: Establecimiento;
};

export default function EstablecimientoCard({
  establecimiento,
}: EstablecimientoCardProps) {
  return (
    <Link to={`/ests/${establecimiento.id}`}>
    <Card width="300px" height="370px"  
           _hover={{ transform: 'scale(1.01)', backgroundColor: '#f8fafd' }} 
           onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
           onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
         >
      <Box width="300px" maxWidth="300px" height="200px" maxHeight="200px">
        <Image
          src={
            !(establecimiento?.urlImagen === null)
              ? establecimiento?.urlImagen
              : defImage
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
          <Text>{establecimiento.horariosDeAtencion}</Text>
        </VStack>
      </CardBody>
    </Card>
    </Link>
  );
}
