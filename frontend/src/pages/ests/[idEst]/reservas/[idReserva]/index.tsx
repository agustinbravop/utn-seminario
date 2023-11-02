import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  StackDivider,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "@/router";
import {
  usePagarReserva,
  useReservaByID,
  useSeniarReserva,
} from "@/utils/api/reservas";
import { ConfirmSubmitButton } from "@/components/forms";
import { formatISO, formatISOFecha } from "@/utils/dates";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import { useNavigate } from "react-router";
import { pagoRestante } from "@/utils/reservas";
import ReservaEstado from "@/components/display/ReservaEstado";

export default function ReservaInfoPage() {
  const { idReserva } = useParams("/ests/:idEst/reservas/:idReserva");
  const { data: reserva } = useReservaByID(Number(idReserva));
  const toast = useToast();
  const navigate = useNavigate();

  const { mutate } = useSeniarReserva({
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
        title: "Error al realizar el pago",
        description: "Intente de nuevo.",
        status: "error",
      });
    },
  });

  if (!reserva) {
    return <LoadingSpinner />;
  }

  let precioAPagar = reserva.precio;
  if (reserva.senia && reserva.pagoSenia) {
    precioAPagar = reserva.precio - reserva.senia;
  }

  return (
    <Card m="auto" height="60%" maxW="450px" mt="5%">
      <CardBody m="15px">
        <Heading as="h3" size="lg" textAlign="center">
          Datos de la reserva
        </Heading>
        <VStack divider={<StackDivider />} mt="20px">
          <HStack width="100%">
            <Box flex="1">
              <Heading size="xs">Fecha reservada para jugar</Heading>
              <Text fontSize="sm">
                {formatISOFecha(reserva.fechaReservada)}
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
          <HStack width="100%">
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
          <HStack width="100%">
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
          <HStack width="100%">
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
          <HStack width="100%">
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
              {reserva.jugador.nombre} {reserva.jugador.apellido}
            </Text>
          </Box>
          <Box flex="1">
            <Heading size="xs">Teléfono</Heading>
            <Text fontSize="sm">{reserva.jugador.telefono}</Text>
          </Box>
        </HStack>

        <HStack justifyContent="center" spacing="20px" pt="30px">
          <Button onClick={() => navigate(-1)}>Volver</Button>
          {!reserva.idPagoSenia &&
            !reserva.idPagoReserva &&
            reserva.disponibilidad.precioSenia && (
              <ConfirmSubmitButton
                header="Seña"
                body={`¿Desea registrar la seña de $${reserva.senia}?`}
                onSubmit={() => mutate(reserva)}
              >
                Señar
              </ConfirmSubmitButton>
            )}

          {!reserva.idPagoReserva && (
            <ConfirmSubmitButton
              header="Pago"
              body={`¿Desea registrar el pago de $${precioAPagar}?`}
              onSubmit={() => mutatePago(reserva)}
            >
              Pagar
            </ConfirmSubmitButton>
          )}
        </HStack>
      </CardBody>
    </Card>
  );
}
