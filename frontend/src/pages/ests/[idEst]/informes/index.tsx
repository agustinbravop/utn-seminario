import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { EstablecimientoMenu } from "@/components/navigation";
import { useParams } from "@/router";
import { useInformePagosPorCancha } from "@/utils/api";
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

export default function EstablecimientoReservasPage() {
  const { idEst } = useParams("/ests/:idEst/informes");
  const [fechaDesde, setFechaDesde] = useState<string | undefined>(undefined);
  const [fechaHasta, setFechaHasta] = useState<string | undefined>(undefined);
  const { data: informe } = useInformePagosPorCancha({
    idEst: Number(idEst),
    fechaDesde,
    fechaHasta,
  });

  if (!informe) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <EstablecimientoMenu />
      <HStack mr="16%" ml="16%" mb="20px" mt="30px">
        <FormControl variant="floating" width="auto">
          <Input
            type="date"
            placeholder="Fecha desde"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
          <FormLabel>Desde</FormLabel>
        </FormControl>
        <FormControl variant="floating" width="auto">
          <Input
            type="date"
            placeholder="Fecha hasta"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
          <FormLabel>Hasta</FormLabel>
        </FormControl>
      </HStack>
      {JSON.stringify(informe)}
      <VStack>
        {informe.canchas.map((c) => (
          <Text key={c.id}>{JSON.stringify(c)}</Text>
        ))}
      </VStack>
    </>
  );
}
