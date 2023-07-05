import { Cancha } from "../../models";
import CanchaCard from "../Cancha/Cancha";
import { HStack } from "@chakra-ui/react";

interface CanchasProps {
  canchas: Cancha[];
}

export default function Canchas({ canchas }: CanchasProps) {
  return (
    <HStack display="flex" flexWrap="wrap" justifyContent="center">
      {canchas.map((cancha) => (
        <CanchaCard key={cancha.id} cancha={cancha} />
      ))}
    </HStack>
  );
}
