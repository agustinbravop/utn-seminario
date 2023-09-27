import {
    Box,
    Button,
    Card,
    CardBody,
    HStack,
    Heading,
    Stack,
    Text,
    useToast,
  } from "@chakra-ui/react";
  import { Link, useNavigate } from "react-router-dom";
  import {
    useEliminarCancha,
  } from "@/utils/api/canchas";
  import { useParams } from "@/router";
  import { CanchaMenu } from "@/components/navigation";
import { useReservaByID } from "@/utils/api/reservas";
  
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
  

    return (
      <>
        <HStack mr="16%" ml="16%" mb="30px" mt="0px">
          <Text>Esta es la información de la reserva.</Text>
        </HStack>
        <Card m="auto" height="75%" width="75%">
          <CardBody display="grid" gridTemplateColumns="1fr 1fr">
            <Stack>
            <Heading> Datos de la reserva</Heading>
              <Box>
                <Heading size="xs">Fecha</Heading>
                <Text fontSize="sm"> {reserva?.fechaReservada} </Text>
              </Box>
              <Box>
                <Heading size="xs"> Horario </Heading>
                <Text fontSize="sm"> {reserva?.disponibilidad.horaInicio} - {reserva?.disponibilidad.horaFin} </Text>
              </Box>
              <Box>
                <Heading size="xs"> Precio </Heading>
                <Text fontSize="sm"> {reserva?.precio} </Text>
              </Box>
              <Box>
                <Heading size="xs">Disciplinas</Heading>
              </Box>

              <Heading> Datos del jugador</Heading>
              <Box>
                <Heading size="xs">Fecha</Heading>
                <Text fontSize="sm"> {reserva?.jugador.nombre} </Text>
              </Box>
              <Box>
                <Heading size="xs"> Horario </Heading>
                <Text fontSize="sm"> {reserva?.disponibilidad.horaInicio} - {reserva?.disponibilidad.horaFin} </Text>
              </Box>
              <Box>
                <Heading size="xs"> Precio </Heading>
                <Text fontSize="sm"> {reserva?.precio} </Text>
              </Box>
              </Stack>
          </CardBody>
        </Card>
      </>
    );
  }
  