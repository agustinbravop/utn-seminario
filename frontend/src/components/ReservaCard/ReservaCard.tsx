import { MdPlace } from "react-icons/md";
import { LuClock5 } from "react-icons/lu";
import { BiTennisBall } from "react-icons/bi";
import { FcSportsMode } from "react-icons/fc";
import { PhoneIcon, CalendarIcon } from "@chakra-ui/icons";
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
import { CircleIcon } from "../CircleIcon/CircleIcon";
import { formatearISO } from "@/utils/dates";

export default function ReservaCard({
  reserva,
  ...props
}: {
  reserva: Reserva;
  props: any;
}) {
  return (
    <>
      <Card size="sm" m={2} textAlign="center" {...props}>
        {reserva.idPagoReserva ? (
          <CardHeader borderRadius="6px" backgroundColor="green.100">
            <HStack justifyContent="center">
              <CircleIcon color="green" />
              <Text> Pagada </Text>
            </HStack>
          </CardHeader>
        ) : reserva.idPagoSenia ? (
          <CardHeader borderRadius="6px" backgroundColor="orange.100">
            <HStack justifyContent="center">
              <CircleIcon color="orange" />
              <Text> Señada </Text>
            </HStack>
          </CardHeader>
        ) : (
          <CardHeader backgroundColor="red.200" borderRadius="6px">
            <HStack justifyContent="center">
              <CircleIcon color="red" />
              <Text> No pagada</Text>
            </HStack>
          </CardHeader>
        )}

        <CardBody textAlign="center">
          <Heading
            justifyContent="center"
            display="flex"
            fontSize={{ base: "23px", md: "23px", lg: "25px" }}
            mb="5px"
          >
            <Text>
              {" "}
              {reserva.disponibilidad.cancha.establecimiento.nombre}{" "}
            </Text>
          </Heading>
          <VStack fontSize={{ base: "20px", md: "17px", lg: "15px" }} mr="25px">
            <Text>
              <Icon as={MdPlace} boxSize={4} mr="2" alignSelf="start" />{" "}
              {reserva.disponibilidad.cancha.establecimiento.direccion}
            </Text>
            <Text>
              <PhoneIcon boxSize={4} mr="2" alignSelf="start" />
              {reserva.disponibilidad.cancha.establecimiento.telefono}
            </Text>
          </VStack>
          <br />
          <HStack
            spacing={2}
            justifyContent="center"
            fontSize={{ base: "15px", md: "17px", lg: "15px" }}
            mb={3}
          >
            <Tag size="sm" variant="subtle" colorScheme="blue">
              <TagLeftIcon as={LuClock5} boxSize={4} />
              <TagLabel>
                {reserva.disponibilidad.horaInicio}
                {"- "}
                {reserva.disponibilidad.horaFin}
              </TagLabel>
            </Tag>
            <Tag size="sm" variant="subtle" colorScheme="gray">
              <TagLeftIcon as={CalendarIcon} boxSize={4} />
              <TagLabel>{formatearISO(reserva.fechaReservada)}</TagLabel>
            </Tag>
            <Tag size="sm" variant="subtle" colorScheme="purple">
              <TagLabel> {reserva.disponibilidad.disciplina} </TagLabel>
            </Tag>
          </HStack>
          {/* <HStack spacing={4} justifyContent="center" mt="10px">
            <Button colorScheme="red" size="sm">
              Cancelar Reserva
            </Button>
          </HStack> */}
        </CardBody>
      </Card>
    </>
  );
}
