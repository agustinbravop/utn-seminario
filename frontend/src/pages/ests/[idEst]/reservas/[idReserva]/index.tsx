import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  HStack,
  Heading,
  StackDivider,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "@/router";
import {
  useCancelarReservaAdmin,
  usePagarReserva,
  useReservaByID,
  useSeniarReserva,
} from "@/utils/api/reservas";
import { ConfirmSubmitButton } from "@/components/forms";
import { formatISO, formatFechaISO } from "@/utils/dates";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import { useNavigate } from "react-router";
import { pagoRestante } from "@/utils/reservas";
import ReservaEstado from "@/components/display/ReservaEstado";

export default function ReservaInfoPage() {
  const { idReserva } = useParams("/ests/:idEst/reservas/:idReserva");
  const { data: reserva } = useReservaByID(Number(idReserva));
  const toast = useToast();
  const navigate = useNavigate();

  const { mutate: mutateSenia } = useSeniarReserva({
    onSuccess: () => {
      toast({
        title: "Reserva señada",
        description: "Se registró la seña de la reserva.",
        status: "success",
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

  const { mutate: mutatePago } = usePagarReserva({
    onSuccess: () => {
      toast({
        title: "Reserva pagada",
        description: "Se registró el pago de la reserva.",
        status: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error al pagar la reserva",
        description: "Intente de nuevo.",
        status: "error",
      });
    },
  });

  const { mutate: mutateCancelar } = useCancelarReservaAdmin({
    onSuccess: () => {
      toast({
        title: "Reserva cancelada",
        description: "Reserva cancelada exitosamente.",
        status: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error al cancelar la reserva",
        description: "Intente de nuevo.",
        status: "error",
      });
    },
  });

  if (!reserva) {
    return <LoadingSpinner />;
  }

  return (
    <Card m="auto" h="60%" maxW="450px" mt="5%">
      <CardBody m="15px">
        <Heading as="h3" size="lg" textAlign="center">
          Datos de la reserva
        </Heading>
        {reserva.cancelada && (
          <Heading size="md" mt="35px" mb="15px" color="red">
            Esta reserva fue cancelada
          </Heading>
        )}
        <VStack divider={<StackDivider />} mt="20px">
          <HStack w="100%">
            <Box flex="1">
              <Heading size="xs">Fecha reservada para jugar</Heading>
              <Text fontSize="sm">
                {formatFechaISO(reserva.fechaReservada)}
              </Text>
            </Box>
            <Box flex="1">
              <Heading size="xs">Horario</Heading>
              <Text fontSize="sm">
                {reserva.disponibilidad.horaInicio}
                {" - "}
                {reserva.disponibilidad.horaFin} hs
              </Text>
            </Box>
          </HStack>
          <HStack w="100%">
            <Box flex="1">
              <Heading size="xs">Fecha de creación</Heading>
              <Text fontSize="sm">{formatISO(reserva.fechaCreada)}</Text>
            </Box>
            <Box flex="1">
              <Heading size="xs">Disciplina</Heading>
              <Text fontSize="sm">{reserva.disponibilidad.disciplina}</Text>
            </Box>
          </HStack>
        </VStack>

        <Heading size="md" mt="35px" mb="15px">
          Estado del pago
        </Heading>
        <VStack divider={<StackDivider />}>
          <HStack w="100%">
            <Box flex="1">
              <Heading size="xs">Estado</Heading>
              <Text fontSize="sm">
                <ReservaEstado res={reserva} />
              </Text>
            </Box>
            <Box flex="1">
              <Heading size="xs">Pago restante</Heading>
              <Text fontSize="sm">${pagoRestante(reserva)}</Text>
            </Box>
          </HStack>
          <HStack w="100%">
            <Box flex="1">
              <Heading size="xs">Precio total</Heading>
              <Text fontSize="sm">${reserva.precio}</Text>
            </Box>
            <Box flex="1">
              <Heading size="xs">Seña</Heading>
              <Text fontSize="sm">
                {reserva.senia ? `$${reserva.senia}` : "-"}
              </Text>
            </Box>
          </HStack>
          <HStack w="100%">
            <Box flex="1">
              <Heading size="xs">Fecha del pago</Heading>
              <Text fontSize="sm">
                {reserva.pagoReserva
                  ? formatISO(reserva.pagoReserva.fechaPago)
                  : "Falta pagar"}
              </Text>
            </Box>
            <Box flex="1">
              <Heading size="xs">Fecha de la seña</Heading>
              <Text fontSize="sm">
                {reserva.pagoSenia
                  ? formatISO(reserva.pagoSenia.fechaPago)
                  : reserva.pagoReserva
                    ? "-"
                    : "Falta señar"}
              </Text>
            </Box>
          </HStack>
        </VStack>

        <Heading size="md" mt="35px">
          Información del jugador
        </Heading>

        <HStack mt="15px">
          <Box flex="1">
            <Heading size="xs">Nombre y Apellido</Heading>
            <Text fontSize="sm">
              {reserva.jugador
                ? reserva.jugador.nombre + " " + reserva.jugador.apellido
                : reserva.jugadorNoRegistrado}
            </Text>
          </Box>
          <Box flex="1">
            <Heading size="xs">Teléfono</Heading>
            <Text fontSize="sm">{reserva.jugador?.telefono ?? "-"}</Text>
          </Box>
        </HStack>
        {reserva.jugadorNoRegistrado && (
          <HStack mt="15px">
            <Box flex="1.5">
              <Text fontSize="sm">
                Esta reserva la hizo para un cliente no registrado en
                PlayFinder.
              </Text>
            </Box>
            <Box flex="1">
              {reserva.jugadorNoRegistrado && !reserva.cancelada && (
                <ConfirmSubmitButton
                  header="Cancelar reserva"
                  body={
                    <>
                      <Text>
                        ¿Desea cancelar la reserva? Es importante que{" "}
                        {reserva.jugadorNoRegistrado} se lo haya solicitado o
                        usted le avise, porque ese cliente no está registrado en
                        PlayFinder.
                      </Text>
                      <Divider my="0.5em" />
                      <Text color="gray">
                        Cancelar esta reserva libera el horario reservado para
                        que otro usuario lo pueda reservar nuevamente.
                      </Text>
                    </>
                  }
                  onSubmit={() => mutateCancelar({ idReserva: reserva.id })}
                  colorScheme="red"
                  variant="outline"
                >
                  Cancelar reserva
                </ConfirmSubmitButton>
              )}
            </Box>
          </HStack>
        )}

        <HStack justify="center" spacing="20px" pt="30px">
          <Button onClick={() => navigate(-1)}>Volver</Button>
          {!reserva.idPagoSenia &&
            !reserva.idPagoReserva &&
            !reserva.cancelada &&
            reserva.disponibilidad.precioSenia && (
              <ConfirmSubmitButton
                header="Seña"
                body={`¿Desea registrar la seña de $${reserva.senia}?`}
                onSubmit={() => mutateSenia({ idRes: reserva.id })}
              >
                Señar
              </ConfirmSubmitButton>
            )}

          {!reserva.idPagoReserva && !reserva.cancelada && (
            <ConfirmSubmitButton
              header="Pago"
              body={`¿Desea registrar el pago de $${pagoRestante(reserva)}?`}
              onSubmit={() => mutatePago({ idRes: reserva.id })}
            >
              Pagar
            </ConfirmSubmitButton>
          )}
        </HStack>
      </CardBody>
    </Card>
  );
}
