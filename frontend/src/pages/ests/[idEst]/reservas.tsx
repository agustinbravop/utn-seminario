import { EstablecimientoMenu } from "@/components/navigation";
import { HStack, Text } from "@chakra-ui/react";

export default function EstablecimientoReservasPage() {
  return (
    <>
      <EstablecimientoMenu />
      <HStack mr="16%" ml="16%" mb="30px" mt="0px">
        <Text>
          Estas son las reservas actuales de para este establecimiento.
        </Text>
      </HStack>
    </>
  );
}
