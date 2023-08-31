import { HStack } from "@chakra-ui/react";
import { Establecimiento } from "@/models";
import DeletedEstablecimiento from "../DeletedEstablecimiento/DeletedEstablecimiento";

interface EstablecimientoCardListProps {
  establecimientos: Establecimiento[];
  establecimientosActuales: number;
  onRecuperar: () => void;
}

export default function DeletedEstablecimientoList({
  establecimientos, establecimientosActuales, onRecuperar
}: EstablecimientoCardListProps) {
  return (
    <HStack display="flex" flexWrap="wrap" justifyContent="left">
      {establecimientos.map((est) => (
        <DeletedEstablecimiento key={est.id} establecimiento={est} establecimientosActuales={establecimientosActuales} onRecuperar={onRecuperar} />
      ))}
    </HStack>
  );
}
