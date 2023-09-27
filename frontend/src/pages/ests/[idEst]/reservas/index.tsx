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
import { useParams } from "@/router";
import { useReservasByEstablecimientoID } from "@/utils/api/reservas";
import { useEffect } from "react";
import { fechaISOaDDMMAAAA } from "@/utils/dates";

const dataReservas = {
  reservas: [
    {
      id: 1,
      cancha: 'Cancha 1',
      fechaReserva: '2023-05-07',
      jugador: 'Pepe',
      estado: 'Pagado'
    },
    {
      id: 2,
      cancha: 'Cancha 2',
      fechaReserva: '2023-05-07',
      jugador: 'Coqui',
      estado: 'Sin Pagar'
    },
    {
      id: 3,
      cancha: 'Cancha 3',
      fechaReserva: '2023-05-07',
      jugador: 'Paola',
      estado: 'Señado'
    },
    {
      id: 4,
      cancha: 'Cancha 4',
      fechaReserva: '2023-05-07',
      jugador: 'Moni',
      estado: 'Sin Pagar'
    }
  ]
}

export default function EstablecimientoReservasPage() {
  const { idEst } = useParams("/reservas/:idEst");
  const navigate = useNavigate();

  const { data: reservas } = useReservasByEstablecimientoID(Number(idEst));

  useEffect(() => {
    console.log(reservas)
  }, [reservas])

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
              <Th textAlign='center'>Fecha</Th>
              <Th textAlign='center'>Jugador</Th>
              <Th textAlign='center'>Ver Detalle</Th>
              <Th textAlign='center'>Estado</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {reservas?.map(
              (r) => {
                let estado = <TriangleDownIcon color='Red' />
                if (r.idPagoReserva) {
                  estado = <TriangleUpIcon color='Green' />
                } else if (r.idPagoSenia) {
                  estado = <MinusIcon color='orange' />
                }
                return (
                  <Tr key={r.id}>
                    <Td textAlign='center'>
                      {r.disponibilidad.cancha.nombre}
                    </Td>
                    <Td textAlign='center'>{fechaISOaDDMMAAAA(r.fechaReservada)} </Td>
                    <Td textAlign='center'>{r.jugador.apellido + ", " + r.jugador.nombre}</Td>
                    <Td textAlign='center'>
                      <Button colorScheme="brand" variant='outline' onClick={() => navigate(`${r.id}`)}>Ver Detalle</Button>
                    </Td>
                    <Td textAlign='center'>{estado}</Td>
                  </Tr>
                )
              }

            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
