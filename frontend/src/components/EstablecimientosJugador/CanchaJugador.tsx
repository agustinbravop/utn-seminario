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
  import { Cancha} from "@/models/index";
  import { Link } from "react-router-dom";
  import { Box } from "@chakra-ui/react";
  import { FALLBACK_IMAGE_SRC } from "@/utils/consts/consts";
  
  type CanchaCardProps = {
    cancha: Cancha;
    date: string
  };
  
  export default function CanchaJugador({
    cancha,
    date
  }: CanchaCardProps) {
    return (
      <Link to={`est/${cancha.id}?date=${date}`} >
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
                !(cancha?.urlImagen === null)
                  ? cancha?.urlImagen
                  : FALLBACK_IMAGE_SRC
              }
              borderRadius="lg"
              alt={`Imagen del establecimiento ${cancha.nombre}`}
              objectFit="cover"
              height="100%"
              width="93%"
              mt='5px'
              ml='0.8rem'
            />
          </Box>
          <CardBody height="100%">
            <VStack spacing="0" textAlign='start'>
              <Heading fontSize='15px' marginBottom="10px">
                {cancha.nombre}
              </Heading>
              <Text marginBottom="2" fontSize='sm'>
                <Icon as={MdPlace} boxSize={4} mr="2"  />{" "}
                {cancha.descripcion}
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Link>
    );
  }
  