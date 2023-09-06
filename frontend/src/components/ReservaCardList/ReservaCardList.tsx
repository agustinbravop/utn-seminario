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
    <Heading size="lg">Reservas activas</Heading>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        borderWidth="1px"
        borderRadius="5px"
        maxWidth="800px"
        ml={["0%", "20%"]}
      >
        <ReservaCard />
      
      </SimpleGrid>
      <HStack justifyContent="center">
        <Button fontSize="25px" colorScheme="green">
          Reservar
        </Button>
      </HStack>
    </>
  );
}
