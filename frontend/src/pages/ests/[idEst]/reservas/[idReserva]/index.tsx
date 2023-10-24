import {
  Box,
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  Heading,
  Stack,
  StackDivider,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "@/router";
import {
  usePagarReserva,
  useReservaByID,
  useSeniarReserva,
} from "@/utils/api/reservas";
import { ConfirmSubmitButton } from "@/components/forms";
import { formatISOFecha } from "@/utils/dates";
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
    <>
      <Card m="auto" height="60%" maxW="400px" mt="5%">
        <CardBody m="15px">
          <Heading as="h3" size="lg" textAlign="center">
            Datos de la reserva
          </Heading>
          <Stack divider={<StackDivider />} spacing="4.5" pt="20px">
            <Grid gridTemplateColumns="1.8fr 1fr" rowGap="1.0em" pl="3">
              <GridItem>
                <Heading size="xs">Fecha de juego</Heading>
                <Text fontSize="sm">
                  {formatISOFecha(reserva.fechaReservada)}
                </Text>
              </GridItem>
              <GridItem>
                <Heading size="xs">Horario</Heading>
                <Text fontSize="sm">
                  {reserva.disponibilidad.horaInicio}
                  {" - "}
                  {reserva.disponibilidad.horaFin} hs
                </Text>
              </GridItem>
              <GridItem>
                <Heading size="xs">Estado</Heading>
                <Text fontSize="sm">
                  <ReservaEstado res={reserva} />
                </Text>
              </GridItem>
              <GridItem>
                <Heading size="xs">Disciplina</Heading>
                <Text fontSize="sm">{reserva.disponibilidad.disciplina}</Text>
              </GridItem>
              <GridItem>
                <Heading size="xs">Precio total</Heading>
                <Text fontSize="sm">${reserva.precio}</Text>
              </GridItem>
              <GridItem>
                <Heading size="xs">Seña</Heading>
                <Text fontSize="sm">
                  {reserva.senia ? `$${reserva.senia}` : "-"}
                </Text>
              </GridItem>
              <GridItem>
                <Heading size="xs">Pago restante</Heading>
                <Text fontSize="sm">${pagoRestante(reserva)}</Text>
              </GridItem>
            </Grid>
          </Stack>

          <Heading size="md" mt="1.5rem">
            Información del jugador
          </Heading>

          <Stack divider={<StackDivider />} spacing="2.5" pt="13px">
            <Box ml="3">
              <Heading size="xs">Nombre y Apellido</Heading>
              <Text fontSize="sm">
                {reserva.jugador.nombre} {reserva.jugador.apellido}
              </Text>
            </Box>
            <Box ml="3">
              <Heading size="xs"> Teléfono </Heading>
              <Text fontSize="sm"> {reserva.jugador.telefono} </Text>
            </Box>
          </Stack>

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
    </>
  );
}
