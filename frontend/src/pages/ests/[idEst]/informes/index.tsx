import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { EstablecimientoMenu } from "@/components/navigation";
import { useParams } from "@/router";
import { useBuscarPagos } from "@/utils/api/pagos";
import { Text, VStack } from "@chakra-ui/react";

export default function EstablecimientoReservasPage() {
  const { idEst } = useParams("/ests/:idEst/informes");
  const { data: pagos } = useBuscarPagos({ idEstablecimiento: Number(idEst) });

  if (!pagos) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <EstablecimientoMenu />
      <VStack>
        {pagos.map((p) => (
          <Text>{JSON.stringify(p)}</Text>
        ))}
      </VStack>
    </>
  );
}
