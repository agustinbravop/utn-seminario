import {
  Box,
  Card,
  CardBody,
  HStack,
  Heading,
  Stack,
  StackDivider,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "@/router";
import { usePagarReserva, useReservaByID, useSeniarReserva } from "@/utils/api/reservas";
import { ConfirmSubmitButton } from "@/components/forms";
import { MinusIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { formatearISO } from "@/utils/dates";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function ReservaInfoPage() {
  const { idReserva } = useParams("/ests/:idEst/reservas/:idReserva");
  const { data: reserva } = useReservaByID(Number(idReserva));
  const toast = useToast();
  
  const {mutate} = useSeniarReserva({
    onSuccess: () => {
      toast({
        title: `Reserva`,
        description: "Reserva señada exitosamente",
        status: "success"
      });
    },
    onError: () => {
        toast({
          title: "Error al señar la reserva",
          description: "Intente de nuevo.",
          status: "error",
        });
      },
  });

  const {mutate: mutatePago} = usePagarReserva({
    onSuccess: () => {
      toast({
        title: `Pago`,
        description: "Pago realizado exitosamente",
        status: "success"
      });
    },
    onError: () => {
        toast({
          title: "Error al realizar el pago",
          description: "Intente de nuevo.",
          status: "error",
        });
      },
  });

  if (!reserva) {
    return <LoadingSpinner />;
  }

  let estado = <TriangleDownIcon color="Red" />;
  if (reserva.idPagoReserva) {
    estado = <TriangleUpIcon color="Green" />;
  } else if (reserva.idPagoSenia) {
    estado = <MinusIcon color="orange" />;
  }

  return (
    <>
      <Card m="auto" height="60%" width="38%" mt="5%">
        <CardBody m="15px">
          <Heading as="h3" size="lg" textAlign="center">
            Datos de la reserva
          </Heading>
          <Stack divider={<StackDivider />} spacing="2.5" pt="10px">
            <Box>
              <Heading size="xs">Estado</Heading>
              <Text fontSize="sm"> {estado} </Text>
            </Box>
            <Box>
              <Heading size="xs">Fecha</Heading>
              <Text fontSize="sm">{formatearISO(reserva.fechaReservada)}</Text>
            </Box>
            <Box>
              <Heading size="xs"> Horario </Heading>
              <Text fontSize="sm">
                {reserva.disponibilidad.horaInicio} -
                {reserva.disponibilidad.horaFin} hs
              </Text>
            </Box>
            <Box>
              <Heading size="xs"> Precio </Heading>
              <Text fontSize="sm"> {reserva.precio} </Text>
            </Box>
            <Box>
              <Heading size="xs">Disciplina</Heading>
              <Text fontSize="sm"> {reserva.disponibilidad.disciplina} </Text>
            </Box>
          </Stack>

          <Heading textAlign="center" as="h3" size="lg" pt="10px">
            Datos del jugador
          </Heading>

          <Stack divider={<StackDivider />} spacing="2.5" pt="10px">
            <Box>
              <Heading size="xs">Nombre y Apellido</Heading>
              <Text fontSize="sm">
                {reserva.jugador.nombre} {reserva.jugador.apellido}
              </Text>
            </Box>
            <Box>
              <Heading size="xs"> Telefono </Heading>
              <Text fontSize="sm"> {reserva.jugador.telefono} </Text>
            </Box>
          </Stack>

          <HStack justifyContent="center" spacing="20px" pt="30px">
            <ConfirmSubmitButton
              header="Seña"
              body="¿Está seguro que desea efectuar la seña?"
              onSubmit={() => mutate(reserva)}
            >
              Señar
            </ConfirmSubmitButton>
            <ConfirmSubmitButton
              header="Pago"
              body="¿Está seguro que desea efectuar el pago?"
              onSubmit={() => mutatePago(reserva)}
            >
              Pagar
            </ConfirmSubmitButton>
          </HStack>
        </CardBody>
      </Card>
    </>
  );
}
