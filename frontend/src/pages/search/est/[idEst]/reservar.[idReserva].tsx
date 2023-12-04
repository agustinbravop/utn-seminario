import { Button, HStack, Image, Text } from "@chakra-ui/react";
import SuccessIllustrationSvg from "@/assets/success_illustration.svg";
import { Link, useParams } from "@/router";
import { useCurrentJugador } from "@/hooks";
import { useReservaByID } from "@/utils/api";
import { LoadingSpinner } from "@/components/feedback";
import { QuestionAlert } from "@/components/media-and-icons";

export default function ReservaExitosaPage() {
  const { jugador } = useCurrentJugador();
  const { idReserva } = useParams("/search/est/:idEst/reservar/:idReserva");
  const {
    data: reserva,
    isLoading,
    isError,
  } = useReservaByID(Number(idReserva));

  if (isLoading) {
    return <LoadingSpinner />;
  } else if (isError) {
    return (
      <QuestionAlert>No parece haber una reserva con ese ID.</QuestionAlert>
    );
  }

  return (
    <>
      <Text textAlign="center" fontSize="xl">
        ¡Reserva registrada exitosamente!
      </Text>
      <Text textAlign="center" fontSize="xl">
        Usted juega en{" "}
        <strong>{reserva.disponibilidad.cancha.establecimiento.nombre}</strong>{" "}
        el día{" "}
        <strong>{new Date(reserva.fechaReservada).toLocaleDateString()}</strong>{" "}
        desde las <strong>{reserva.disponibilidad.horaInicio}hs</strong> hasta
        las <strong>{reserva.disponibilidad.horaFin}hs</strong>.
      </Text>
      <Text textAlign="center" fontSize="xl">
        Podrá realizar el pago cuando vaya al establecimiento.
      </Text>
      <Image
        src={SuccessIllustrationSvg}
        objectFit="cover"
        objectPosition="50% 50%"
        alt="Corredor cruzando la meta de fin"
        margin="auto"
        maxWidth="400px"
      />
      <HStack justify="center">
        <Link to="/search">
          <Button>Volver al inicio</Button>
        </Link>
        <Link
          to="/jugador/:idJugador/reservas"
          params={{ idJugador: `${jugador.id}` }}
        >
          <Button>Mis reservas</Button>
        </Link>
      </HStack>
    </>
  );
}
