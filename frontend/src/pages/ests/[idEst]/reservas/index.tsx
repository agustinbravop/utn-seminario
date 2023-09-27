import { EstablecimientoMenu } from "@/components/navigation";
import {
  HStack,
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
} from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon, MinusIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router";
import { useParams } from "@/router";
import { useReservasByEstablecimientoID } from "@/utils/api/reservas";
import { formatearISO } from "@/utils/dates";

export default function EstablecimientoReservasPage() {
  const { idEst } = useParams("/ests/:idEst/reservas");
  const navigate = useNavigate();
  const { data: reservas } = useReservasByEstablecimientoID(Number(idEst));

  return (
    <>
      <EstablecimientoMenu />
      <HStack mr="16%" ml="16%" mb="30px" mt="0px">
        <Text>
          {reservas.length > 0
            ? "Estas son las reservas actuales para este establecimiento."
            : "Actualmente no hay reservas para este establecimiento."}
        </Text>
      </HStack>
      <TableContainer pt="15px" pb="20px" mr="16%" ml="16%" mb="30px" mt="0px">
        <Table variant="striped" size="sm">
          <Thead>
            <Tr>
              <Th textAlign="center">Cancha</Th>
              <Th textAlign="center">Fecha</Th>
              <Th textAlign="center">Jugador</Th>
              <Th textAlign="center">Ver Detalle</Th>
              <Th textAlign="center">Estado</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {reservas?.map((r) => {
              let estado = <TriangleDownIcon color="Red" />;
              if (r.idPagoReserva) {
                estado = <TriangleUpIcon color="Green" />;
              } else if (r.idPagoSenia) {
                estado = <MinusIcon color="orange" />;
              }
              return (
                <Tr key={r.id}>
                  <Td textAlign="center">{r.disponibilidad.cancha?.nombre}</Td>
                  <Td textAlign="center">{formatearISO(r.fechaReservada)} </Td>
                  <Td textAlign="center">
                    {r.jugador.nombre} {r.jugador.apellido}
                  </Td>
                  <Td textAlign="center">
                    <Button
                      colorScheme="brand"
                      variant="outline"
                      onClick={() => navigate(`${r.id}`)}
                    >
                      Ver Detalle
                    </Button>
                  </Td>
                  <Td textAlign="center">{estado}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
