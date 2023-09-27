import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Stack,
  StackDivider,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  useEliminarCancha,
} from "@/utils/api/canchas";
import { useParams } from "@/router";
import { CanchaMenu } from "@/components/navigation";
import { useReservaByID } from "@/utils/api/reservas";
import { ConfirmSubmitButton } from "@/components/forms";

import { MinusIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

import { fechaISOaDDMMAAAA } from "@/utils/dates";


export default function ReservaInfoPage() {
  const { idEst, idReserva } = useParams("/ests/:idEst/reservas/:idReserva");

  const { data: reserva } = useReservaByID(Number(idReserva));
  const navigate = useNavigate();
  const toast = useToast();

  const { mutate: mutateDelete } = useEliminarCancha({
    onSuccess: () => {
      toast({
        title: "Cancha Eliminada.",
        description: `Cancha Eliminada exitosamente.`,
        status: "success",
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al eliminar la cancha",
        description: `Intente de nuevo.`,
        status: "error",
      });
    },
  });

  let estado = <TriangleDownIcon color='Red' />
  if (reserva?.idPagoReserva) {
    estado = <TriangleUpIcon color='Green' />
  } else if (reserva?.idPagoSenia) {
    estado = <MinusIcon color='orange' />
  }


  return (
    <>
      <Card m="auto" height="60%" width="43%" mt="5%">
        <CardBody m="15px">
          <Heading as='h3' size='lg' textAlign="center" > Datos de la reserva</Heading>
          <Stack divider={<StackDivider />} spacing="2.5" pt="10px">
            <Box>
              <Heading size="xs">Estado</Heading>
              <Text fontSize="sm"> {estado} </Text>
            </Box>
            <Box>
              <Heading size="xs">Fecha</Heading>
              <Text fontSize="sm"> {fechaISOaDDMMAAAA(reserva?.fechaReservada)} </Text>
            </Box>
            <Box>
              <Heading size="xs"> Horario </Heading>
              <Text fontSize="sm"> {reserva?.disponibilidad.horaInicio} - {reserva?.disponibilidad.horaFin} hs</Text>
            </Box>
            <Box>
              <Heading size="xs"> Precio </Heading>
              <Text fontSize="sm"> {reserva?.precio} </Text>
            </Box>
            <Box>
              <Heading size="xs">Disciplina</Heading>
              <Text fontSize="sm"> {reserva?.disponibilidad.disciplina} </Text>
            </Box>
          </Stack>

          <Heading textAlign="center" as='h3' size='lg' pt="10px"> Datos del jugador</Heading>

          <Stack divider={<StackDivider />} spacing="2.5" pt="10px">
            <Box>
              <Heading size="xs">Nombre y Apellido</Heading>
              <Text fontSize="sm"> {reserva?.jugador.nombre} {reserva?.jugador.apellido} </Text>
            </Box>
            <Box>
              <Heading size="xs"> Telefono </Heading>
              <Text fontSize="sm"> {reserva?.jugador.telefono}  </Text>
            </Box>
          </Stack>

          <HStack justifyContent="center" spacing="20px" pt="30px">
            <ConfirmSubmitButton
              header="Seña"
              body="¿Está seguro que desea efectuar la seña?"

            > Señar </ConfirmSubmitButton>
            <ConfirmSubmitButton
              header="Pago"
              body="¿Está seguro que desea efectuar el pago?"

            > Pagar </ConfirmSubmitButton>
          </HStack>
        </CardBody>
      </Card>
    </>
  );
}
