import { Establecimiento } from "@/models";
import ReservaCard from "../ReservaCard/ReservaCard";
import { Button, HStack, Heading, SimpleGrid } from "@chakra-ui/react";

interface Props {
  reservas: Establecimiento[];
}

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
