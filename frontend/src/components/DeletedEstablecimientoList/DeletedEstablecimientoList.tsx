import { HStack } from "@chakra-ui/react";
import { Establecimiento } from "@/models";
import DeletedEstablecimiento from "../DeletedEstablecimiento/DeletedEstablecimiento";

interface EstablecimientoCardListProps {
  establecimientos: Establecimiento[];
  establecimientosActuales: number;
}

export default function DeletedEstablecimientoList({
  establecimientos, establecimientosActuales
}: EstablecimientoCardListProps) {
  return (
    <HStack display="flex" flexWrap="wrap" justifyContent="left">
      {establecimientos.map((est) => (
        <DeletedEstablecimiento key={est.id} establecimiento={est} establecimientosActuales={establecimientosActuales}  />
      ))}
    </HStack>
  );
}
