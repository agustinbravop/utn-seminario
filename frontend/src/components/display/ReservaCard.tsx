import { MdAttachMoney, MdPlace } from "react-icons/md";
import { LuClock5 } from "react-icons/lu";
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
  CardProps,
  Stack,
  Button,
} from "@chakra-ui/react";
import { Reserva } from "@/models";
import { CircleIcon } from "../media-and-icons";
import { formatISOFecha } from "@/utils/dates";

interface ReservaCardProps extends CardProps {
  reserva: Reserva;
}

const fechaActualMinutos = Date.now() / 60000
const fechaReservaMinutos = (Date.now() + 172800000 ) / 60000
const umbralMinutos = 2880
const diferenciaMinutos = fechaReservaMinutos - fechaActualMinutos;


export default function ReservaCard({ reserva, ...props }: ReservaCardProps) {
  return (
    <>
      <Card size="sm" m={2} w="min(80vw, 350px)" {...props}>
        {reserva.idPagoReserva ? (
          <CardHeader borderRadius="6px" backgroundColor="green.100">
            <HStack justifyContent="center">
              <CircleIcon color="green" />
              <Text>Pagada</Text>
            </HStack>
          </CardHeader>
        ) : reserva.idPagoSenia ? (
          <CardHeader borderRadius="6px" backgroundColor="orange.100">
            <HStack justifyContent="center">
              <CircleIcon color="orange" />
              <Text>Señada</Text>
            </HStack>
          </CardHeader>
        ) : (
          <CardHeader backgroundColor="gray.300" borderRadius="6px">
            <HStack justifyContent="center">
              <CircleIcon color="red" />
              <Text>No pagada</Text>
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
            <Text>{reserva.disponibilidad.cancha.establecimiento.nombre}</Text>
          </Heading>
          <VStack
            fontSize={{ base: "20px", md: "17px", lg: "15px" }}
            mr="25px"
            mb={3}
          >
            <Text>
              <Icon as={MdPlace} boxSize={4} mr="2" alignSelf="start" />
              {reserva.disponibilidad.cancha.establecimiento.direccion}
            </Text>
            <Text>
              <PhoneIcon boxSize={4} mr="2" alignSelf="start" />
              {reserva.disponibilidad.cancha.establecimiento.telefono}
            </Text>
            <Text>
              <Icon
                as={MdAttachMoney}
                fontSize="1.2em"
                verticalAlign="-0.15em"
              />
              {reserva.precio}
              {reserva.senia && (
                <span style={{ color: "gray" }}>
                  {` (Seña: $${reserva.senia})`}
                </span>
              )}
            </Text>
          </VStack>

          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={2}
            align="center"
            justifyContent="center"
            fontSize={{ base: "15px", md: "17px", lg: "15px" }}
            mb={3}
          >
            <Tag size="sm" variant="subtle" colorScheme="gray">
              <TagLeftIcon as={CalendarIcon} boxSize={3} />
              <TagLabel>{formatISOFecha(reserva.fechaReservada)}</TagLabel>
            </Tag>
            <Tag size="sm" variant="subtle" colorScheme="blue">
              <TagLeftIcon as={LuClock5} boxSize={3} />
              <TagLabel>
                {reserva.disponibilidad.horaInicio}
                {" - "}
                {reserva.disponibilidad.horaFin}
              </TagLabel>
            </Tag>
            <Tag size="sm" variant="subtle" colorScheme="purple">
              <TagLabel>{reserva.disponibilidad.disciplina}</TagLabel>
            </Tag>
          </Stack>
        </CardBody>
        {diferenciaMinutos >= umbralMinutos && (
          <Button>Cancelar reserva</Button>
        )}
      </Card>
    </>
  );
}
