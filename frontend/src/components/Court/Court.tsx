import {
  Card,
  CardBody,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Cancha } from "@/models/index";
import { Link } from "react-router-dom";
import { defImage } from "@/utils/const/const";


type estabProps = {
  cancha: Cancha;
};

export default function Court({ cancha }: estabProps) {
  return (
    <Link to={`${cancha.id}`}>
     <Card width="300px" height="370px"  
    _hover={{ transform: 'scale(1.01)', backgroundColor: '#f8fafd' }} 
    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
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
    </Card>
    </Link>
  );
}
