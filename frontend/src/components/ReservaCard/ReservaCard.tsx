import { MdPlace } from "react-icons/md";
import { LuClock5 } from "react-icons/lu";
import { BiTennisBall } from "react-icons/bi";
import { PhoneIcon } from "@chakra-ui/icons";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Icon,
  Tag,
  TagLeftIcon,
  TagLabel,
  HStack,
  VStack,
  Button,
} from "@chakra-ui/react";
import { Reserva } from "@/models";
import { formatearISO } from "@/utils/dates";

export default function ReservaCard({ reserva }: { reserva: Reserva }) {
  return (
    <>
      <Card size="sm" m={2} textAlign="center" h="270px" w="min(80vw, 400px)">
        {reserva.idPagoReserva ? (
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
        ) : (
          <CardHeader backgroundColor="red.200" borderRadius="6px">
            <HStack justifyContent="center">
              <Icon viewBox="0 0 200 200" color="red">
                <path
                  fill="currentColor"
                  d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                />
              </Icon>
              <Text> No pagada</Text>
            </HStack>
          </CardHeader>
        )}

        <CardBody textAlign="center">
          <Heading
            justifyContent="center"
            display="flex"
            fontSize={{ base: "25px", md: "25px", lg: "27px" }}
          >
            <Text> Club hercules </Text>
          </Heading>
          <VStack
            fontSize={{ base: "20px", md: "17px", lg: "15px" }}
            mr="25px"
            mb={3}
          >
            <Text>
              <Icon as={MdPlace} boxSize={4} mr="2" alignSelf="start" />{" "}
              Direccion
            </Text>
            <Text>
              <PhoneIcon boxSize={4} mr="2" alignSelf="start" /> Telefono
            </Text>
          </VStack>
          <HStack
            spacing={2}
            justifyContent="center"
            fontSize={{ base: "15px", md: "17px", lg: "15px" }}
            mb={3}
          >
            <Tag size="sm" variant="subtle" colorScheme="teal">
              <TagLeftIcon as={LuClock5} boxSize={4} />
              <TagLabel> {formatearISO(reserva.fechaReservada)} </TagLabel>
            </Tag>
            <Tag size="sm" variant="subtle" colorScheme="whatsapp">
              <TagLeftIcon as={BiTennisBall} boxSize={4} />
              <TagLabel> {reserva.disponibilidad.disciplina} </TagLabel>
            </Tag>
          </HStack>
          <HStack spacing={4} justifyContent="center" mt="10px">
            <Button colorScheme="red" size="sm">
              Cancelar Reserva
            </Button>
          </HStack>
        </CardBody>
      </Card>
    </>
  );
}
