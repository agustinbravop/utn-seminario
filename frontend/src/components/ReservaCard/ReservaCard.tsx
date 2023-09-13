import React from "react";
import { MdPlace } from "react-icons/md";
import { LuClock5 } from "react-icons/lu";
import { BiTennisBall, BiDollar } from "react-icons/bi";
import { PhoneIcon } from "@chakra-ui/icons";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  CardFooter,
  Button,
  Icon,
  Tag,
  TagLeftIcon,
  TagLabel,
  Image,
  HStack,
  Divider,
  VStack,
} from "@chakra-ui/react";

export default function ReservaCard() {
  return (
    <>
      <Card size="sm" m={2} textAlign="center" height="270px">
        <CardHeader borderRadius="6px" backgroundColor="cyan.100">
          <HStack justifyContent="center">
            <Icon viewBox="0 0 200 200" color="whatsapp.500">
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
            <Text> Pagada</Text>
          </HStack>
        </CardHeader>

        <CardBody textAlign="center">
          <Heading
            justifyContent="center"
            display="flex"
            fontSize={{ base: "25px", md: "25px", lg: "27px" }}
          >
            <Text>San Fer</Text>
          </Heading>
          <VStack fontSize={{ base: "20px", md: "17px", lg: "15px" }} mr="25px">
            <Text>
              <Icon as={MdPlace} boxSize={4} mr="2" alignSelf="start" />{" "}
              Direccion
            </Text>
            <Text>
              <PhoneIcon boxSize={4} mr="2" alignSelf="start" /> Telefono
            </Text>
          </VStack>
          <br />
          <HStack
            spacing={2}
            justifyContent="center"
            fontSize={{ base: "15px", md: "17px", lg: "15px" }}
            mb={3}
          >
            <Tag size="sm" variant="subtle" colorScheme="teal">
              <TagLeftIcon as={LuClock5} boxSize={4} />
              <TagLabel>17:00</TagLabel>
            </Tag>
            <Tag size="sm" variant="subtle" colorScheme="whatsapp">
              <TagLeftIcon as={BiTennisBall} boxSize={4} />
              <TagLabel>TENIS</TagLabel>
            </Tag>
          </HStack>
          <HStack spacing={4} justifyContent="center" mt="10px">
            <Button colorScheme="red" size="sm">
              Cancelar Reserva
            </Button>
          </HStack>
        </CardBody>
      </Card>
      <Card size="sm" m={2} textAlign="center" height="270px">
        <CardHeader backgroundColor="red.200" borderRadius="6px">
          <HStack justifyContent="center">
            <Icon viewBox="0 0 200 200" color="red">
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
            <Text> Sin Pagar</Text>
          </HStack>
        </CardHeader>
        <CardBody textAlign="center">
          <Heading
            justifyContent="center"
            display="flex"
            fontSize={{ base: "25px", md: "25px", lg: "27px" }}
          >
            <Text>Las Palmeras</Text>
          </Heading>
          <VStack fontSize={{ base: "20px", md: "17px", lg: "15px" }} mr="25px">
            <Text>
              <Icon as={MdPlace} boxSize={4} mr="2" alignSelf="start" />{" "}
              Direccion
            </Text>
            <Text>
              <PhoneIcon boxSize={4} mr="2" alignSelf="start" /> Telefono
            </Text>
          </VStack>
          <br />
          <HStack
            spacing={2}
            justifyContent="center"
            fontSize={{ base: "15px", md: "17px", lg: "15px" }}
            mb={3}
          >
            <Tag size="sm" variant="subtle" colorScheme="teal">
              <TagLeftIcon as={LuClock5} boxSize={4} />
              <TagLabel>17:00</TagLabel>
            </Tag>
            <Tag size="sm" variant="subtle" colorScheme="whatsapp">
              <TagLeftIcon as={BiTennisBall} boxSize={4} />
              <TagLabel>TENIS</TagLabel>
            </Tag>
          </HStack>
          <HStack spacing={4} justifyContent="center" mt="10px">
            <Button colorScheme="red" size="sm">
              Cancelar{" "}
            </Button>
            <Button colorScheme="brand" size="sm">
              Pagar
            </Button>
          </HStack>
        </CardBody>
      </Card>
    </>
  );
}

/*
OTRO FORMATO // ALTERNATIVA 
<Card width='160px' m={2} textAlign="center">
        <CardHeader>
          <Image
            src="https://civideportes.com.co/wp-content/uploads/2020/08/asphalt-tennis-court-5354328_640.jpg"
            alt="EstablecimientoImagen"
            borderRadius="lg"
            width={["10rem", "18rem"]}
            height={["5rem", "10rem"]}
          />
        </CardHeader>
        <Divider color="gray.400" width="90%" ml="5%" />
        <CardBody
          textAlign="center"
        >
          <Heading justifyContent="center" display="flex" fontSize={{ base: "35px", md: "25px", lg: "27px" }} >
            <HStack spacing={1} textAlign="center" >
              <Text>San Fer</Text>
              <Text m={2} >
                <Icon as={BiDollar} boxSize={[7, 5]} />
                25000
              </Text>
            </HStack>
          </Heading>
          <VStack fontSize={{ base: "25px", md: "17px", lg: "15px" }}>
            <Text m={2}>
              <Icon as={MdPlace} boxSize={4} mr="2" /> Direccion
            </Text>
            <Text m={2}>
              <PhoneIcon boxSize={4} mr="2" alignSelf="start" /> Telefono
            </Text>
          </VStack>
          <br />
          <HStack spacing={2} justifyContent="center">
            <Tag size="lg" variant="subtle" colorScheme="teal">
              <TagLeftIcon as={LuClock5} boxSize={6} />
              <TagLabel fontSize={{ base: "25px", md: "17px", lg: "15px" }}>17:00</TagLabel>
            </Tag>
            <Tag size="lg" variant="subtle" colorScheme="whatsapp">
              <TagLeftIcon as={BiTennisBall} boxSize={6} />
              <TagLabel fontSize={{ base: "25px", md: "17px", lg: "15px" }}>TENIS</TagLabel>
            </Tag>
          </HStack>
        </CardBody>
        <CardFooter justifyContent="center">
          <HStack spacing={4} justifyContent="center">
            <Button colorScheme="red">Cancelar</Button>
            <Button colorScheme="brand">Pagar</Button>
          </HStack>
        </CardFooter>
      </Card>
*/
