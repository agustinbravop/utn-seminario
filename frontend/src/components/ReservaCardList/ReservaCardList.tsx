import ReservaCard from "../ReservaCard/ReservaCard";
import { Heading } from "@chakra-ui/react";

export default function ReservaCardList() {
  //TODO: Agregar a CardList los props para que resiva una reserva y muestre los datos

  return (
    <>
      <Heading pb="10px" size="lg" textAlign="center">
        Reservas Activas
      </Heading>
      <ReservaCard />
    </>
  );
}
