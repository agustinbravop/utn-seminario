import { HStack } from "@chakra-ui/react";
import { Establecimiento } from "../../models";
import EstablecimientoCard from "../EstablecimientoCard/EstablecimientoCard";

interface EstablecimientoCardListProps {
  establecimientos: Establecimiento[];
}

export default function EstablecimientoCardList({
  establecimientos,
}: EstablecimientoCardListProps) {
  return (
    <HStack display="flex" flexWrap="wrap" justifyContent="left">
      {establecimientos.map((est) => (
        <EstablecimientoCard key={est.id} establecimiento={est} />
      ))}
    </HStack>
  );
}
