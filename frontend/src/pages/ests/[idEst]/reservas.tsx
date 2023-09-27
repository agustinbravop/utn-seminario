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
import { CheckIcon, SmallCloseIcon, TriangleUpIcon, TriangleDownIcon, MinusIcon } from '@chakra-ui/icons'
import { useNavigate } from "react-router";

const dataReservas = {
  reservas: [
    {
      cancha: 'Cancha 1',
      fechaReserva: '2023-05-07',
      jugador: 'Pepe',
      estado: 'Pagado'
    },
    {
      cancha: 'Cancha 2',
      fechaReserva: '2023-05-07',
      jugador: 'Coqui',
      estado: 'Sin Pagar'
    },
    {
      cancha: 'Cancha 3',
      fechaReserva: '2023-05-07',
      jugador: 'Paola',
      estado: 'Señado'
    },
    {
      cancha: 'Cancha 4',
      fechaReserva: '2023-05-07',
      jugador: 'Moni',
      estado: 'Sin Pagar'
    }
  ]
}

export default function EstablecimientoReservasPage() {
  const navigate = useNavigate();

  return (
    <>
      <EstablecimientoMenu />
      <HStack
        marginRight="16%"
        marginLeft="16%"
        marginBottom="30px"
        marginTop="0px"
      >
        <Text>
          Estas son las reservas actuales de para este establecimiento.
        </Text>
      </HStack>
      <TableContainer paddingTop="15px" paddingBottom="20px"
        marginRight="16%"
        marginLeft="16%"
        marginBottom="30px"
        marginTop="0px">
        <Table variant="striped" size="sm">
          <Thead>
            <Tr>
              <Th textAlign='center'>Cancha</Th>
              <Th textAlign='center'>Día</Th>
              <Th textAlign='center'>Jugador</Th>
              <Th textAlign='center'>Ver Detalle</Th>
              <Th textAlign='center'>Estado</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataReservas?.reservas.map(
              (r) =>
                  <Tr key={r.id}>
                    <Td textAlign='center'>
                      {r.cancha}
                    </Td>
                    <Td textAlign='center'>{r.fechaReserva} </Td>
                    <Td textAlign='center'>{r.jugador}</Td>
                    {/* <Td>{r.dias.map((dia) => DIAS_ABBR[dia]).join(", ")}</Td> */}
                    <Td textAlign='center'>
                      <Button onClick={() => alert(`Detalle de la reserva de ${r.jugador} :)` /*() => navigate(`/...`) */)}>Ver Detalle</Button>
                    </Td>
                    <Td textAlign='center'>{r.estado == 'Pagado' ? <TriangleUpIcon color='Green' /> /*'●'*/ : (r.estado == 'Sin Pagar' ? <TriangleDownIcon color='Red' /> : <MinusIcon color='yellow' />) }</Td>
                  </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
