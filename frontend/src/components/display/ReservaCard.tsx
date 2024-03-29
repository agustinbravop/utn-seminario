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
  VStack,
  CardProps,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { EstadoReserva, Reserva } from "@/models";
import { CircleIcon } from "../media-and-icons";
import { formatFechaISO } from "@/utils/dates";
import { useCancelarReserva } from "@/utils/api";
import { ConfirmSubmitButton } from "../forms";
import { estadoReserva, fechaHoraReservada } from "@/utils/reservas";

interface ReservaCardProps extends CardProps {
  reserva: Reserva;
}

export default function ReservaCard({ reserva, ...props }: ReservaCardProps) {
  const umbral = 24 * 60 * 60 * 1000; // Un día en milisegundos
  const fechaActualMinutos = Date.now();
  const fechaReservaMinutos = Number(fechaHoraReservada(reserva));
  const diferenciaTiempo = fechaReservaMinutos - fechaActualMinutos;

  const toast = useToast();

  const { mutate } = useCancelarReserva({
    onSuccess: () => {
      toast({
        title: "Reserva cancelada",
        description: `Reserva cancelada exitosamente.`,
        status: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error al cancelar la reserva",
        description: `Intente de nuevo.`,
        status: "error",
      });
    },
  });

  const estado = estadoReserva(reserva);

  return (
    <>
      <Card size="sm" w="min(80vw, 350px)" {...props}>
        {estado === EstadoReserva.Pagada ? (
          <CardHeader bgColor="green.100" borderRadius="6px" textAlign="center">
            <CircleIcon verticalAlign="-0.1em" color="green" /> Pagada
          </CardHeader>
        ) : estado === EstadoReserva.NoPagada ? (
          <CardHeader bgColor="gray.300" borderRadius="6px" textAlign="center">
            <CircleIcon verticalAlign="-0.1em" color="gray" /> No pagada
          </CardHeader>
        ) : estado === EstadoReserva.Seniada ? (
          <CardHeader
            bgColor="orange.100"
            borderRadius="6px"
            textAlign="center"
          >
            <CircleIcon verticalAlign="-0.1em" color="orange" /> Señada
          </CardHeader>
        ) : (
          <CardHeader bgColor="red.100" borderRadius="6px" textAlign="center">
            <CircleIcon verticalAlign="-0.1em" color="red" /> Cancelada
          </CardHeader>
        )}

        <CardBody px="0" textAlign="center">
          <Heading
            justifyContent="center"
            display="flex"
            fontSize={{ base: "23px", md: "23px", lg: "25px" }}
            mb="5px"
          >
            <Text>{reserva.disponibilidad.cancha.establecimiento.nombre}</Text>
          </Heading>

          <VStack mb={3}>
            <Text textAlign="center">
              <Icon as={MdPlace} boxSize={4} mr="2" verticalAlign="-0.1em" />
              {reserva.disponibilidad.cancha.establecimiento.direccion}
            </Text>
            <Text>
              <PhoneIcon boxSize={4} mr="2" verticalAlign="-0.15em" />
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
            justify="center"
            fontSize={{ base: "15px", md: "17px", lg: "15px" }}
          >
            <Tag size="sm" variant="subtle" colorScheme="gray">
              <TagLeftIcon as={CalendarIcon} boxSize={3} />
              <TagLabel>{formatFechaISO(reserva.fechaReservada)}</TagLabel>
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

        {diferenciaTiempo >= umbral && !reserva.cancelada && (
          <ConfirmSubmitButton
            colorScheme="red"
            onSubmit={() => mutate({ idReserva: reserva.id })}
            header="Cancelar reserva"
            body={
              <>
                <Text>¿Está seguro de cancelar la reserva?</Text>
                {estado === EstadoReserva.NoPagada ? (
                  <Text>
                    Debe comunicarse personalmente con el establecimiento para
                    ver sus términos de cancelación y coordinar una posible
                    devolución del dinero ya pagado.
                  </Text>
                ) : (
                  <Text>
                    El horario será liberado para que pueda volver a ser
                    reservado por otro jugador.
                  </Text>
                )}
              </>
            }
            variant="outline"
            m="0em auto 0.8em"
            size="sm"
            w="fit-content"
          >
            Cancelar Reserva
          </ConfirmSubmitButton>
        )}
      </Card>
    </>
  );
}
